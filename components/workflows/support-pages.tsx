import Link from "next/link";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { formatPanelDate } from "@/lib/date/panel";
import { z } from "zod";
import { notFound } from "next/navigation";
import { requireUser, requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  tickets,
  ticketMessages,
  ticketDepartments,
  users,
  termEnrollments,
  terms,
  attachments,
  notifications,
} from "@/lib/db/schema";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { userNameSql } from "@/lib/learning/queries";
import { text, title } from "@/lib/workflows";
import {
  saveTicket,
  replyTicket,
  rateTicket,
  deleteTicket,
  changeTicketStatus,
  saveDepartment,
  deleteDepartment,
  saveNotification,
  readNotification,
  deleteNotification,
} from "@/lib/support/actions";
import {
  ActionForm,
  DeleteAction,
  ActionButton,
  type Field,
} from "./action-form";
import {
  PanelPage,
  PanelPageHeader,
  PanelPrimaryLink,
  PanelSurface,
  PanelTable,
  PanelTableCell,
  PanelEmptyState,
  PanelFormSection,
} from "@/components/panel/ui";
export async function TicketsPage({
  id,
  edit = false,
}: {
  id?: string;
  edit?: boolean;
}) {
  const user = await requireUser();
  const locale = await getPanelLocale();
  const admin = user.role === "admin";
  const db = getDatabase();
  if (id && id !== "new" && !z.uuid().safeParse(id).success) notFound();
  const [ticket] =
    id && id !== "new"
      ? await db
          .select()
          .from(tickets)
          .where(
            and(
              eq(tickets.id, id),
              admin
                ? undefined
                : or(
                    eq(tickets.ownerId, user.id),
                    user.role === "teacher"
                      ? eq(tickets.assignedToId, user.id)
                      : undefined,
                  ),
            ),
          )
      : [];
  if (id && id !== "new" && !ticket) notFound();
  const statusLabel = (status: string) =>
    text(
      locale,
      (
        {
          open: "در انتظار پاسخ",
          pending: "پاسخ‌داده‌شده",
          closed: "بسته‌شده",
        } as Record<string, string>
      )[status] ?? status,
      (
        {
          open: "Awaiting response",
          pending: "Answered",
          closed: "Closed",
        } as Record<string, string>
      )[status] ?? status,
    );
  if (id === "new" || edit) {
    if (edit && !admin) notFound();
    const departments = await db
      .select()
      .from(ticketDepartments)
      .where(eq(ticketDepartments.isActive, true));
    const people = admin
      ? await db
          .select({ id: users.id, name: userNameSql(locale), role: users.role })
          .from(users)
          .where(eq(users.isActive, true))
      : [];
    const fields: Field[] = [
      {
        name: "subject",
        label: text(locale, "موضوع", "Subject"),
        required: true,
      },
      {
        name: "departmentId",
        label: text(locale, "دپارتمان", "Department"),
        options: departments.map((d) => ({
          value: d.id,
          label: title(d, locale),
        })),
        required: true,
      },
      ...(!edit
        ? [
            {
              name: "body",
              label: text(locale, "پیام", "Message"),
              type: "textarea",
            },
            {
              name: "attachmentUrl",
              label: text(locale, "پیوند فایل", "Attachment link"),
              type: "url",
            },
          ]
        : []),
    ];
    if (admin)
      fields.push(
        {
          name: "ownerId",
          label: text(locale, "صاحب تیکت", "Ticket owner"),
          options: people.map((p) => ({ value: p.id, label: p.name })),
        },
        {
          name: "assignedToId",
          label: text(locale, "مسئول پاسخ", "Assignee"),
          options: [
            { value: "", label: text(locale, "تعیین نشده", "Unassigned") },
            ...people
              .filter((p) => ["teacher", "admin"].includes(p.role))
              .map((p) => ({ value: p.id, label: p.name })),
          ],
        },
        {
          name: "status",
          label: text(locale, "وضعیت", "Status"),
          options: [
            { value: "open", label: statusLabel("open") },
            { value: "pending", label: statusLabel("pending") },
            { value: "closed", label: text(locale, "بسته", "Closed") },
          ],
        },
      );
    return (
      <PanelPage>
        <PanelPageHeader
          eyebrow={text(locale, "پشتیبانی", "Support")}
          title={text(locale, "تیکت", "Ticket")}
          description=""
        />
        <ActionForm
          locale={locale}
          action={saveTicket.bind(null, ticket?.id ?? null)}
          initial={
            ticket
              ? Object.fromEntries(
                  Object.entries(ticket).map(([k, v]) => [k, String(v ?? "")]),
                )
              : {}
          }
          fields={fields}
        />
      </PanelPage>
    );
  }
  if (ticket) {
    const messages = await db
      .select({ message: ticketMessages, name: userNameSql(locale), attachmentMime: attachments.mimeType })
      .from(ticketMessages)
      .innerJoin(users, eq(users.id, ticketMessages.authorId))
      .leftJoin(attachments, eq(ticketMessages.attachmentUrl, sql`'/api/attachments/' || ${attachments.id}::text`))
      .where(eq(ticketMessages.ticketId, ticket.id))
      .orderBy(desc(ticketMessages.createdAt), desc(ticketMessages.id))
      .limit(200);
    const [department] = await db
      .select()
      .from(ticketDepartments)
      .where(eq(ticketDepartments.id, ticket.departmentId))
      .limit(1);
    const [requester] = admin
      ? await db
          .select({
            name: userNameSql(locale),
            mobile: users.mobile,
            role: users.role,
          })
          .from(users)
          .where(eq(users.id, ticket.ownerId))
          .limit(1)
      : [];
    const requesterTerms = admin
      ? await db
          .select({ titleFa: terms.titleFa, titleEn: terms.titleEn })
          .from(termEnrollments)
          .innerJoin(terms, eq(terms.id, termEnrollments.termId))
          .where(eq(termEnrollments.studentId, ticket.ownerId))
          .orderBy(desc(terms.startDate))
          .limit(10)
      : [];
    return (
      <PanelPage>
        <PanelPageHeader
          eyebrow={text(locale, "پشتیبانی", "Support")}
          title={ticket.subject}
          description={`${statusLabel(ticket.status)} · ${department ? title(department, locale) : ""}`}
          actions={
            admin ? (
              <PanelPrimaryLink href={`/panel/tickets/${ticket.id}/edit`}>
                {text(locale, "ویرایش", "Edit")}
              </PanelPrimaryLink>
            ) : undefined
          }
        />
        {requester && (
          <PanelSurface>
            <h2 className="font-bold">
              {text(locale, "مشخصات درخواست‌کننده", "Requester")}
            </h2>
            <p className="mt-2">
              {requester.name} ·{" "}
              <bdi dir="ltr" className="nums-en">
                {requester.mobile}
              </bdi>
            </p>
            {requesterTerms.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {requesterTerms.map((term, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800"
                  >
                    {title(term, locale)}
                  </span>
                ))}
              </div>
            )}
            {requester.role === "student" && (
              <Link
                className="mt-3 inline-flex cursor-pointer text-sm text-emerald-600"
                href={`/panel/admin/students/${ticket.ownerId}`}
              >
                {text(
                  locale,
                  "مشاهده پرونده کامل دانش‌پژوه",
                  "View full student record",
                )}{" "}
                ↗
              </Link>
            )}
          </PanelSurface>
        )}
        <PanelSurface className="bg-zinc-50 dark:bg-zinc-900">
          <p className="mb-4 text-xs text-zinc-500">
            {text(
              locale,
              "نمایش حداکثر ۲۰۰ پیام اخیر",
              "Showing up to 200 latest messages",
            )}
          </p>
          <div
            className="max-h-[65vh] space-y-4 overflow-y-auto p-1"
            role="log"
            aria-label={text(locale, "گفت‌وگوی تیکت", "Ticket conversation")}
          >
            {messages.reverse().map(({ message: m, name, attachmentMime }) => (
              <article
                key={m.id}
                className={`w-fit max-w-[90%] rounded-2xl border p-4 sm:max-w-[80%] ${m.authorId === user.id ? "ms-auto border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950" : "me-auto border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"}`}
              >
                <p className="text-sm text-zinc-500">
                  {name} · {formatPanelDate(m.createdAt, locale, true)}
                </p>
                <p className="mt-2 whitespace-pre-wrap break-words leading-7">
                  {m.body}
                </p>
                {m.attachmentUrl && (
                  attachmentMime === "audio/webm" ? <audio controls preload="none" src={m.attachmentUrl} aria-label={text(locale, "پیام صوتی", "Voice message")} className="mt-3 max-w-full" /> :
                  <a
                    className="text-emerald-700"
                    href={m.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text(locale, "فایل پیوست", "Attachment")}
                  </a>
                )}
              </article>
            ))}
          </div>
        </PanelSurface>
        {ticket.rating && <PanelSurface><p>{text(locale, "امتیاز پاسخ‌گویی", "Response rating")}: <span className="text-amber-500" aria-label={`${ticket.rating}/5`}>{"★".repeat(ticket.rating)}{"☆".repeat(5 - ticket.rating)}</span></p></PanelSurface>}
        {ticket.status === "closed" && ticket.ownerId === user.id && messages.some(item => item.message.authorId !== user.id) && <ActionForm locale={locale} action={rateTicket.bind(null, ticket.id)} heading={text(locale, "امتیاز به پاسخ‌گو", "Rate the responder")} initial={{ rating: String(ticket.rating ?? 0) }} fields={[{ name: "rating", label: text(locale, "رضایت از پاسخ‌گویی", "Response satisfaction"), options: [{ value: "0", label: text(locale, "بدون امتیاز", "No rating") }, ...[1,2,3,4,5].map(value => ({ value: String(value), label: "★".repeat(value) }))] }]} />}
        {ticket.status !== "closed" && (
          <ActionForm
            locale={locale}
            action={replyTicket.bind(null, ticket.id)}
            heading={text(locale, "پاسخ", "Reply")}
            fields={[
              {
                name: "body",
                label: text(locale, "پیام", "Message"),
                type: "textarea",
              },
              {
                name: "attachmentUrl",
                label: text(locale, "پیوند فایل", "Attachment link"),
                type: "url",
              },
            ]}
          />
        )}
        <ActionButton
          locale={locale}
          action={changeTicketStatus.bind(
            null,
            ticket.id,
            ticket.status === "closed" ? "open" : "closed",
            locale,
          )}
          label={
            ticket.status === "closed"
              ? text(locale, "بازگشایی تیکت", "Reopen ticket")
              : text(locale, "بستن تیکت", "Close ticket")
          }
        />
      </PanelPage>
    );
  }
  const items = await db
    .select({
      id: tickets.id,
      subject: tickets.subject,
      status: tickets.status,
      messageCount: sql<number>`(select count(*)::int from ticket_messages where ticket_messages.ticket_id = ${tickets.id})`,
    })
    .from(tickets)
    .where(
      admin
        ? undefined
        : or(
            eq(tickets.ownerId, user.id),
            user.role === "teacher"
              ? eq(tickets.assignedToId, user.id)
              : undefined,
          ),
    )
    .orderBy(desc(tickets.updatedAt));
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "پشتیبانی", "Support")}
        title={text(locale, "تیکت‌ها", "Tickets")}
        description={text(
          locale,
          "گفت‌وگوهای پشتیبانی و آموزشی شما",
          "Your support and learning conversations",
        )}
        actions={
          <PanelPrimaryLink href="/panel/tickets/new">
            {text(locale, "تیکت جدید", "New ticket")}
          </PanelPrimaryLink>
        }
      />
      {admin && (
        <Link
          href="/panel/admin/departments"
          className="text-emerald-700 dark:text-emerald-400"
        >
          {text(locale, "مدیریت دپارتمان‌ها", "Manage departments")}
        </Link>
      )}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: text(locale, "جدید", "New"),
            count: items.filter(
              (item) => item.status === "open" && item.messageCount <= 1,
            ).length,
          },
          {
            label: text(locale, "در انتظار پاسخ", "Awaiting response"),
            count: items.filter(
              (item) => item.status === "open" && item.messageCount > 1,
            ).length,
          },
          {
            label: text(locale, "پاسخ‌داده‌شده", "Answered"),
            count: items.filter((item) => item.status === "pending").length,
          },
          {
            label: text(locale, "بسته‌شده", "Closed"),
            count: items.filter((item) => item.status === "closed").length,
          },
        ].map((item) => (
          <PanelSurface key={item.label}>
            <p className="text-sm text-zinc-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold">
              {item.count.toLocaleString(locale)}
            </p>
          </PanelSurface>
        ))}
      </div>
      <PanelSurface>
        {items.length ? (
          <PanelTable
            columns={[
              { label: text(locale, "موضوع", "Subject"), className: "w-[60%]" },
              { label: text(locale, "وضعیت", "Status"), className: "w-[25%]" },
              {
                label: text(locale, "عملیات", "Actions"),
                className: "w-[15%]",
              },
            ]}
          >
            {items.map((t) => (
              <tr key={t.id}>
                <PanelTableCell>
                  <Link
                    href={`/panel/tickets/${t.id}`}
                    className="font-semibold"
                  >
                    {t.subject}
                  </Link>
                </PanelTableCell>
                <PanelTableCell>
                  {t.status === "open" && t.messageCount <= 1
                    ? text(locale, "جدید", "New")
                    : statusLabel(t.status)}
                </PanelTableCell>
                <PanelTableCell>
                  {admin && (
                    <DeleteAction
                      locale={locale}
                      action={deleteTicket.bind(null, t.id, locale)}
                    />
                  )}
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={text(locale, "تیکتی وجود ندارد", "No tickets yet")}
            description=""
          />
        )}
      </PanelSurface>
    </PanelPage>
  );
}
export async function DepartmentsPage() {
  await requireRole("admin");
  const locale = await getPanelLocale();
  const items = await getDatabase().select().from(ticketDepartments);
  const fields: Field[] = [
    {
      name: "titleFa",
      label: text(locale, "عنوان فارسی", "Persian title"),
      required: true,
    },
    { name: "titleEn", label: text(locale, "عنوان انگلیسی", "English title") },
    {
      name: "isActive",
      label: text(locale, "وضعیت", "Status"),
      options: [
        { value: "true", label: text(locale, "فعال", "Active") },
        { value: "false", label: text(locale, "غیرفعال", "Inactive") },
      ],
    },
  ];
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "پشتیبانی", "Support")}
        title={text(locale, "دپارتمان‌ها", "Departments")}
        description=""
      />
      <ActionForm
        locale={locale}
        heading={text(locale, "دپارتمان جدید", "New department")}
        action={saveDepartment.bind(null, null)}
        fields={fields}
      />
      {items.map((d) => (
        <PanelFormSection key={d.id} title={title(d, locale)}>
          <ActionForm
            locale={locale}
            action={saveDepartment.bind(null, d.id)}
            initial={{
              titleFa: d.titleFa,
              titleEn: d.titleEn ?? "",
              isActive: String(d.isActive),
            }}
            fields={fields}
          />
          <div className="mt-4">
            <DeleteAction
              locale={locale}
              action={deleteDepartment.bind(null, d.id, locale)}
            />
          </div>
        </PanelFormSection>
      ))}
    </PanelPage>
  );
}
export async function NotificationsPage({
  admin = false,
}: {
  admin?: boolean;
}) {
  const user = admin ? await requireRole("admin") : await requireUser();
  const locale = await getPanelLocale();
  const db = getDatabase();
  const items = await db
    .select()
    .from(notifications)
    .where(admin ? undefined : eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt));
  const people = admin
    ? await db.select({ id: users.id, name: userNameSql(locale) }).from(users)
    : [];
  const fields: Field[] = [
    {
      name: "userId",
      label: text(locale, "گیرنده", "Recipient"),
      options: people.map((p) => ({ value: p.id, label: p.name })),
    },
    {
      name: "titleFa",
      label: text(locale, "عنوان فارسی", "Persian title"),
      required: true,
    },
    { name: "titleEn", label: text(locale, "عنوان انگلیسی", "English title") },
    {
      name: "bodyFa",
      label: text(locale, "متن فارسی", "Persian message"),
      type: "textarea",
      required: true,
    },
    {
      name: "bodyEn",
      label: text(locale, "متن انگلیسی", "English message"),
      type: "textarea",
    },
    { name: "href", label: text(locale, "مسیر داخلی", "Internal path") },
  ];
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "پنل", "Workspace")}
        title={text(locale, "اعلان‌ها", "Notifications")}
        description=""
      />
      {admin && (
        <ActionForm
          locale={locale}
          action={saveNotification.bind(null, null)}
          fields={fields}
        />
      )}
      <div className="space-y-4">
        {items.map((n) => (
          <PanelSurface key={n.id} className="p-6">
            <h2 className="font-bold">
              {title(n, locale)}{" "}
              {!n.readAt && <span className="text-emerald-600">●</span>}
            </h2>
            <p className="mt-3 whitespace-pre-wrap">
              {locale === "en" ? n.bodyEn || n.bodyFa : n.bodyFa}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {n.href && (
                <Link
                  className="text-emerald-700 dark:text-emerald-400"
                  href={n.href}
                >
                  {text(locale, "مشاهده", "Open")}
                </Link>
              )}
              {!admin && !n.readAt && (
                <ActionButton
                  locale={locale}
                  action={readNotification.bind(null, n.id, locale)}
                  label={text(locale, "خوانده شد", "Mark read")}
                />
              )}
              <DeleteAction
                locale={locale}
                action={deleteNotification.bind(null, n.id, locale)}
              />
            </div>
            {admin && (
              <details className="mt-4">
                <summary className="cursor-pointer">
                  {text(locale, "ویرایش", "Edit")}
                </summary>
                <ActionForm
                  locale={locale}
                  action={saveNotification.bind(null, n.id)}
                  initial={Object.fromEntries(
                    Object.entries(n).map(([k, v]) => [k, String(v ?? "")]),
                  )}
                  fields={fields}
                />
              </details>
            )}
          </PanelSurface>
        ))}
      </div>
      {!items.length && (
        <PanelEmptyState
          title={text(locale, "اعلانی وجود ندارد", "No notifications yet")}
          description=""
        />
      )}
    </PanelPage>
  );
}
