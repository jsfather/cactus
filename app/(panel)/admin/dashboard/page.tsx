import {
  Users,
  GraduationCap,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
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
];

const recentActivities = [
  {
    title: 'ثبت‌نام جدید',
    description: 'علی محمدی در دوره رباتیک پیشرفته ثبت‌نام کرد',
    time: '۲ ساعت پیش',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'پرداخت شهریه',
    description: 'سارا احمدی شهریه دوره برنامه‌نویسی را پرداخت کرد',
    time: '۳ ساعت پیش',
    icon: <Landmark className="h-5 w-5" />,
  },
  {
    title: 'آزمون جدید',
    description: 'آزمون نهایی دوره الکترونیک برگزار شد',
    time: '۵ ساعت پیش',
    icon: <GraduationCap className="h-5 w-5" />,
  },
];

const Page = async () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          داشبورد
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>آخرین بروزرسانی: ۵ دقیقه پیش</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        {/* Recent Activity */}
        <div className="lg:col-span-2">
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
        </div>

        {/* Quick Actions */}
        <div>
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              دسترسی سریع
            </h2>
            <div className="space-y-3">
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>ثبت دانش‌آموز جدید</span>
                <Users className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>برنامه کلاس‌ها</span>
                <Calendar className="h-5 w-5" />
              </button>
              <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 flex w-full items-center justify-between rounded-lg p-3 transition-colors">
                <span>گزارش مالی</span>
                <Landmark className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
