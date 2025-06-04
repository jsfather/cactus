import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 px-4 py-12 text-gray-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="لوگو کاکتوس"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-white">کاکتوس</span>
            </div>
            <p className="mb-6 text-gray-400">
              توانمندسازی نسل آینده مهندسان رباتیک از طریق آموزش پیشرفته و تجربه
              عملی با تجهیزات مدرن.
            </p>
            <div className="mb-6 flex gap-4">
              {[
                { name: 'توییتر', link: 'twitter' },
                { name: 'فیسبوک', link: 'facebook' },
                { name: 'لینکدین', link: 'linkedin' },
                { name: 'اینستاگرام', link: 'instagram' },
              ].map((social) => (
                <a
                  key={social.link}
                  href={`#${social.link}`}
                  className="text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  <span className="sr-only">{social.name}</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
              ))}
            </div>
            <div className="mt-4 inline-block rounded-lg bg-white p-2">
              <a
                referrerPolicy="origin"
                target="_blank"
                href="https://trustseal.enamad.ir/?id=549881&Code=dONYAVKcitgaJ4NHqPoTv5N3DtALESVs"
                className="block"
              >
                <img
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=549881&Code=dONYAVKcitgaJ4NHqPoTv5N3DtALESVs"
                  alt="نماد اعتماد الکترونیکی"
                  className="h-24 w-auto"
                  code="dONYAVKcitgaJ4NHqPoTv5N3DtALESVs"
                />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              دسترسی سریع
            </h3>
            <ul className="space-y-3">
              {[
                { title: 'دوره‌ها', href: 'courses' },
                { title: 'مربیان', href: 'teachers' },
                { title: 'درباره ما', href: 'about' },
                { title: 'وبلاگ', href: 'blog' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={`#${link.href}`}
                    className="transition-colors duration-200 hover:text-white"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              اطلاعات تماس
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>info@cactus.ir</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>تهران، خیابان آزادی، پلاک ۱۲۳</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">خبرنامه</h3>
            <p className="mb-4 text-gray-400">
              برای دریافت آخرین اخبار و تخفیف‌های ویژه در خبرنامه ما عضو شوید.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="focus:ring-primary-500 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-right focus:border-transparent focus:ring-2 focus:outline-none"
              />
              <button className="bg-primary-600 hover:bg-primary-700 w-full rounded-lg py-2 font-medium text-white transition duration-200">
                عضویت در خبرنامه
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} کاکتوس. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
