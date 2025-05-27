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
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">آکادمی تخصصی آموزش‌های آنلاین</h1>
          <p className="text-xl max-w-3xl mx-auto">با بیش از ۱۰ سال تجربه در زمینه آموزش تخصصی و تولید محتوای باکیفیت</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 section-title mb-8">درباره آکادمی کاکتوس</h2>
          
          <div className="flex flex-col lg:flex-row gap-8">
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
              <p className="text-gray-700 leading-relaxed mb-6">
                آکادمی کاکتوس در سال ۱۳۹۲ با هدف ارائه آموزش‌های تخصصی و کاربردی در حوزه‌های فناوری اطلاعات، برنامه‌نویسی و هوش مصنوعی تأسیس شد. ما با بهره‌گیری از مربیان مجرب و متخصص، همواره در تلاش هستیم تا باکیفیت‌ترین محتوای آموزشی را در اختیار دانشجویان قرار دهیم.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                در آکادمی کاکتوس، یادگیری تنها محدود به تماشای ویدیوهای آموزشی نیست. ما با ارائه پروژه‌های عملی، تمرین‌های تعاملی و پشتیبانی تخصصی، مسیر یادگیری را برای دانشجویان هموار می‌کنیم.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    <i className="fas fa-users text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">۵۰۰۰+ دانشجو</h3>
                  <p className="text-sm text-gray-600">تاکنون در دوره‌های ما ثبت‌نام کرده‌اند</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    <i className="fas fa-chalkboard-teacher text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">۵۰+ مربی</h3>
                  <p className="text-sm text-gray-600">متخصص و با تجربه</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    <i className="fas fa-laptop-code text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">۱۵۰+ دوره</h3>
                  <p className="text-sm text-gray-600">آموزشی تخصصی</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-3">
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
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 mx-auto">
              <i className="fas fa-bullseye text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">ماموریت ما</h3>
            <p className="text-gray-700 text-center">
              ایجاد بستری برای یادگیری مؤثر و کاربردی با هدف پرورش نیروهای متخصص و کارآمد برای بازار کار ایران و جهان. ما معتقدیم آموزش باکیفیت حق همه افراد است و باید در دسترس همه باشد.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 mx-auto">
              <i className="fas fa-eye text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">چشم‌انداز</h3>
            <p className="text-gray-700 text-center">
              تبدیل شدن به برترین پلتفرم آموزش تخصصی آنلاین در خاورمیانه تا سال ۱۴۰۵. ما می‌خواهیم با نوآوری در روش‌های آموزشی، استانداردهای جدیدی در صنعت آموزش آنلاین تعریف کنیم.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 section-title mb-8">تماس با ما</h2>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contact Info */}
            <div className="lg:w-1/2">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg transition hover:shadow-md">
                  <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white mb-4">
                    <i className="fas fa-map-marker-alt text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">آدرس</h3>
                  <p className="text-gray-600">تهران، خیابان آزادی، دانشگاه تهران، مرکز رشد واحدهای فناور</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg transition hover:shadow-md">
                  <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white mb-4">
                    <i className="fas fa-phone-alt text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">تلفن</h3>
                  <p className="text-gray-600">۰۲۱-۸۸۹۷۶۵۴۳</p>
                  <p className="text-gray-600">۰۹۱۲-۳۴۵۶۷۸۹</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg transition hover:shadow-md">
                  <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white mb-4">
                    <i className="fas fa-envelope text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">ایمیل</h3>
                  <p className="text-gray-600">info@cactus-academy.ir</p>
                  <p className="text-gray-600">support@cactus-academy.ir</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg transition hover:shadow-md">
                  <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center text-white mb-4">
                    <i className="fas fa-clock text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">ساعات کاری</h3>
                  <p className="text-gray-600">شنبه تا چهارشنبه: ۸ صبح تا ۵ عصر</p>
                  <p className="text-gray-600">پنجشنبه: ۸ صبح تا ۱۲ ظهر</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4">ما را در شبکه‌های اجتماعی دنبال کنید</h3>
              <div className="flex space-x-4 space-x-reverse">
                <a href="#" className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                  <i className="fab fa-telegram text-xl"></i>
                </a>
                <a href="#" className="bg-blue-400 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-500 transition">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="bg-blue-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-900 transition">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-700 transition">
                  <i className="fab fa-youtube text-xl"></i>
                </a>
                <a href="#" className="bg-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-700 transition">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:w-1/2">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">نام و نام خانوادگی</label>
                  <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">ایمیل</label>
                  <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">شماره تماس</label>
                  <input type="tel" id="phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">موضوع</label>
                  <select id="subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>پشتیبانی فنی</option>
                    <option>پیشنهاد دوره جدید</option>
                    <option>همکاری با آکادمی</option>
                    <option>سایر موارد</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">پیام شما</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
                </div>
                <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition w-full">
                  ارسال پیام
                  <i className="fas fa-paper-plane mr-2"></i>
                </button>
              </form>
            </div>
          </div>
          
          {/* Map */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4">موقعیت ما روی نقشه</h3>
            <div className="map-container h-[450px] rounded-lg overflow-hidden">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">سوالات متداول</h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'چگونه می‌توانم در دوره‌ها ثبت‌نام کنم؟',
                answer: 'برای ثبت‌نام در دوره‌های آکادمی کاکتوس می‌توانید به صفحه دوره مورد نظر مراجعه کرده و روی دکمه ثبت‌نام کلیک کنید. پس از تکمیل اطلاعات و پرداخت هزینه، دسترسی به دوره برای شما فعال خواهد شد.'
              },
              {
                question: 'آیا دوره‌ها گواهینامه معتبر دارند؟',
                answer: 'بله، تمامی دوره‌های آکادمی کاکتوس پس از گذراندن موفقیت‌آمیز دوره و انجام پروژه‌های عملی، گواهینامه معتبر با مهر وزارت علوم، تحقیقات و فناوری ارائه می‌دهند.'
              },
              {
                question: 'آیا امکان پرداخت اقساطی وجود دارد؟',
                answer: 'بله، برای دوره‌های با هزینه بالا امکان پرداخت در ۲ یا ۳ قسط وجود دارد. برای اطلاعات بیشتر می‌توانید با پشتیبانی تماس بگیرید.'
              },
              {
                question: 'چگونه می‌توانم با مربیان در ارتباط باشم؟',
                answer: 'پس از ثبت‌نام در هر دوره، به گروه اختصاصی دوره در پیام‌رسان‌ها دسترسی پیدا می‌کنید که می‌توانید سوالات خود را از مربیان بپرسید. همچنین جلسات پرسش و پاسخ هفتگی نیز برگزار می‌شود.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <button
                  className="flex justify-between items-center w-full text-right"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                  <i className={`fas fa-chevron-down text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}></i>
                </button>
                <div className={`mt-4 text-gray-700 transition-all ${openFaq === index ? 'block' : 'hidden'}`}>
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
