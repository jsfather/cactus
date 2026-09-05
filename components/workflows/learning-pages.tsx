import Link from "next/link";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  learningActivities,
  terms,
  termEnrollments,
  termSessions,
  homeworkSubmissions,
  homeworkMessages,
  users,
} from "@/lib/db/schema";
import {
  accessibleTermIds,
  getActivity,
  userNameSql,
} from "@/lib/learning/queries";
import {
  saveActivity,
  deleteActivity,
  submitHomework,
  reviewHomework,
  homeworkReply,
  deleteSubmission,
} from "@/lib/learning/actions";
import { activityKind, activityLabels } from "@/lib/resources/config";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { text, title } from "@/lib/workflows";
import { ActionForm, DeleteAction } from "./action-form";
import {
  PanelPage,
  PanelPageHeader,
  PanelPrimaryLink,
  PanelSurface,
  PanelTable,
  PanelTableCell,
  PanelTableActions,
  PanelTableActionLink,
  PanelEditIcon,
  PanelReviewIcon,
  PanelEmptyState,
  PanelFormSection,
} from "@/components/panel/ui";
import { RichContent } from "@/components/content/rich-content";
export async function LearningPage({
  role,
  kind: raw,
  id,
  edit = false,
}: {
  role: "admin" | "teacher" | "student";
  kind: string;
  id?: string;
  edit?: boolean;
}) {
  const user = await requireRole(role);
  const locale = await getPanelLocale();
  const parsed = activityKind.safeParse(raw);
  if (!parsed.success || (role === "student" && raw === "reports")) notFound();
  const kind = parsed.data;
  const label = activityLabels[kind][locale === "fa" ? 0 : 1];
  const base = `/panel/${role}/learning/${kind}`;
  const db = getDatabase();
  const manage = role !== "student";
  if (id && id !== "new" && !z.uuid().safeParse(id).success) notFound();
  const item = id && id !== "new" ? await getActivity(user, id, edit) : null;
  if (id && id !== "new" && (!item || item.kind !== kind)) notFound();
  if (id === "new" || edit) {
    if (!manage) notFound();
    const termOptions = await db
      .select()
      .from(terms)
      .where(
        role === "admin"
          ? undefined
          : inArray(terms.id, accessibleTermIds(user)),
      )
      .orderBy(desc(terms.startDate));
    const sessionOptions = await db
      .select()
      .from(termSessions)
      .where(
        inArray(
          termSessions.termId,
          termOptions.map((t) => t.id),
        ),
      )
      .orderBy(desc(termSessions.sessionDate));
    return (
      <PanelPage>
        <PanelPageHeader
          eyebrow={label}
          title={text(locale, "ویرایش فعالیت آموزشی", "Edit learning activity")}
          description=""
        />
        <ActionForm
          locale={locale}
          action={saveActivity.bind(null, item?.id ?? null)}
          initial={{
            kind,
            ...(item
              ? Object.fromEntries(
                  Object.entries(item).map(([k, v]) => [
                    k,
                    v instanceof Date
                      ? v.toISOString().slice(0, 16)
                      : String(v ?? ""),
                  ]),
                )
              : {}),
          }}
          fields={[
            {
              name: "kind",
              label: text(locale, "نوع", "Type"),
              options: [{ value: kind, label }],
            },
            {
              name: "termId",
              label: text(locale, "ترم", "Term"),
              required: true,
              options: termOptions.map((t) => ({
                value: t.id,
                label: title(t, locale),
              })),
            },
            {
              name: "sessionId",
              label: text(locale, "جلسه (اختیاری)", "Session (optional)"),
              options: [
                { value: "", label: text(locale, "بدون جلسه", "No session") },
                ...sessionOptions.map((s) => ({
                  value: s.id,
                  label: `${title(termOptions.find((t) => t.id === s.termId)!, locale)} · ${s.sessionDate}`,
                })),
              ],
            },
            {
              name: "titleFa",
              label: text(locale, "عنوان فارسی", "Persian title"),
              required: true,
            },
            {
              name: "titleEn",
              label: text(locale, "عنوان انگلیسی", "English title"),
            },
            {
              name: "contentFa",
              label: text(locale, "متن فارسی", "Persian content"),
              type: role === "admin" ? "rich" : "textarea",
              required: true,
            },
            {
              name: "contentEn",
              label: text(locale, "متن انگلیسی", "English content"),
              type: role === "admin" ? "rich" : "textarea",
            },
            {
              name: "attachmentUrl",
              label: text(locale, "پیوند فایل", "Attachment link"),
              type: "url",
            },
            {
              name: "videoUrl",
              label: text(locale, "پیوند ویدئو", "Video link"),
              type: "url",
            },
            {
              name: "dueAt",
              label: text(locale, "مهلت تحویل", "Due date"),
              type: "datetime-local",
            },
            {
              name: "status",
              label: text(locale, "وضعیت", "Status"),
              options: [
                { value: "draft", label: text(locale, "پیش‌نویس", "Draft") },
                {
                  value: "published",
                  label: text(locale, "منتشرشده", "Published"),
                },
              ],
            },
          ]}
        />
      </PanelPage>
    );
  }
  if (item) {
    const submissions =
      kind === "homework"
        ? await db
            .select({
              submission: homeworkSubmissions,
              name: userNameSql(locale),
            })
            .from(homeworkSubmissions)
            .innerJoin(users, eq(users.id, homeworkSubmissions.studentId))
            .where(
              and(
                eq(homeworkSubmissions.activityId, item.id),
                manage ? undefined : eq(homeworkSubmissions.studentId, user.id),
              ),
            )
        : [];
    const messages = submissions.length
      ? await db
          .select({ message: homeworkMessages, name: userNameSql(locale) })
          .from(homeworkMessages)
          .innerJoin(users, eq(users.id, homeworkMessages.authorId))
          .where(
            inArray(
              homeworkMessages.submissionId,
              submissions.map((s) => s.submission.id),
            ),
          )
          .orderBy(asc(homeworkMessages.createdAt))
      : [];
    const students = role === "admin" && kind === "homework" ? await db.select({ id: users.id, name: userNameSql(locale) }).from(users).innerJoin(termEnrollments, eq(termEnrollments.studentId, users.id)).where(and(eq(termEnrollments.termId, item.termId), eq(users.role, "student"))) : [];
    return (
      <PanelPage>
        <PanelPageHeader
          eyebrow={label}
          title={title(item, locale)}
          description={
            item.dueAt
              ? `${text(locale, "مهلت تحویل", "Due")}: ${item.dueAt.toLocaleString(locale)}`
              : ""
          }
          actions={
            manage ? (
              <PanelPrimaryLink href={`${base}/${id}/edit`}>
                {text(locale, "ویرایش", "Edit")}
              </PanelPrimaryLink>
            ) : undefined
          }
        />
        <PanelSurface className="p-6">
          <RichContent
            html={
              locale === "en"
                ? item.contentEn || item.contentFa
                : item.contentFa
            }
          />
          <div className="mt-6 flex gap-6">
            {item.attachmentUrl && (
              <a
                className="text-emerald-700 dark:text-emerald-400"
                href={item.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text(locale, "دریافت فایل", "Download attachment")}
              </a>
            )}
            {item.videoUrl && (
              <a
                className="text-emerald-700 dark:text-emerald-400"
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text(locale, "مشاهده ویدئو", "Watch recording")}
              </a>
            )}
          </div>
        </PanelSurface>
        {kind === "homework" && role === "student" && (
          <ActionForm
            locale={locale}
            heading={text(locale, "پاسخ شما", "Your submission")}
            action={submitHomework.bind(null, item.id)}
            initial={{
              body: submissions[0]?.submission.body ?? "",
              attachmentUrl: submissions[0]?.submission.attachmentUrl ?? "",
            }}
            fields={[
              {
                name: "body",
                label: text(locale, "پاسخ", "Answer"),
                type: "textarea",
                required: true,
              },
              {
                name: "attachmentUrl",
                label: text(
                  locale,
                  "پیوند فایل پاسخ",
                  "Answer attachment link",
                ),
                type: "url",
              },
            ]}
          />
        )}
        {role === "admin" && kind === "homework" && <ActionForm locale={locale} heading={text(locale, "ثبت یا اصلاح پاسخ دانش‌آموز", "Create or update student submission")} action={submitHomework.bind(null, item.id)} fields={[
          { name: "studentId", label: text(locale, "دانش‌آموز", "Student"), options: students.map(s => ({ value: s.id, label: s.name })), required: true },
          { name: "body", label: text(locale, "پاسخ", "Answer"), type: "textarea", required: true },
          { name: "attachmentUrl", label: text(locale, "فایل پاسخ", "Submission attachment"), type: "url" },
        ]} />}
        {submissions.map(({ submission: s, name }) => (
          <PanelFormSection key={s.id} title={name}>
            <div className="space-y-5">
              <p className="whitespace-pre-wrap">{s.body}</p>
              {s.attachmentUrl && (
                <a
                  href={s.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700"
                >
                  {text(locale, "فایل پاسخ", "Submission attachment")}
                </a>
              )}
              <p className="text-sm text-zinc-500">
                {s.updatedAt.toLocaleString(locale)}
                {item.dueAt && s.updatedAt > item.dueAt
                  ? text(locale, " · تحویل دیرهنگام", " · Late submission")
                  : ""}
              </p>
              {s.grade !== null && (
                <p className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950">
                  {text(locale, "نمره", "Grade")}: {s.grade}/100 · {s.feedback}
                </p>
              )}
              {manage && (
                <ActionForm
                  locale={locale}
                  action={reviewHomework.bind(null, s.id)}
                  initial={{
                    grade: String(s.grade ?? 0),
                    feedback: s.feedback ?? "",
                  }}
                  fields={[
                    {
                      name: "grade",
                      label: text(locale, "نمره از ۱۰۰", "Grade out of 100"),
                      type: "number",
                      min: 0,
                      max: 100,
                      required: true,
                    },
                    {
                      name: "feedback",
                      label: text(locale, "بازخورد", "Feedback"),
                      type: "textarea",
                    },
                  ]}
                />
              )}
              <div className="space-y-3">
                {messages
                  .filter((m) => m.message.submissionId === s.id)
                  .map((m) => (
                    <div
                      key={m.message.id}
                      className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900"
                    >
                      <p className="text-xs text-zinc-500">
                        {m.name} · {m.message.createdAt.toLocaleString(locale)}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap">
                        {m.message.body}
                      </p>
                    </div>
                  ))}
              </div>
              <ActionForm
                locale={locale}
                heading={text(
                  locale,
                  "گفت‌وگوی تکلیف",
                  "Homework conversation",
                )}
                action={homeworkReply.bind(null, s.id)}
                fields={[
                  {
                    name: "body",
                    label: text(locale, "پیام", "Message"),
                    type: "textarea",
                    required: true,
                  },
                ]}
              />
              {(role === "admin" || role === "student") && (
                <DeleteAction
                  locale={locale}
                  action={deleteSubmission.bind(null, s.id, locale)}
                />
              )}
            </div>
          </PanelFormSection>
        ))}
      </PanelPage>
    );
  }
  const items = await db
    .select({ activity: learningActivities, term: terms })
    .from(learningActivities)
    .innerJoin(terms, eq(terms.id, learningActivities.termId))
    .where(
      and(
        eq(learningActivities.kind, kind),
        role === "admin"
          ? undefined
          : inArray(learningActivities.termId, accessibleTermIds(user)),
        manage ? undefined : eq(learningActivities.status, "published"),
      ),
    )
    .orderBy(desc(learningActivities.createdAt));
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "آموزش", "Learning")}
        title={label}
        description={text(
          locale,
          "فعالیت‌های مرتبط با کلاس‌های شما",
          "Activities connected to your classes",
        )}
        actions={
          manage ? (
            <PanelPrimaryLink href={`${base}/new`}>
              {text(locale, "ایجاد", "Create")}
            </PanelPrimaryLink>
          ) : undefined
        }
      />
      <PanelSurface>
        {items.length ? (
          <PanelTable
            columns={[
              { label: text(locale, "عنوان", "Title"), className: "w-[45%]" },
              { label: text(locale, "ترم", "Term"), className: "w-[35%]" },
              {
                label: text(locale, "عملیات", "Actions"),
                className: "w-[20%]",
              },
            ]}
          >
            {items.map(({ activity: a, term }) => (
              <tr key={a.id}>
                <PanelTableCell>
                  <Link href={`${base}/${a.id}`} className="font-semibold">
                    {title(a, locale)}
                  </Link>
                </PanelTableCell>
                <PanelTableCell>{title(term, locale)}</PanelTableCell>
                <PanelTableCell>
                  <PanelTableActions>
                    <PanelTableActionLink
                      href={`${base}/${a.id}`}
                      label={text(locale, "مشاهده", "View")}
                    >
                      <PanelReviewIcon />
                    </PanelTableActionLink>
                    {manage && (
                      <>
                        <PanelTableActionLink
                          href={`${base}/${a.id}/edit`}
                          label={text(locale, "ویرایش", "Edit")}
                        >
                          <PanelEditIcon />
                        </PanelTableActionLink>
                        <DeleteAction
                          locale={locale}
                          action={deleteActivity.bind(null, a.id, locale)}
                        />
                      </>
                    )}
                  </PanelTableActions>
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={text(locale, "فعالیتی وجود ندارد", "No activities yet")}
            description=""
          />
        )}
      </PanelSurface>
    </PanelPage>
  );
}
