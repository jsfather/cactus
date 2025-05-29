'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold">
            آکادمی تخصصی آموزش‌های آنلاین
          </h1>
          <p className="mx-auto max-w-3xl text-xl">
            با بیش از ۱۰ سال تجربه در زمینه آموزش تخصصی و تولید محتوای باکیفیت
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* About Section */}
        <div className="mb-12 rounded-xl bg-white p-8 shadow-md">
          <h2 className="section-title mb-8 text-2xl font-bold text-gray-800">
            درباره آکادمی کاکتوس
          </h2>

          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="lg:w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="تیم آکادمی کاکتوس"
                width={500}
                height={300}
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div className="lg:w-1/2">
              <p className="mb-6 leading-relaxed text-gray-700">
                آکادمی کاکتوس در سال ۱۳۹۲ با هدف ارائه آموزش‌های تخصصی و کاربردی
                در حوزه‌های فناوری اطلاعات، برنامه‌نویسی و هوش مصنوعی تأسیس شد.
                ما با بهره‌گیری از مربیان مجرب و متخصص، همواره در تلاش هستیم تا
                باکیفیت‌ترین محتوای آموزشی را در اختیار دانشجویان قرار دهیم.
              </p>
              <p className="mb-6 leading-relaxed text-gray-700">
                در آکادمی کاکتوس، یادگیری تنها محدود به تماشای ویدیوهای آموزشی
                نیست. ما با ارائه پروژه‌های عملی، تمرین‌های تعاملی و پشتیبانی
                تخصصی، مسیر یادگیری را برای دانشجویان هموار می‌کنیم.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                    <i className="fas fa-users text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">۵۰۰۰+ دانشجو</h3>
                  <p className="text-sm text-gray-600">
                    تاکنون در دوره‌های ما ثبت‌نام کرده‌اند
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                    <i className="fas fa-chalkboard-teacher text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">۵۰+ مربی</h3>
                  <p className="text-sm text-gray-600">متخصص و با تجربه</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white">
                    <i className="fas fa-laptop-code text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">۱۵۰+ دوره</h3>
                  <p className="text-sm text-gray-600">آموزشی تخصصی</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white">
                    <i className="fas fa-award text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">۱۰+ جایزه</h3>
                  <p className="text-sm text-gray-600">در جشنواره‌های آموزشی</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-white p-8 shadow-md">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
              <i className="fas fa-bullseye text-2xl"></i>
            </div>
            <h3 className="mb-4 text-center text-xl font-bold text-gray-800">
              ماموریت ما
            </h3>
            <p className="text-center text-gray-700">
              ایجاد بستری برای یادگیری مؤثر و کاربردی با هدف پرورش نیروهای متخصص
              و کارآمد برای بازار کار ایران و جهان. ما معتقدیم آموزش باکیفیت حق
              همه افراد است و باید در دسترس همه باشد.
            </p>
          </div>
          <div className="rounded-xl bg-white p-8 shadow-md">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white">
              <i className="fas fa-eye text-2xl"></i>
            </div>
            <h3 className="mb-4 text-center text-xl font-bold text-gray-800">
              چشم‌انداز
            </h3>
            <p className="text-center text-gray-700">
              تبدیل شدن به برترین پلتفرم آموزش تخصصی آنلاین در خاورمیانه تا سال
              ۱۴۰۵. ما می‌خواهیم با نوآوری در روش‌های آموزشی، استانداردهای جدیدی
              در صنعت آموزش آنلاین تعریف کنیم.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="rounded-xl bg-white p-8 shadow-md">
          <h2 className="section-title mb-8 text-2xl font-bold text-gray-800">
            تماس با ما
          </h2>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Contact Info */}
            <div className="lg:w-1/2">
              <div className="mb-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-6 transition hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                    <i className="fas fa-map-marker-alt text-xl"></i>
                  </div>
                  <h3 className="mb-2 font-bold text-gray-800">آدرس</h3>
                  <p className="text-gray-600">
                    تهران، خیابان آزادی، دانشگاه تهران، مرکز رشد واحدهای فناور
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-6 transition hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                    <i className="fas fa-phone-alt text-xl"></i>
                  </div>
                  <h3 className="mb-2 font-bold text-gray-800">تلفن</h3>
                  <p className="text-gray-600">۰۲۱-۸۸۹۷۶۵۴۳</p>
                  <p className="text-gray-600">۰۹۱۲-۳۴۵۶۷۸۹</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-6 transition hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white">
                    <i className="fas fa-envelope text-xl"></i>
                  </div>
                  <h3 className="mb-2 font-bold text-gray-800">ایمیل</h3>
                  <p className="text-gray-600">info@cactus-academy.ir</p>
                  <p className="text-gray-600">support@cactus-academy.ir</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-6 transition hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white">
                    <i className="fas fa-clock text-xl"></i>
                  </div>
                  <h3 className="mb-2 font-bold text-gray-800">ساعات کاری</h3>
                  <p className="text-gray-600">
                    شنبه تا چهارشنبه: ۸ صبح تا ۵ عصر
                  </p>
                  <p className="text-gray-600">پنجشنبه: ۸ صبح تا ۱۲ ظهر</p>
                </div>
              </div>

              <h3 className="mb-4 text-xl font-bold text-gray-800">
                ما را در شبکه‌های اجتماعی دنبال کنید
              </h3>
              <div className="flex space-x-4 space-x-reverse">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
                >
                  <i className="fab fa-telegram text-xl"></i>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 text-white transition hover:bg-blue-500"
                >
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800 text-white transition hover:bg-blue-900"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700"
                >
                  <i className="fab fa-youtube text-xl"></i>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-white transition hover:bg-pink-700"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-1/2">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-gray-700">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-gray-700">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-gray-700">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-gray-700">
                    موضوع
                  </label>
                  <select
                    id="subject"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  >
                    <option>پشتیبانی فنی</option>
                    <option>پیشنهاد دوره جدید</option>
                    <option>همکاری با آکادمی</option>
                    <option>سایر موارد</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-gray-700">
                    پیام شما
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-green-500 px-6 py-3 text-white transition hover:bg-green-600"
                >
                  ارسال پیام
                  <i className="fas fa-paper-plane mr-2"></i>
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="mt-12">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              موقعیت ما روی نقشه
            </h3>
            <div className="map-container h-[450px] overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.811771468483!2d51.38888931527706!3d35.7282419801855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQzJzQxLjciTiA1McKwMjMnMjYuNiJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl font-bold text-gray-800">
            سوالات متداول
          </h2>

          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                question: 'چگونه می‌توانم در دوره‌ها ثبت‌نام کنم؟',
                answer:
                  'برای ثبت‌نام در دوره‌های آکادمی کاکتوس می‌توانید به صفحه دوره مورد نظر مراجعه کرده و روی دکمه ثبت‌نام کلیک کنید. پس از تکمیل اطلاعات و پرداخت هزینه، دسترسی به دوره برای شما فعال خواهد شد.',
              },
              {
                question: 'آیا دوره‌ها گواهینامه معتبر دارند؟',
                answer:
                  'بله، تمامی دوره‌های آکادمی کاکتوس پس از گذراندن موفقیت‌آمیز دوره و انجام پروژه‌های عملی، گواهینامه معتبر با مهر وزارت علوم، تحقیقات و فناوری ارائه می‌دهند.',
              },
              {
                question: 'آیا امکان پرداخت اقساطی وجود دارد؟',
                answer:
                  'بله، برای دوره‌های با هزینه بالا امکان پرداخت در ۲ یا ۳ قسط وجود دارد. برای اطلاعات بیشتر می‌توانید با پشتیبانی تماس بگیرید.',
              },
              {
                question: 'چگونه می‌توانم با مربیان در ارتباط باشم؟',
                answer:
                  'پس از ثبت‌نام در هر دوره، به گروه اختصاصی دوره در پیام‌رسان‌ها دسترسی پیدا می‌کنید که می‌توانید سوالات خود را از مربیان بپرسید. همچنین جلسات پرسش و پاسخ هفتگی نیز برگزار می‌شود.',
              },
            ].map((faq, index) => (
              <div key={index} className="rounded-lg bg-white p-6 shadow-md">
                <button
                  className="flex w-full items-center justify-between text-right"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-gray-800">
                    {faq.question}
                  </h3>
                  <i
                    className={`fas fa-chevron-down text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  ></i>
                </button>
                <div
                  className={`mt-4 text-gray-700 transition-all ${openFaq === index ? 'block' : 'hidden'}`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
