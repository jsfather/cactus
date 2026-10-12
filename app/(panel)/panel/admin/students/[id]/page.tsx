import { PanelStatCard, PanelStatGrid } from "@/components/panel/stat-card";
import Link from "next/link";
import { and, desc, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  users,
  terms,
  termEnrollments,
  termSessions,
  sessionStudentRecords,
  orders,
  orderItems,
  loginEvents,
} from "@/lib/db/schema";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getLocalizedUserName } from "@/lib/users/name";
import { formatPanelDate } from "@/lib/date/panel";
import {
  PanelPage,
  PanelPageHeader,
  PanelSurface,
  PanelTable,
  PanelTableCell,
  PanelPrimaryLink,
} from "@/components/panel/ui";

export default async function StudentHistory({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  await requireRole("admin");
  const [{ id }, query, locale] = await Promise.all([
    params,
    searchParams,
    getPanelLocale(),
  ]);
  if (!z.uuid().safeParse(id).success) notFound();
  const page = z.coerce
    .number()
    .int()
    .min(1)
    .max(100000)
    .catch(1)
    .parse(query.page ?? 1);
  const db = getDatabase();
  const [student] = await db
    .select({
      id: users.id,
      firstNameFa: users.firstNameFa,
      lastNameFa: users.lastNameFa,
      firstNameEn: users.firstNameEn,
      lastNameEn: users.lastNameEn,
      mobile: users.mobile,
    })
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, "student")))
    .limit(1);
  if (!student) notFound();
  const [enrollments, attendance, studentOrders, totals, logins, termPayments] =
    await Promise.all([
      db
        .select({ term: terms, status: termEnrollments.status })
        .from(termEnrollments)
        .innerJoin(terms, eq(terms.id, termEnrollments.termId))
        .where(eq(termEnrollments.studentId, id))
        .orderBy(desc(terms.startDate)),
      db
        .select({
          record: sessionStudentRecords,
          date: termSessions.sessionDate,
          time: termSessions.startTime,
          titleFa: terms.titleFa,
          titleEn: terms.titleEn,
        })
        .from(sessionStudentRecords)
        .innerJoin(
          termSessions,
          eq(termSessions.id, sessionStudentRecords.sessionId),
        )
        .innerJoin(terms, eq(terms.id, termSessions.termId))
        .where(eq(sessionStudentRecords.studentId, id))
        .orderBy(
          desc(termSessions.sessionDate),
          desc(termSessions.startTime),
          desc(sessionStudentRecords.id),
        )
        .limit(51)
        .offset((page - 1) * 50),
      db
        .select({
          id: orders.id,
          code: orders.code,
          total: orders.totalToman,
          status: orders.paymentStatus,
          date: orders.createdAt,
        })
        .from(orders)
        .where(eq(orders.userId, id))
        .orderBy(desc(orders.createdAt), desc(orders.id))
        .limit(51)
        .offset((page - 1) * 50),
      db
        .select({
          paid: sql<string>`coalesce(sum(${orders.totalToman}) filter (where ${orders.paymentStatus} = 'paid'), 0)`,
          pending: sql<string>`coalesce(sum(${orders.totalToman}) filter (where ${orders.paymentStatus} = 'pending'), 0)`,
        })
        .from(orders)
        .where(eq(orders.userId, id)),
      db
        .select({
          id: loginEvents.id,
          method: loginEvents.method,
          date: loginEvents.createdAt,
        })
        .from(loginEvents)
        .where(eq(loginEvents.userId, id))
        .orderBy(desc(loginEvents.createdAt), desc(loginEvents.id))
        .limit(51)
        .offset((page - 1) * 50),
      db
        .select({
          termId: orderItems.termId,
          paid: sql<string>`sum(${orderItems.quantity} * ${orderItems.unitPriceToman})`,
        })
        .from(orderItems)
        .innerJoin(orders, eq(orders.id, orderItems.orderId))
        .where(and(eq(orders.userId, id), eq(orders.paymentStatus, "paid")))
        .groupBy(orderItems.termId),
    ]);
  const fa = locale === "fa";
  const t = (persian: string, english: string) => (fa ? persian : english);
  const money = (value: number | string) =>
    `${BigInt(value).toLocaleString(locale)} ${t("تومان", "toman")}`;
  const attendanceLabels = {
    present: t("حاضر", "Present"),
    absent: t("غایب", "Absent"),
    late: t("تأخیر", "Late"),
    excused: t("غیبت موجه", "Excused"),
  };
  const paidByTerm = new Map(
    termPayments.map((payment) => [payment.termId, payment.paid]),
  );
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={t("پرونده دانش‌پژوه", "Student record")}
        title={getLocalizedUserName(student, locale)}
        description={t(
          "سوابق آموزشی، سفارش‌ها و حضور و غیاب ثبت‌شده",
          "Recorded enrollments, orders and attendance",
        )}
      />
      <div className="flex flex-wrap gap-3">
        <PanelPrimaryLink href={`/panel/admin/students/${id}/information`}>
          {t("اطلاعات دانش‌پژوه", "Student information")}
        </PanelPrimaryLink>
        <PanelPrimaryLink href={`/panel/admin/students/${id}/edit`}>
          {t("ویرایش حساب", "Edit account")}
        </PanelPrimaryLink>
      </div>
      <PanelStatGrid>
        <PanelStatCard
          label={t("مجموع سفارش‌های پرداخت‌شده", "Total paid orders")}
          value={money(totals[0]?.paid ?? "0")}
          icon="trend"
        />
        <PanelStatCard
          label={t("مبلغ سفارش‌های در انتظار پرداخت", "Pending order amount")}
          value={money(totals[0]?.pending ?? "0")}
          tone="amber"
          icon="clock"
        />
      </PanelStatGrid>
      <PanelSurface>
        <h2 className="mb-4 font-bold">
          {t("ترم‌های ثبت‌نام‌شده", "Enrolled terms")}
        </h2>
        {enrollments.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {enrollments.map(({ term, status }) => (
              <Link
                key={term.id}
                href={`/panel/admin/terms/${term.id}/edit`}
                className="cursor-pointer rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <p className="font-semibold">
                  {fa ? term.titleFa : term.titleEn || term.titleFa}
                </p>
                <p className="mt-2 text-sm">
                  {formatPanelDate(term.startDate, locale)} —{" "}
                  {formatPanelDate(term.endDate, locale)}
                </p>
                <p className="mt-2 text-xs">
                  {t("وضعیت ثبت‌نام", "Enrollment status")}:{" "}
                  {(
                    {
                      active: t("فعال", "Active"),
                      completed: t("تکمیل‌شده", "Completed"),
                      withdrawn: t("انصراف‌داده", "Withdrawn"),
                    } as Record<string, string>
                  )[status] ?? status}
                </p>
                <p className="mt-2 text-sm font-semibold text-emerald-600">
                  {t("پرداخت‌شده برای این ترم", "Paid for this term")}:{" "}
                  {money(paidByTerm.get(term.id) ?? "0")}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p>{t("ثبت‌نامی ثبت نشده است.", "No enrollments recorded.")}</p>
        )}
      </PanelSurface>
      <PanelSurface>
        <h2 className="mb-4 font-bold">
          {t("سوابق سفارش و پرداخت", "Orders and payments")}
        </h2>
        <PanelTable
          columns={[
            { label: t("سفارش", "Order"), className: "w-[25%]" },
            { label: t("تاریخ ثبت", "Created"), className: "w-[25%]" },
            { label: t("مبلغ", "Amount"), className: "w-[30%]" },
            { label: t("پرداخت", "Payment"), className: "w-[20%]" },
          ]}
        >
          {studentOrders.slice(0, 50).map((order) => (
            <tr key={order.id}>
              <PanelTableCell>
                <Link
                  className="cursor-pointer text-emerald-600"
                  href={`/panel/orders/${order.id}`}
                >
                  {order.code}
                </Link>
              </PanelTableCell>
              <PanelTableCell>
                {formatPanelDate(order.date, locale)}
              </PanelTableCell>
              <PanelTableCell>{money(order.total)}</PanelTableCell>
              <PanelTableCell>
                {order.status === "paid"
                  ? t("پرداخت‌شده", "Paid")
                  : order.status === "pending"
                    ? t("در انتظار", "Pending")
                    : t("ناموفق", "Unpaid")}
              </PanelTableCell>
            </tr>
          ))}
        </PanelTable>
      </PanelSurface>
      <PanelSurface>
        <h2 className="mb-4 font-bold">
          {t("سوابق حضور و غیاب", "Attendance records")}
        </h2>
        <PanelTable
          columns={[
            { label: t("ترم", "Term"), className: "w-[30%]" },
            { label: t("جلسه", "Session"), className: "w-[30%]" },
            { label: t("حضور", "Attendance"), className: "w-[20%]" },
            { label: t("نمره", "Grade"), className: "w-[20%]" },
          ]}
        >
          {attendance.slice(0, 50).map((item) => (
            <tr key={item.record.id}>
              <PanelTableCell>
                {fa ? item.titleFa : item.titleEn || item.titleFa}
              </PanelTableCell>
              <PanelTableCell>
                {formatPanelDate(item.date, locale)} · {item.time.slice(0, 5)}
              </PanelTableCell>
              <PanelTableCell>
                {item.record.attendance
                  ? attendanceLabels[item.record.attendance]
                  : "—"}
              </PanelTableCell>
              <PanelTableCell>{item.record.grade ?? "—"}</PanelTableCell>
            </tr>
          ))}
        </PanelTable>
      </PanelSurface>
      <PanelSurface>
        <h2 className="mb-3 font-bold">{t("سابقه ورود", "Login history")}</h2>
        <p className="mb-4 text-sm text-zinc-500">
          {t(
            "ورودهای موفق از زمان فعال‌سازی این قابلیت ثبت می‌شوند. خروج از حساب، سابقه را حذف نمی‌کند.",
            "Successful sign-ins are recorded from feature activation. Signing out does not erase history.",
          )}
        </p>
        {logins.length ? (
          <PanelTable
            columns={[
              {
                label: t("تاریخ و ساعت ورود", "Sign-in date and time"),
                className: "w-[65%]",
              },
              { label: t("روش ورود", "Method"), className: "w-[35%]" },
            ]}
          >
            {logins.slice(0, 50).map((login) => (
              <tr key={login.id}>
                <PanelTableCell>
                  {formatPanelDate(login.date, locale, true)}
                </PanelTableCell>
                <PanelTableCell>
                  {login.method === "password"
                    ? t("رمز عبور", "Password")
                    : login.method === "otp"
                      ? t("کد یک‌بارمصرف", "One-time code")
                      : t("ثبت‌نام", "Registration")}
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : (
          <p>{t("ورودی هنوز ثبت نشده است.", "No sign-ins recorded yet.")}</p>
        )}
      </PanelSurface>
      <nav
        className="flex flex-wrap gap-3"
        aria-label={t("صفحه‌بندی سوابق", "History pagination")}
      >
        {page > 1 && (
          <PanelPrimaryLink href={`?page=${page - 1}`}>
            {t("قبلی", "Previous")}
          </PanelPrimaryLink>
        )}
        {(attendance.length > 50 ||
          studentOrders.length > 50 ||
          logins.length > 50) && (
          <PanelPrimaryLink href={`?page=${page + 1}`}>
            {t("بعدی", "Next")}
          </PanelPrimaryLink>
        )}
      </nav>
    </PanelPage>
  );
}
