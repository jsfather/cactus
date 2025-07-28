export default function ManagerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          پنل مدیریت
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          خوش آمدید به پنل مدیریت سیستم
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            مدیریت دانش‌پژوهان
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            مشاهده و مدیریت اطلاعات دانش‌پژوهان
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            مدیریت مدرسین
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            مشاهده و مدیریت اطلاعات مدرسین
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            مدیریت دوره‌ها
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ایجاد و مدیریت دوره‌های آموزشی
          </p>
        </div>
      </div>
    </div>
  );
}
