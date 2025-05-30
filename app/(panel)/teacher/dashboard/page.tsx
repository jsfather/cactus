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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          داشبورد استاد
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>آخرین بروزرسانی: ۵ دقیقه پیش</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"
          >
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <div className="flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 dark:text-green-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 dark:text-red-400" />
                )}
                <span
                  className={`text-sm ${
                    stat.trend === 'up'
                      ? 'text-green-500 dark:text-green-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-full p-3">
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
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              فعالیت‌های اخیر
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.title}
                  className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-700"
                >
                  <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-full p-2">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                ترم‌های فعال
              </h2>
              <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                <Plus className="h-4 w-4" />
                <span>ترم جدید</span>
              </button>
            </div>
            <div className="space-y-4">
              {terms.map((term) => (
                <div
                  key={term.title}
                  className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {term.title}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        term.status === 'فعال'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {term.status}
                    </span>
                  </div>
                  <div className="mb-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        تعداد دانش‌آموزان
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {term.students} نفر
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        تاریخ شروع
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {term.startDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        تاریخ پایان
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {term.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        پیشرفت ترم
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {term.progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-green-600 dark:bg-green-500"
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
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              دسترسی سریع
            </h2>
            <div className="space-y-3">
              {[
                'ثبت حضور و غیاب',
                'ثبت نمرات',
                'برنامه کلاس‌ها',
                'محتواهای آموزشی',
                'پیام‌های دانش‌آموزان',
                'تنظیمات پروفایل',
              ].map((text, index) => (
                <button
                  key={text}
                  className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 flex w-full items-center justify-between rounded-lg p-3 transition-colors"
                >
                  <span>{text}</span>
                  {
                    [
                      <ClipboardList />,
                      <FileText />,
                      <Calendar />,
                      <BookOpen />,
                      <MessageSquare />,
                      <Settings />,
                    ][index]
                  }
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              کلاس‌های امروز
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    رباتیک پیشرفته
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ۱۰:۰۰ - ۱۲:۰۰
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  کلاس ۳۰۱ - طبقه سوم
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    برنامه‌نویسی مقدماتی
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ۱۴:۰۰ - ۱۶:۰۰
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  کلاس ۲۰۲ - طبقه دوم
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
