'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Twitter,
  Facebook,
} from 'lucide-react';
import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'چگونه می‌توانم در دوره‌ها ثبت‌نام کنم؟',
    answer:
      'شما می‌توانید با مراجعه به صفحه دوره‌ها و انتخاب دوره مورد نظر خود، از طریق درگاه پرداخت آنلاین ثبت‌نام کنید.',
  },
  {
    question: 'آیا دوره‌ها گواهینامه معتبر دارند؟',
    answer:
      'بله، تمامی دوره‌های ما دارای گواهینامه معتبر از آکادمی کاکتوس هستند.',
  },
  {
    question: 'آیا امکان پرداخت اقساطی وجود دارد؟',
    answer: 'بله، برای دوره‌های بلندمدت امکان پرداخت اقساطی فراهم شده است.',
  },
];

const stats = [
  {
    number: '۵۰۰۰+',
    label: 'دانشجو',
    description: 'تاکنون در دوره‌های ما ثبت‌نام کرده‌اند',
  },
  { number: '۵۰+', label: 'مربی', description: 'متخصص و با تجربه' },
  { number: '۱۵۰+', label: 'دوره', description: 'آموزشی تخصصی' },
  { number: '۱۰+', label: 'جایزه', description: 'در جشنواره‌های آموزشی' },
];

const contactInfo = [
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'آدرس',
    details: ['تهران، خیابان آزادی، دانشگاه تهران، مرکز رشد واحدهای فناور'],
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: 'تلفن',
    details: ['۰۲۱-۸۸۹۷۶۵۴۳', '۰۹۱۲-۳۴۵۶۷۸۹'],
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: 'ایمیل',
    details: ['info@cactus-academy.ir', 'support@cactus-academy.ir'],
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'ساعات کاری',
    details: ['شنبه تا چهارشنبه: ۸ صبح تا ۵ عصر', 'پنجشنبه: ۸ صبح تا ۱۲ ظهر'],
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div dir="rtl" className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold">
              آکادمی تخصصی
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                آموزش‌های آنلاین
              </span>
            </h1>
            <p className="mb-12 text-xl text-gray-600 dark:text-gray-300">
              با بیش از ۱۰ سال تجربه در زمینه آموزش تخصصی و تولید محتوای باکیفیت
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl bg-white p-6 text-center shadow-lg dark:bg-gray-800"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-2 text-3xl font-bold">
                  {stat.number}
                </div>
                <div className="mb-2 font-semibold dark:text-white">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold">درباره آکادمی کاکتوس</h2>
              <div className="bg-primary-600 mx-auto h-1 w-20 rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-6 text-gray-600 dark:text-gray-300"
            >
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                شرکت کاکتوس پویان گستر با شماره ثبت 7308
              </p>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                شرکت کاکتوس پویان گستر با شماره ثبت 7308 ، با برند کاکتوس در دو بخش فنی و مهندسی و تجارت الکترونیک در حال فعالیت می باشد. شرکت کاکتوس فعالیت حقوقی خود را در بخش فنی و مهندسی از سال 1395 به طور رسمی با روباتیک آغاز نموده ولی از سال 1388 تا 1395 به صورت حقیقی در این زمینه و از سال 1399 به صورت هوشمند و با هوش مصنوعی در حیطه دانش آموزی و در عرصه جهانی و بین المللی فعالیت داشته است. در بخش تجارت الکترونیک، شخص مدیر عامل به صورت حقیقی در حال فعالیت می باشند. رشته فنی و مهندسی روباتیک تلفیقی از سه رشته مهندسی الکترونیک، مکانیک و برنامه نویسی می باشد. هدف شرکت کاکتوس پویان گستر در حیطه فنی و مهندسی، آموزش اصولی رشته های تخصصی و تربیت مهندسین واقعی در حوزه صنعت و تولید می باشد. تمامی آموزش ها به صورت مهارتی و کارگاهی می باشد. در گرایش الکترونیک با نرم افزارهایی چون پرتئوس، مولتی سیم و آلتیوم دیزاینر و ... در گرایش مکانیک با برنامه هایی چون آلگودو، ویرچوال مک، لگوتیک، سالیدورکس، کتیا و کار با دستگاه پرینتر سه بعدی و سی ان سی و... در گرایش برنامه نویسی با پلتفرم هایی چون آردوینو، VS Code، کدویژن، اسکرچ، اتمل استودیو، ام بلاگ، پایتون و... آموزش داده می شود. پس از گذراندن دوره های تخصصی و پروسه آموزشی با تایید مدیریت و نظارت شرکت کاکتوس مدرک و گواهی به دانش آموزان تعلق می گیرد .
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 flex rounded-xl bg-white p-2 dark:bg-gray-800">
              <button
                onClick={() => setActiveTab(0)}
                className={`flex-1 rounded-lg py-3 text-center transition-all ${
                  activeTab === 0
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                ماموریت ما
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`flex-1 rounded-lg py-3 text-center transition-all ${
                  activeTab === 1
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                چشم‌انداز
              </button>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800"
            >
              {activeTab === 0 ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold dark:text-white">
                    ماموریت ما
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    ایجاد بستری برای یادگیری مؤثر و کاربردی با هدف پرورش نیروهای
                    متخصص و کارآمد برای بازار کار ایران و جهان. ما معتقدیم آموزش
                    باکیفیت حق همه افراد است و باید در دسترس همه باشد.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold dark:text-white">
                    چشم‌انداز
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    تبدیل شدن به برترین پلتفرم آموزش تخصصی آنلاین در خاورمیانه
                    تا سال ۱۴۰۵. ما می‌خواهیم با نوآوری در روش‌های آموزشی،
                    استانداردهای جدیدی در صنعت آموزش آنلاین تعریف کنیم.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold">تماس با ما</h2>
              <div className="bg-primary-600 mx-auto h-1 w-20 rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 space-x-reverse"
                  >
                    <div className="text-primary-600 dark:text-primary-400 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold dark:text-white">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p
                          key={idx}
                          className="text-gray-600 dark:text-gray-300"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}

                <div className="flex gap-2 space-x-reverse">
                  {[Instagram, Twitter, Facebook].map((Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800"
                >
                  <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        نام و نام خانوادگی
                      </label>
                      <input
                        type="text"
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-200 p-3 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        ایمیل
                      </label>
                      <input
                        type="email"
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-200 p-3 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        شماره تماس
                      </label>
                      <input
                        type="tel"
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-200 p-3 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        موضوع
                      </label>
                      <input
                        type="text"
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-200 p-3 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        پیام شما
                      </label>
                      <textarea
                        rows={4}
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-200 p-3 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 w-full rounded-lg px-6 py-3 text-white transition-colors">
                    ارسال پیام
                  </button>
                </motion.form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold">موقعیت ما روی نقشه</h2>
              <div className="bg-primary-600 mx-auto h-1 w-20 rounded-full" />
            </motion.div>

            <div className="overflow-hidden rounded-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.9627430847677!2d51.38887661524919!3d35.702534280186445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e011c5400f417%3A0x31f92c9a26e08be2!2z2K_Yp9mG2LTar9in2Ycg2KrZh9ix2KfZhg!5e0!3m2!1sen!2s!4v1645000000000!5m2!1sen!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold">سوالات متداول</h2>
              <div className="bg-primary-600 mx-auto h-1 w-20 rounded-full" />
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900"
                >
                  <h3 className="mb-3 text-lg font-semibold dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
