'use client';

import {
  BookOpenCheck,
  UserCheck,
  BookType,
  Clock,
  Calendar,
  Ticket,
  MessageSquare,
  Settings,
} from 'lucide-react';

const stats = [
  {
    title: 'ترم های فعال',
    value: '۲',
    change: 'ترم بهار و تابستان',
    trend: 'up',
    icon: <BookType className="h-6 w-6" />,
  },
  {
    title: 'تکالیف باز',
    value: '۳',
    change: 'مهلت تا هفته آینده',
    trend: 'up',
    icon: <BookOpenCheck className="h-6 w-6" />,
  },
  {
    title: 'حضور و غیاب',
    value: '۹۰٪',
    change: 'حضور در این ترم',
    trend: 'up',
    icon: <UserCheck className="h-6 w-6" />,
  },
  {
    title: 'تیکت های باز',
    value: '۱',
    change: 'در انتظار پاسخ',
    trend: 'up',
    icon: <Ticket className="h-6 w-6" />,
  },
];

const recentActivities = [
  {
    title: 'تکلیف جدید',
    description: 'تکلیف جدید برای درس برنامه نویسی اضافه شد',
    time: '۲ ساعت پیش',
    icon: <BookOpenCheck className="h-5 w-5" />,
  },
  {
    title: 'ثبت حضور',
    description: 'حضور شما در کلاس برنامه نویسی ثبت شد',
    time: '۳ ساعت پیش',
    icon: <UserCheck className="h-5 w-5" />,
  },
  {
    title: 'پاسخ تیکت',
    description: 'به تیکت پشتیبانی شما پاسخ داده شد',
    time: '۵ ساعت پیش',
    icon: <Ticket className="h-5 w-5" />,
  },
];

const currentTerms = [
  {
    title: 'ترم بهار ۱۴۰۳',
    status: 'فعال',
    courses: ['برنامه نویسی پیشرفته', 'ریاضی مهندسی', 'مدارهای منطقی'],
    progress: 75,
    startDate: '۱۴۰۳/۰۱/۰۱',
    endDate: '۱۴۰۳/۰۳/۳۱',
  },
  {
    title: 'ترم تابستان ۱۴۰۳',
    status: 'در انتظار',
    courses: ['کارآموزی', 'پروژه نرم افزار'],
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
          داشبورد دانشجو
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
            className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-none"
          >
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full p-3">
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
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-none">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              فعالیت‌های اخیر
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.title}
                  className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-700"
                >
                  <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full p-2">
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

          {/* Current Terms Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-none">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              ترم‌های جاری
            </h2>
            <div className="space-y-4">
              {currentTerms.map((term) => (
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
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}
                    >
                      {term.status}
                    </span>
                  </div>
                  <div className="mb-3 text-sm">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      دروس این ترم:
                    </p>
                    <ul className="list-inside list-disc space-y-1">
                      {term.courses.map((course, index) => (
                        <li
                          key={index}
                          className="text-gray-700 dark:text-gray-200"
                        >
                          {course}
                        </li>
                      ))}
                    </ul>
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
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-none">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              دسترسی سریع
            </h2>
            <div className="space-y-3">
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>مشاهده تکالیف</span>
                <BookOpenCheck className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>حضور و غیاب</span>
                <UserCheck className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>برنامه کلاس‌ها</span>
                <Calendar className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>ارسال تیکت</span>
                <Ticket className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>پیام‌های من</span>
                <MessageSquare className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>تنظیمات پروفایل</span>
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Today's Classes */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-none">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              کلاس‌های امروز
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    برنامه نویسی پیشرفته
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
                    ریاضی مهندسی
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
