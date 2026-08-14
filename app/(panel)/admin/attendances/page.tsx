'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Plus,
  UserCheck,
  UserX,
} from 'lucide-react';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';
import Table, { type Column } from '@/app/components/ui/Table';
import { adminAttendanceService } from '@/app/lib/services/attendance.service';
import { termService } from '@/app/lib/services/term.service';
import type {
  Attendance,
  CreateAttendanceRequest,
} from '@/app/lib/types/attendance';
import type { Term } from '@/app/lib/types/term';
import { formatDateToPersian } from '@/app/lib/utils';

const emptyForm: CreateAttendanceRequest = {
  student_id: '',
  term_id: '',
  term_teacher_schedule_id: '',
  status: 'present',
  absence_reason: '',
  mark: '20',
};

export default function AdminAttendancesPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [form, setForm] = useState<CreateAttendanceRequest>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    termService
      .getList()
      .then((response) => setTerms(response.data))
      .catch(() => toast.error('دریافت فهرست ترم‌ها انجام نشد'))
      .finally(() => setLoading(false));
  }, []);

  const loadTerm = async (termId: string) => {
    setForm((current) => ({
      ...current,
      term_id: termId,
      student_id: '',
      term_teacher_schedule_id: '',
    }));

    if (!termId) {
      setSelectedTerm(null);
      setAttendances([]);
      return;
    }

    try {
      setLoading(true);
      const [termResponse, attendanceResponse] = await Promise.all([
        termService.getById(termId),
        adminAttendanceService.getByTerm(termId),
      ]);
      setSelectedTerm(termResponse.data);
      setAttendances(attendanceResponse.data);
    } catch {
      toast.error('دریافت اطلاعات حضور و غیاب انجام نشد');
    } finally {
      setLoading(false);
    }
  };

  const schedules = useMemo(
    () =>
      selectedTerm?.teachers?.flatMap((teacher) => teacher.schedules || []) ||
      [],
    [selectedTerm]
  );

  const students =
    selectedTerm?.students?.filter((student) => student.user) || [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.term_id || !form.student_id || !form.term_teacher_schedule_id) {
      toast.error('ترم، دانش‌پژوه و جلسه را انتخاب کنید');
      return;
    }

    try {
      setSaving(true);
      await adminAttendanceService.create(form);
      toast.success('حضور و غیاب ثبت شد');
      const response = await adminAttendanceService.getByTerm(form.term_id);
      setAttendances(response.data);
      setForm((current) => ({
        ...current,
        student_id: '',
        term_teacher_schedule_id: '',
        status: 'present',
        absence_reason: '',
        mark: '20',
      }));
    } catch {
      toast.error('ثبت حضور و غیاب انجام نشد');
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<Attendance>[] = [
    {
      header: 'دانش‌پژوه',
      accessor: 'student',
      render: (_, attendance) =>
        attendance.student
          ? `${attendance.student.first_name || ''} ${attendance.student.last_name || ''}`.trim()
          : 'نامشخص',
    },
    {
      header: 'جلسه',
      accessor: 'schedule',
      render: (_, attendance) =>
        attendance.schedule
          ? `${formatDateToPersian(attendance.schedule.session_date)} - ${attendance.schedule.start_time.slice(0, 5)}`
          : 'نامشخص',
    },
    {
      header: 'وضعیت',
      accessor: 'status',
      render: (value) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${value === 'present' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'}`}
        >
          {value === 'present' ? (
            <UserCheck className="h-3 w-3" />
          ) : (
            <UserX className="h-3 w-3" />
          )}
          {value === 'present' ? 'حاضر' : 'غایب'}
        </span>
      ),
    },
    { header: 'نمره', accessor: 'mark' },
    {
      header: 'دلیل غیبت',
      accessor: 'absence_reason',
      render: (value) => String(value || '—'),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-6 pb-10">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'مدیریت آموزش', href: '/admin/terms' },
          {
            label: 'حضور و غیاب',
            href: '/admin/attendances',
            active: true,
          },
        ]}
      />
      <div className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-l from-slate-900 via-blue-900 to-cyan-700 p-7 text-white shadow-xl shadow-cyan-500/15">
        <div className="absolute -left-12 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <h1 className="relative flex items-center gap-3 text-2xl font-extrabold">
          <span className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20"><ClipboardCheck className="h-7 w-7" /></span>
          مدیریت حضور و غیاب
        </h1>
        <p className="relative mr-16 mt-2 text-sm text-cyan-100">ابتدا ترم را انتخاب کنید، سپس وضعیت حضور دانش‌پژوهان را ثبت و پیگیری کنید.</p>
      </div>

      <Card className="mt-8 overflow-hidden border-gray-100 p-0 shadow-md dark:border-white/10">
        <div className="border-b border-gray-100 px-6 py-5 dark:border-white/10">
          <h2 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white"><CalendarDays className="h-5 w-5 text-blue-600" />انتخاب ترم</h2>
          <p className="mt-1 text-sm text-gray-500">برای شروع، یکی از ترم‌های زیر را انتخاب کنید.</p>
        </div>
        <div className="grid max-h-80 grid-cols-1 gap-3 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((term) => {
            const active = form.term_id === term.id.toString();
            return (
              <button key={term.id} type="button" onClick={() => loadTerm(term.id.toString())} className={`group flex min-h-24 items-center gap-4 rounded-2xl border p-4 text-right transition-all duration-200 ${active ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/15 dark:bg-blue-500/10' : 'border-gray-200 bg-gray-50/60 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-900/30 dark:hover:border-blue-500/50'}`}>
                <span className={`rounded-xl p-2.5 ${active ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 shadow-sm dark:bg-gray-800'}`}>{active ? <CheckCircle2 className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}</span>
                <span className="min-w-0"><span className="block truncate font-bold text-gray-900 dark:text-white">{term.title}</span><span className="mt-1 block text-xs text-gray-500">انتخاب برای ثبت حضور</span></span>
              </button>
            );
          })}
        </div>
      </Card>

      {selectedTerm && (
        <>
          <Card className="mt-6 overflow-hidden border-gray-100 p-6 shadow-md dark:border-white/10">
            <h2 className="mb-5 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <Plus className="h-5 w-5" /> ثبت حضور و غیاب
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <Select
                  id="student"
                  label="دانش‌پژوه"
                  value={form.student_id}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      student_id: event.target.value,
                    }))
                  }
                  options={[
                    { value: '', label: 'انتخاب دانش‌پژوه' },
                    ...students.map((student) => ({
                      value: student.user.id.toString(),
                      label: `${student.user.first_name} ${student.user.last_name}`,
                    })),
                  ]}
                  required
                />
                <Select
                  id="schedule"
                  label="جلسه"
                  value={form.term_teacher_schedule_id}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      term_teacher_schedule_id: event.target.value,
                    }))
                  }
                  options={[
                    { value: '', label: 'انتخاب جلسه' },
                    ...schedules.map((schedule) => ({
                      value: schedule.id.toString(),
                      label: `${schedule.session_date} - ${schedule.start_time.slice(0, 5)}`,
                    })),
                  ]}
                  required
                />
                <Select
                  id="status"
                  label="وضعیت"
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as 'present' | 'absent',
                    }))
                  }
                  options={[
                    { value: 'present', label: 'حاضر' },
                    { value: 'absent', label: 'غایب' },
                  ]}
                  required
                />
                <Input
                  id="mark"
                  type="number"
                  min="0"
                  max="20"
                  step="0.25"
                  label="نمره"
                  value={form.mark}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      mark: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              {form.status === 'absent' && (
                <Textarea
                  id="absence_reason"
                  label="دلیل غیبت"
                  value={form.absence_reason}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      absence_reason: event.target.value,
                    }))
                  }
                />
              )}
              <Button type="submit" loading={saving}>
                ثبت حضور و غیاب
              </Button>
            </form>
          </Card>

          <Card className="mt-6 p-6">
            <Table
              data={attendances}
              columns={columns}
              loading={loading}
              emptyMessage="رکورد حضور و غیابی برای این ترم ثبت نشده است"
            />
          </Card>
        </>
      )}
    </main>
  );
}
