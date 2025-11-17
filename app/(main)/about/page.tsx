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
  Linkedin,
  Youtube,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSettings } from '@/app/lib/hooks/use-settings';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useLocale } from '@/app/contexts/LocaleContext';

interface FAQ {
  question: string;
  answer: string;
}

export default function Page() {
  const { t, dir } = useLocale();
  const [activeTab, setActiveTab] = useState(0);

  const getStats = () => [
    {
      number: dir === 'rtl' ? '۵۰۰۰+' : '5000+',
      label: t.about.stats.students,
      description: t.about.stats.studentsDesc,
    },
    {
      number: dir === 'rtl' ? '۵۰+' : '50+',
      label: t.about.stats.instructors,
      description: t.about.stats.instructorsDesc,
    },
    {
      number: dir === 'rtl' ? '۱۵۰+' : '150+',
      label: t.about.stats.courses,
      description: t.about.stats.coursesDesc,
    },
    {
      number: dir === 'rtl' ? '۱۰+' : '10+',
      label: t.about.stats.awards,
      description: t.about.stats.awardsDesc,
    },
  ];

  const { settings, loading, fetchSettings } = useSettings();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Define FAQs array - you can populate from settings or use static data
  const faqs: FAQ[] = [
    {
      question: 'چگونه می‌توانم در دوره‌ها ثبت نام کنم؟',
      answer:
        'برای ثبت نام در دوره‌ها، کافیست وارد صفحه دوره‌ها شوید و دوره مورد نظر خود را انتخاب کنید. سپس روی دکمه ثبت نام کلیک کنید و مراحل ثبت نام را تکمیل نمایید.',
    },
    {
      question: 'آیا دوره‌ها گواهینامه دارند؟',
      answer:
        'بله، تمامی دوره‌های ما دارای گواهینامه معتبر می‌باشند که پس از اتمام موفقیت‌آمیز دوره برای شما صادر خواهد شد.',
    },
    {
      question: 'آیا امکان پرداخت اقساطی وجود دارد؟',
      answer:
        'بله، برای دوره‌های خاص امکان پرداخت اقساطی فراهم شده است. برای اطلاعات بیشتر با بخش پشتیبانی تماس بگیرید.',
    },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold">
              {t.about.pageTitle}
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                {t.about.pageTitleHighlight}
              </span>
            </h1>
            <p className="mb-12 text-xl text-gray-600 dark:text-gray-300">
              {t.about.pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {getStats().map((stat, index) => (
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
              <h2 className="mb-4 text-3xl font-bold">{t.about.ourStory}</h2>
              <div className="bg-primary-600 mx-auto h-1 w-20 rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-6 text-gray-600 dark:text-gray-300"
            >
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="mx-auto h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mx-auto h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mx-auto h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ) : (
                <>
                  <div className="prose prose-lg dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:leading-relaxed max-w-none text-gray-600 dark:text-gray-300">
                    <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                      {settings?.about_us || 'محتوایی برای نمایش وجود ندارد.'}
                    </ReactMarkdown>
                  </div>
                </>
              )}
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
                {t.about.mission}
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`flex-1 rounded-lg py-3 text-center transition-all ${
                  activeTab === 1
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {t.about.vision}
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
                    {t.about.mission}
                  </h3>
                  {loading ? (
                    <div className="h-20 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  ) : (
                    <div className="prose dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none text-gray-600 dark:text-gray-300">
                      <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                        {settings?.our_mission ||
                          'محتوایی برای نمایش وجود ندارد.'}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold dark:text-white">
                    {t.about.vision}
                  </h3>
                  <div className="prose dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none text-gray-600 dark:text-gray-300">
                    <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                      {settings?.our_vision || 'محتوایی برای نمایش وجود ندارد.'}
                    </ReactMarkdown>
                  </div>
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
              <h2 className="mb-4 text-3xl font-bold">{t.about.location}</h2>
              <div className="bg-primary-600 mx-auto h-1 w-20 rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8">
                {/* اطلاعات تماس داینامیک */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-4"
                >
                  <div className="text-primary-600 dark:text-primary-400 mt-1">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold dark:text-white">
                      {dir === 'rtl' ? 'آدرس' : 'Address'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {settings?.address || '---'}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-4"
                >
                  <div className="text-primary-600 dark:text-primary-400 mt-1">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold dark:text-white">
                      {dir === 'rtl' ? 'تلفن' : 'Phone'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {settings?.phone || '---'}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-4"
                >
                  <div className="text-primary-600 dark:text-primary-400 mt-1">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold dark:text-white">
                      {dir === 'rtl' ? 'ایمیل' : 'Email'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {settings?.email || '---'}
                    </p>
                  </div>
                </motion.div>
                {/* ساعت کاری استاتیک */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-4"
                >
                  <div className="text-primary-600 dark:text-primary-400 mt-1">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold dark:text-white">
                      {dir === 'rtl' ? 'ساعات کاری' : 'Working Hours'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {dir === 'rtl'
                        ? 'شنبه تا چهارشنبه: ۸ صبح تا ۵ عصر'
                        : 'Saturday to Wednesday: 8 AM to 5 PM'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {dir === 'rtl'
                        ? 'پنجشنبه: ۸ صبح تا ۱۲ ظهر'
                        : 'Thursday: 8 AM to 12 PM'}
                    </p>
                  </div>
                </motion.div>
                {/* شبکه‌های اجتماعی */}
                <div className="flex items-center justify-around gap-2">
                  {[Instagram, Twitter, Facebook, Linkedin, Youtube].map(
                    (Icon, index) => (
                      <a
                        key={index}
                        href="#"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    )
                  )}
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
                        {dir === 'rtl' ? 'نام و نام خانوادگی' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-200 p-3 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {dir === 'rtl' ? 'ایمیل' : 'Email'}
                      </label>
                      <input
                        type="email"
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-200 p-3 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {dir === 'rtl' ? 'شماره تماس' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-200 p-3 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {dir === 'rtl' ? 'موضوع' : 'Subject'}
                      </label>
                      <input
                        type="text"
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-200 p-3 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {dir === 'rtl' ? 'پیام شما' : 'Your Message'}
                      </label>
                      <textarea
                        rows={4}
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-200 p-3 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 w-full rounded-lg px-6 py-3 text-white transition-colors">
                    {dir === 'rtl' ? 'ارسال پیام' : 'Send Message'}
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
              <h2 className="mb-4 text-3xl font-bold">
                {dir === 'rtl' ? 'موقعیت ما روی نقشه' : 'Our Location on Map'}
              </h2>
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
              <h2 className="mb-4 text-3xl font-bold">
                {t.about.faq.title}{' '}
                <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                  {t.about.faq.titleHighlight}
                </span>
              </h2>
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
