import {
  Users,
  GraduationCap,
  BookOpen,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  UserPlus,
  BookOpenCheck,
  MessagesSquare,
  FileEdit,
} from 'lucide-react';

const stats = [
  {
    title: 'کل دانش پژوهان',
    value: '۲,۵۴۳',
    change: '+۱۲٪',
    trend: 'up',
    icon: <Users className="h-6 w-6" />,
    color: 'blue',
  },
  {
    title: 'ترم‌های فعال',
    value: '۱۲',
    change: '+۳٪',
    trend: 'up',
    icon: <GraduationCap className="h-6 w-6" />,
    color: 'purple',
  },
  {
    title: 'مقالات بلاگ',
    value: '۱۵۶',
    change: '+۵٪',
    trend: 'up',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'emerald',
  },
  {
    title: 'تیکت‌های باز',
    value: '۲۴',
    change: '-۸٪',
    trend: 'down',
    icon: <MessageSquare className="h-6 w-6" />,
    color: 'amber',
  },
];

const recentActivities = [
  {
    title: 'ثبت‌نام دانش پژوه جدید',
    description: 'علی محمدی در ترم رباتیک پیشرفته ثبت‌نام کرد',
    time: '۲ ساعت پیش',
    icon: <UserPlus className="h-5 w-5" />,
    color: 'blue',
    category: 'users',
  },
  {
    title: 'آزمون جدید ثبت شد',
    description: 'آزمون پایان ترم برنامه‌نویسی پایتون اضافه شد',
    time: '۳ ساعت پیش',
    icon: <BookOpenCheck className="h-5 w-5" />,
    color: 'purple',
    category: 'education',
  },
  {
    title: 'مقاله جدید',
    description: 'مقاله "آموزش مقدماتی هوش مصنوعی" منتشر شد',
    time: '۴ ساعت پیش',
    icon: <FileEdit className="h-5 w-5" />,
    color: 'emerald',
    category: 'content',
  },
  {
    title: 'تیکت جدید',
    description: 'یک تیکت جدید در بخش پشتیبانی ثبت شد',
    time: '۵ ساعت پیش',
    icon: <MessagesSquare className="h-5 w-5" />,
    color: 'amber',
    category: 'communications',
  },
];

const quickActions = [
  {
    title: 'افزودن دانش پژوه',
    icon: <UserPlus className="h-5 w-5" />,
    href: '/admin/students/new',
    color: 'blue',
  },
  {
    title: 'ایجاد ترم جدید',
    icon: <GraduationCap className="h-5 w-5" />,
    href: '/admin/terms/new',
    color: 'purple',
  },
  {
    title: 'نوشتن مقاله',
    icon: <FileEdit className="h-5 w-5" />,
    href: '/admin/blogs/new',
    color: 'emerald',
  },
  {
    title: 'مشاهده تیکت‌ها',
    icon: <MessagesSquare className="h-5 w-5" />,
    href: '/admin/tickets',
    color: 'amber',
  },
];

const Page = async () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-gray-200">
          داشبورد
        </h1>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
          <Clock className="h-4 w-4" />
          <span>آخرین بروزرسانی: ۵ دقیقه پیش</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="group relative z-0 overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-[0.03] transition-all group-hover:opacity-[0.06]"
              style={{
                backgroundImage:
                  stat.color === 'blue'
                    ? 'linear-gradient(to right, transparent, #60a5fa)'
                    : stat.color === 'purple'
                      ? 'linear-gradient(to right, transparent, #a78bfa)'
                      : stat.color === 'emerald'
                        ? 'linear-gradient(to right, transparent, #34d399)'
                        : 'linear-gradient(to right, transparent, #fbbf24)',
              }}
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <div
                  className={`rounded-full p-2.5 ${
                    stat.color === 'blue'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : stat.color === 'purple'
                        ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                        : stat.color === 'emerald'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}
                >
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 dark:text-red-400" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === 'up'
                        ? 'text-green-500 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
            <div className="border-b border-gray-100 p-6 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                فعالیت‌های اخیر
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentActivities.map((activity) => (
                <div
                  key={activity.title}
                  className="group relative overflow-hidden p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all group-hover:opacity-[0.03]"
                    style={{
                      backgroundImage:
                        activity.color === 'blue'
                          ? 'linear-gradient(to right, transparent, #60a5fa)'
                          : activity.color === 'purple'
                            ? 'linear-gradient(to right, transparent, #a78bfa)'
                            : activity.color === 'emerald'
                              ? 'linear-gradient(to right, transparent, #34d399)'
                              : 'linear-gradient(to right, transparent, #fbbf24)',
                    }}
                  />
                  <div className="flex items-start gap-4">
                    <div
                      className={`shrink-0 rounded-full p-2 ${
                        activity.color === 'blue'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : activity.color === 'purple'
                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                            : activity.color === 'emerald'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}
                    >
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {activity.description}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
            <div className="border-b border-gray-100 p-6 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                دسترسی سریع
              </h2>
            </div>
            <div className="space-y-2 p-4">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent opacity-0 transition-all group-hover:opacity-100"
                    style={{
                      backgroundImage:
                        action.color === 'blue'
                          ? 'linear-gradient(to right, transparent, #60a5fa/10)'
                          : action.color === 'purple'
                            ? 'linear-gradient(to right, transparent, #a78bfa/10)'
                            : action.color === 'emerald'
                              ? 'linear-gradient(to right, transparent, #34d399/10)'
                              : 'linear-gradient(to right, transparent, #fbbf24/10)',
                    }}
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {action.title}
                  </span>
                  <div
                    className={
                      action.color === 'blue'
                        ? 'text-blue-600 dark:text-blue-400'
                        : action.color === 'purple'
                          ? 'text-purple-600 dark:text-purple-400'
                          : action.color === 'emerald'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                    }
                  >
                    {action.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
