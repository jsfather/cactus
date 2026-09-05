import { OnlineClassControls } from "@/components/terms/online-class-controls";
import { randomUUID } from "node:crypto";
import Link from "next/link";
import { and, asc, desc, eq, inArray, ne, or } from "drizzle-orm";
import { z } from "zod";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  terms,
  termEnrollments,
  termSessions,
  sessionStudentRecords,
  users,
  previousCourses,
  termPrerequisites,
} from "@/lib/db/schema";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import {
  accessibleTermIds,
  canAccessTerm,
  userNameSql,
} from "@/lib/learning/queries";
import { getTermRoster } from "@/lib/terms/queries";
import { purchaseTerm } from "@/lib/commerce/actions";
import {
  savePreviousCourse,
  deletePreviousCourse,
} from "@/lib/learning/actions";
import { text, title } from "@/lib/workflows";
import {
  ActionForm,
  ActionButton,
  DeleteAction,
  type Field,
} from "./action-form";
import {
  PanelPage,
  PanelPageHeader,
  PanelSurface,
  PanelTable,
  PanelTableCell,
  PanelFormSection,
  PanelEmptyState,
  primaryButtonClass,
} from "@/components/panel/ui";
import { TermStatusBadge } from "@/components/terms/term-status-badge";
export async function StudentTermsPage({ id }: { id?: string }) {
  const user = await requireRole("student");
  const locale = await getPanelLocale();
  const db = getDatabase();
  if (id) {
    if (!z.uuid().safeParse(id).success || !(await canAccessTerm(user, id)))
      notFound();
    const [term] = await db.select().from(terms).where(eq(terms.id, id));
    if (!term) notFound();
    const sessions = await db
      .select({ session: termSessions, record: sessionStudentRecords })
      .from(termSessions)
      .leftJoin(
        sessionStudentRecords,
        and(
          eq(sessionStudentRecords.sessionId, termSessions.id),
          eq(sessionStudentRecords.studentId, user.id),
        ),
      )
      .where(eq(termSessions.termId, id))
      .orderBy(asc(termSessions.sessionDate));
    return (
      <PanelPage>
        <PanelPageHeader
          eyebrow={text(locale, "کلاس‌های من", "My classes")}
          title={title(term, locale)}
          description={
            locale === "en"
              ? term.descriptionEn || term.descriptionFa || ""
              : term.descriptionFa || ""
          }
        />
        <div className="flex flex-wrap gap-3">
          {term.deliveryMode !== "in_person" && <OnlineClassControls termId={term.id} locale={locale} />}
          <Link
            className={primaryButtonClass}
            href="/panel/student/learning/homework"
          >
            {text(locale, "تکالیف", "Homework")}
          </Link>
          <Link
            className={primaryButtonClass}
            href="/panel/student/learning/recordings"
          >
            {text(locale, "جلسات ضبط‌شده", "Recorded lessons")}
          </Link>
        </div>
        <PanelSurface>
          <PanelTable
            columns={[
              { label: text(locale, "جلسه", "Session"), className: "w-[20%]" },
              {
                label: text(locale, "زمان", "Date & time"),
                className: "w-[35%]",
              },
              {
                label: text(locale, "حضور", "Attendance"),
                className: "w-[25%]",
              },
              { label: text(locale, "نمره", "Grade"), className: "w-[20%]" },
            ]}
          >
            {sessions.map(({ session: s, record: r }) => (
              <tr key={s.id}>
                <PanelTableCell>{s.sequence}</PanelTableCell>
                <PanelTableCell>
                  {new Date(`${s.sessionDate}T12:00:00Z`).toLocaleDateString(
                    locale,
                  )}{" "}
                  · {s.startTime.slice(0, 5)}
                </PanelTableCell>
                <PanelTableCell>
                  {r?.attendance
                    ? text(
                        locale,
                        {
                          present: "حاضر",
                          absent: "غایب",
                          late: "تأخیر",
                          excused: "موجه",
                        }[r.attendance],
                        r.attendance,
                      )
                    : "—"}
                  {r?.note && (
                    <p className="mt-1 text-xs text-zinc-500">{r.note}</p>
                  )}
                </PanelTableCell>
                <PanelTableCell>
                  {r?.grade ?? "—"} / {s.gradeMax}
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        </PanelSurface>
      </PanelPage>
    );
  }
  const enrollments = await db
    .select()
    .from(termEnrollments)
    .where(eq(termEnrollments.studentId, user.id));
  const myTerms = await db
    .select()
    .from(terms)
    .where(
      inArray(
        terms.id,
        enrollments.map((e) => e.termId),
      ),
    )
    .orderBy(desc(terms.startDate));
  const available = await db
    .select()
    .from(terms)
    .where(eq(terms.status, "enrollment_open"))
    .orderBy(asc(terms.startDate));
  const prerequisites = await db.select().from(termPrerequisites);
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "آموزش", "Learning")}
        title={text(locale, "کلاس‌ها و ثبت‌نام", "Classes and enrollment")}
        description={text(
          locale,
          "کلاس‌های فعلی، سوابق و دوره‌های قابل ثبت‌نام",
          "Current classes, history, and available enrollment",
        )}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {myTerms.map((t) => (
          <PanelSurface key={t.id} className="space-y-4 p-6">
            <TermStatusBadge status={t.status} locale={locale} />
            <h2 className="text-xl font-bold">{title(t, locale)}</h2>
            <Link
              className={primaryButtonClass}
              href={`/panel/student/terms/${t.id}`}
            >
              {text(locale, "مشاهده کلاس", "Open class")}
            </Link>
          </PanelSurface>
        ))}
      </div>
      <h2 className="text-2xl font-bold">
        {text(locale, "ثبت‌نام در ترم جدید", "Enroll in a new term")}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {available
          .filter(
            (t) =>
              !enrollments.some(
                (e) => e.termId === t.id && e.status !== "withdrawn",
              ),
          )
          .map((t) => {
            const missing = prerequisites.filter(
              (p) =>
                p.termId === t.id &&
                !enrollments.some(
                  (e) =>
                    e.termId === p.prerequisiteTermId &&
                    e.status === "completed",
                ),
            );
            return (
              <PanelSurface key={t.id} className="space-y-4 p-6">
                <h3 className="text-xl font-bold">{title(t, locale)}</h3>
                <p>
                  {t.tuitionToman.toLocaleString(locale)}{" "}
                  {text(locale, "تومان", "toman")}
                </p>
                <p className="text-sm text-zinc-500">
                  {new Date(`${t.startDate}T12:00:00Z`).toLocaleDateString(
                    locale,
                  )}{" "}
                  –{" "}
                  {new Date(`${t.endDate}T12:00:00Z`).toLocaleDateString(
                    locale,
                  )}
                </p>
                {missing.length ? (
                  <p className="text-amber-700 dark:text-amber-400">
                    {text(
                      locale,
                      "ابتدا پیش‌نیازهای این ترم را تکمیل کنید.",
                      "Complete this term's prerequisites first.",
                    )}
                  </p>
                ) : (
                  <ActionButton
                    locale={locale}
                    action={purchaseTerm.bind(null, t.id, randomUUID(), locale)}
                    label={text(locale, "ثبت‌نام", "Enroll")}
                  />
                )}
              </PanelSurface>
            );
          })}
      </div>
      {!available.length && !myTerms.length && (
        <PanelEmptyState
          title={text(locale, "ترمی وجود ندارد", "No terms yet")}
          description=""
        />
      )}
    </PanelPage>
  );
}
export async function StudentAttendancePage({
  role = "student",
  absent = false,
}: {
  role?: "student" | "teacher" | "admin";
  absent?: boolean;
}) {
  const user = await requireRole(role);
  const locale = await getPanelLocale();
  const records = await getDatabase()
    .select({
      record: sessionStudentRecords,
      session: termSessions,
      term: terms,
      name: userNameSql(locale),
    })
    .from(sessionStudentRecords)
    .innerJoin(
      termSessions,
      eq(termSessions.id, sessionStudentRecords.sessionId),
    )
    .innerJoin(terms, eq(terms.id, termSessions.termId))
    .innerJoin(users, eq(users.id, sessionStudentRecords.studentId))
    .where(
      and(
        role === "student"
          ? eq(sessionStudentRecords.studentId, user.id)
          : role === "teacher"
            ? inArray(terms.id, accessibleTermIds(user))
            : undefined,
        absent ? eq(sessionStudentRecords.attendance, "absent") : undefined,
      ),
    )
    .orderBy(desc(termSessions.sessionDate));
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "سوابق آموزشی", "Learning history")}
        title={
          absent
            ? text(locale, "غیبت‌ها", "Absences")
            : text(locale, "حضور و نمره‌ها", "Attendance and grades")
        }
        description=""
      />
      <PanelSurface>
        <PanelTable
          columns={[
            {
              label: text(locale, "کلاس و دانش پژوه", "Class & student"),
              className: "w-[40%]",
            },
            { label: text(locale, "تاریخ", "Date"), className: "w-[25%]" },
            { label: text(locale, "وضعیت", "Status"), className: "w-[20%]" },
            { label: text(locale, "نمره", "Grade"), className: "w-[15%]" },
          ]}
        >
          {records.map(({ record: r, session: s, term: t, name }) => (
            <tr key={r.id}>
              <PanelTableCell>
                {title(t, locale)}
                {role !== "student" && (
                  <p className="mt-1 text-xs text-zinc-500">{name}</p>
                )}
              </PanelTableCell>
              <PanelTableCell>
                {new Date(`${s.sessionDate}T12:00:00Z`).toLocaleDateString(
                  locale,
                )}
              </PanelTableCell>
              <PanelTableCell>
                {r.attendance
                  ? text(
                      locale,
                      {
                        present: "حاضر",
                        absent: "غایب",
                        late: "تأخیر",
                        excused: "موجه",
                      }[r.attendance],
                      r.attendance,
                    )
                  : "—"}
              </PanelTableCell>
              <PanelTableCell>
                {r.grade ?? "—"}/{s.gradeMax}
              </PanelTableCell>
            </tr>
          ))}
        </PanelTable>
        {!records.length && (
          <PanelEmptyState
            title={text(locale, "سابقه‌ای وجود ندارد", "No records yet")}
            description=""
          />
        )}
      </PanelSurface>
    </PanelPage>
  );
}
export async function TeacherStudentsPage({ id }: { id?: string }) {
  const user = await requireRole("teacher");
  const locale = await getPanelLocale();
  const db = getDatabase();
  const students = await db
    .selectDistinct({
      id: users.id,
      name: userNameSql(locale),
      mobile: users.mobile,
    })
    .from(termEnrollments)
    .innerJoin(users, eq(users.id, termEnrollments.studentId))
    .where(
      and(
        inArray(termEnrollments.termId, accessibleTermIds(user)),
        id ? eq(users.id, z.uuid().parse(id)) : undefined,
      ),
    );
  if (id && !students.length) notFound();
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "کلاس‌های من", "My classes")}
        title={text(locale, "دانش پژوهان", "Students")}
        description={text(
          locale,
          "دانش پژوهان ترم‌های اختصاص‌یافته به شما",
          "Students in your assigned terms",
        )}
      />
      <PanelSurface>
        <PanelTable
          columns={[
            { label: text(locale, "نام", "Name"), className: "w-[65%]" },
            {
              label: text(locale, "شماره تماس", "Mobile"),
              className: "w-[35%]",
            },
          ]}
        >
          {students.map((s) => (
            <tr key={s.id}>
              <PanelTableCell>
                <Link
                  href={`/panel/teacher/students/${s.id}`}
                  className="font-semibold"
                >
                  {s.name}
                </Link>
              </PanelTableCell>
              <PanelTableCell>
                <span dir="ltr">{s.mobile}</span>
              </PanelTableCell>
            </tr>
          ))}
        </PanelTable>
      </PanelSurface>
      {id && (
        <p>
          <Link href="/panel/teacher/attendance" className={primaryButtonClass}>
            {text(locale, "حضور و نمره‌ها", "Attendance and grades")}
          </Link>
        </p>
      )}
    </PanelPage>
  );
}
export async function PreviousCoursesPage({
  studentId,
}: {
  studentId?: string;
}) {
  const user = await requireRole(studentId ? "admin" : "student");
  const locale = await getPanelLocale();
  const target = studentId ?? user.id;
  if (!z.uuid().safeParse(target).success) notFound();
  const items = await getDatabase()
    .select()
    .from(previousCourses)
    .where(eq(previousCourses.studentId, target))
    .orderBy(desc(previousCourses.createdAt));
  const fields: Field[] = [
    {
      name: "titleFa",
      label: text(locale, "نام دوره فارسی", "Persian course title"),
      required: true,
    },
    {
      name: "titleEn",
      label: text(locale, "نام دوره انگلیسی", "English course title"),
    },
    {
      name: "institution",
      label: text(locale, "آموزشگاه", "Institution"),
      required: true,
    },
    {
      name: "completedOn",
      label: text(locale, "تاریخ پایان", "Completion date"),
      type: "date",
    },
    {
      name: "description",
      label: text(locale, "توضیحات", "Description"),
      type: "textarea",
    },
  ];
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "اطلاعات دانش پژوه", "Student information")}
        title={text(locale, "دوره‌های گذرانده‌شده", "Previous courses")}
        description={text(
          locale,
          "سابقه یادگیری پیش از پیوستن به کاکتوس",
          "Learning experience before joining Cactus",
        )}
      />
      <ActionForm
        locale={locale}
        action={savePreviousCourse.bind(null, target, null)}
        fields={fields}
      />
      {items.map((c) => (
        <PanelFormSection key={c.id} title={title(c, locale)}>
          <ActionForm
            locale={locale}
            action={savePreviousCourse.bind(null, target, c.id)}
            fields={fields}
            initial={Object.fromEntries(
              Object.entries(c).map(([k, v]) => [k, String(v ?? "")]),
            )}
          />
          <div className="mt-4">
            <DeleteAction
              locale={locale}
              action={deletePreviousCourse.bind(null, c.id, locale)}
            />
          </div>
        </PanelFormSection>
      ))}
    </PanelPage>
  );
}
