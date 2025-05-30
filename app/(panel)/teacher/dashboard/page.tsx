'use client';

import {
  Users,
  GraduationCap,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  BookOpen,
  ClipboardList,
  FileText,
  MessageSquare,
  Settings,
  Plus,
} from 'lucide-react';

const stats = [
  {
    title: 'کل دانش‌آموزان',
    value: '۲,۵۴۳',
    change: '+۱۲٪',
    trend: 'up',
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: 'دوره‌های فعال',
    value: '۱۲',
    change: '+۳٪',
    trend: 'up',
    icon: <GraduationCap className="h-6 w-6" />,
  },
  {
    title: 'درآمد ماهانه',
    value: '۱۲,۵۰۰,۰۰۰',
    change: '-۲٪',
    trend: 'down',
    icon: <Landmark className="h-6 w-6" />,
  },
  {
    title: 'نمرات ثبت شده',
    value: '۱۵۶',
    change: '+۸٪',
    trend: 'up',
    icon: <FileText className="h-6 w-6" />,
  },
];

const recentActivities = [
  {
    title: 'ثبت‌نام جدید',
    description: 'علی محمدی در دوره رباتیک پیشرفته ثبت‌نام کرد',
    time: '۲ ساعت پیش',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'ثبت نمره',
    description: 'نمرات میان‌ترم دوره الکترونیک ثبت شد',
    time: '۳ ساعت پیش',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'ثبت حضور و غیاب',
    description: 'حضور و غیاب کلاس برنامه‌نویسی ثبت شد',
    time: '۵ ساعت پیش',
    icon: <ClipboardList className="h-5 w-5" />,
  },
];

const terms = [
  {
    title: 'ترم بهار ۱۴۰۳',
    status: 'فعال',
    students: 45,
    progress: 75,
    startDate: '۱۴۰۳/۰۱/۰۱',
    endDate: '۱۴۰۳/۰۳/۳۱',
  },
  {
    title: 'ترم تابستان ۱۴۰۳',
    status: 'در انتظار',
    students: 32,
    progress: 0,
    startDate: '۱۴۰۳/۰۴/۰۱',
    endDate: '۱۴۰۳/۰۶/۳۱',
  },
];

const Page = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">داشبورد استاد</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>آخرین بروزرسانی: ۵ دقیقه پیش</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <div className="flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="bg-primary-100 text-primary-600 rounded-full p-3">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Activity */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">فعالیت‌های اخیر</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.title}
                  className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="bg-primary-100 text-primary-600 rounded-full p-2">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">ترم‌های فعال</h2>
              <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700">
                <Plus className="h-4 w-4" />
                <span>ترم جدید</span>
              </button>
            </div>
            <div className="space-y-4">
              {terms.map((term) => (
                <div
                  key={term.title}
                  className="rounded-lg border border-gray-100 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium">{term.title}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        term.status === 'فعال'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {term.status}
                    </span>
                  </div>
                  <div className="mb-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">تعداد دانش‌آموزان</p>
                      <p className="font-medium">{term.students} نفر</p>
                    </div>
                    <div>
                      <p className="text-gray-500">تاریخ شروع</p>
                      <p className="font-medium">{term.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">تاریخ پایان</p>
                      <p className="font-medium">{term.endDate}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">پیشرفت ترم</span>
                      <span className="font-medium">{term.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-green-600"
                        style={{ width: `${term.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">دسترسی سریع</h2>
            <div className="space-y-3">
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>ثبت حضور و غیاب</span>
                <ClipboardList className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>ثبت نمرات</span>
                <FileText className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>برنامه کلاس‌ها</span>
                <Calendar className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>محتواهای آموزشی</span>
                <BookOpen className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>پیام‌های دانش‌آموزان</span>
                <MessageSquare className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>تنظیمات پروفایل</span>
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">کلاس‌های امروز</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">رباتیک پیشرفته</h3>
                  <span className="text-sm text-gray-500">۱۰:۰۰ - ۱۲:۰۰</span>
                </div>
                <p className="text-sm text-gray-500">کلاس ۳۰۱ - طبقه سوم</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">برنامه‌نویسی مقدماتی</h3>
                  <span className="text-sm text-gray-500">۱۴:۰۰ - ۱۶:۰۰</span>
                </div>
                <p className="text-sm text-gray-500">کلاس ۲۰۲ - طبقه دوم</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
