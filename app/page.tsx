import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div dir="rtl" className="bg-gray-50 text-gray-900 font-sans">
      {/* Header/Navbar */}
      <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm" style={{height: 80}}>
        <div className="container mx-auto flex items-center justify-between h-20 px-4">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="لوگو" width={56} height={56} />
            <span className="font-extrabold text-2xl text-green-700 tracking-tight">کاکتوس</span>
          </div>
          <nav className="hidden md:flex gap-8 text-base font-semibold">
            <Link href="#about" className="hover:text-green-600 transition">درباره ما</Link>
            <Link href="#shop" className="hover:text-green-600 transition">فروشگاه</Link>
            <Link href="#courses" className="hover:text-green-600 transition">دوره‌های آموزشی</Link>
            <Link href="#blog" className="hover:text-green-600 transition">بلاگ</Link>
            <Link href="#contact" className="hover:text-green-600 transition">ارتباط با ما</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1 border border-gray-200 rounded-md font-medium hover:bg-gray-100 transition">EN</button>
            <div className="relative">
              <input type="text" placeholder="جستجو کنید" className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-100 bg-gray-50" />
              <span className="absolute left-2 top-1.5 text-gray-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-2-2" /></svg>
              </span>
            </div>
            <button className="px-4 py-1 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition shadow">ورود / ثبت نام</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-100" style={{height: 'calc(100vh - 80px)'}}>
        <Image src="/sample-hero.png" alt="hero" fill className="object-cover rounded-3xl shadow-xl" style={{zIndex: 1}} />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent rounded-3xl" style={{zIndex: 2}} />
        <button className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-7 shadow-2xl hover:scale-110 transition border-4 border-green-100" style={{zIndex: 3}}>
          <svg width="56" height="56" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="9.5,7.5 16.5,12 9.5,16.5" fill="#16a34a" /></svg>
        </button>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-50 mb-2 shadow">
              {item.icon}
            </div>
            <div className="text-3xl font-extrabold text-green-700">{item.value}</div>
            <div className="text-base text-gray-600 font-medium">{item.label}</div>
          </div>
        ))}
      </section>

      {/* About Us Section */}
      <section id="about" className="container mx-auto py-14">
        <h2 className="text-3xl font-extrabold mb-6 text-green-700 text-center">درباره ما</h2>
        <p className="mb-12 text-gray-700 leading-8 max-w-3xl mx-auto text-center text-lg">
          شرکت کاکتوس بیان گستر با شماره ثبت ۱۳۷۸، با برند کاکتوس در دو بخش فنی و مهندسی و دپارتمان الکترونیک در حال فعالیت می‌باشد... (متن نمونه)
        </p>
        <div className="flex flex-col md:flex-row gap-10 justify-center">
          {[1,2,3].map((v) => (
            <div key={v} className="relative w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white hover:shadow-2xl transition-all duration-200">
              <Image src="/sample-person.jpg" alt="video" fill className="object-cover" />
              <button className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-5 shadow-xl border-4 border-green-100 hover:scale-110 transition">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="9.5,7.5 16.5,12 9.5,16.5" fill="#16a34a" /></svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Course Types Section */}
      <section id="courses" className="container mx-auto py-14">
        <h2 className="text-3xl font-extrabold mb-10 text-green-700 text-center">دوره‌های آموزشی رایگان</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {courseTypes.map((c, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-10 flex flex-col gap-4 items-center bg-white shadow-md hover:shadow-xl transition-all duration-200">
              <div className="text-xl font-bold mb-2 text-green-700">{c.title}</div>
              <ul className="text-base text-gray-600 mb-2 space-y-1">
                {c.details.map((d, j) => <li key={j}>{d}</li>)}
              </ul>
              <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow font-semibold text-base">ثبت نام دوره</button>
            </div>
          ))}
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="container mx-auto py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-green-700">فروشگاه</h2>
          <span className="text-green-600 font-semibold text-lg">فروش ویژه</span>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-2">
          {shopBooks.map((book, i) => (
            <div key={i} className="min-w-[220px] max-w-[220px] bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-xl transition-all duration-200">
              <Image src={book.img} alt={book.title} width={160} height={200} className="rounded-xl mb-2 object-cover" />
              <div className="font-bold text-lg mb-1 text-green-700">{book.title}</div>
              <div className="text-sm text-gray-500 mb-2">{book.price} تومان</div>
              <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow font-semibold">افزودن به سبد خرید</button>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="container mx-auto py-14">
        <h2 className="text-3xl font-extrabold mb-8 text-green-700 text-center">بلاگ کاکتوس</h2>
        <div className="flex gap-8 overflow-x-auto pb-2">
          {blogPosts.map((post, i) => (
            <div key={i} className="min-w-[320px] max-w-[320px] bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-2 shadow-md hover:shadow-xl transition-all duration-200">
              <Image src={post.img} alt={post.title} width={300} height={180} className="rounded-xl mb-2 object-cover" />
              <div className="font-bold text-lg mb-1 text-green-700">{post.title}</div>
              <div className="text-sm text-gray-500 mb-2">{post.excerpt}</div>
              <div className="flex justify-between text-sm text-green-700">
                <span className="hover:underline cursor-pointer">مطالعه بیشتر</span>
                <span>{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-10 pt-12 pb-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-2 text-base text-gray-700">
            <span>شماره تماس: ۰۹۱۲۳۴۵۶۷۸۹</span>
            <span>ایمیل: cactus@gmail.com</span>
            <span>آدرس: تهران، خیابان مثال</span>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-green-600 hover:text-green-800 transition"><i className="fab fa-instagram"></i>اینستاگرام</a>
              <a href="#" className="text-green-600 hover:text-green-800 transition"><i className="fab fa-telegram"></i>تلگرام</a>
            </div>
          </div>
          <form className="flex gap-2">
            <input type="email" placeholder="ایمیل خود را وارد کنید" className="border border-gray-200 rounded px-3 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-green-100" />
            <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow font-semibold">ارسال</button>
          </form>
          <div className="flex flex-col items-center gap-2">
            <Image src="/logo.png" alt="لوگو" width={56} height={56} />
            <span className="text-sm text-gray-500">کلیه حقوق متعلق به شرکت کاکتوس می‌باشد © ۱۴۰۳</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sample Data
const stats = [
  { value: '۱۲۰', label: 'فارغ‌التحصیل', icon: <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5c0-.538.214-1.05.84-1.922L12 14z" /></svg> },
  { value: '۴۳۵', label: 'دانش‌آموز', icon: <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path d="M5.5 21v-2a4.5 4.5 0 019 0v2" /></svg> },
  { value: '۳', label: 'دوره آموزشی', icon: <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4" /></svg> },
  { value: '۱۷', label: 'استاد مدرس', icon: <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 018 0v2" /></svg> },
];

const courseTypes = [
  { title: 'دوره‌های پروژه محور', details: ['طول دوره: ۲ ماه', 'ساعات: ۴۰ جلسه / ۸۰ ساعت'] },
  { title: 'دوره‌های تکمیل ظرفیت', details: ['طول دوره: ۱ ماه', 'ساعات: ۲۰ جلسه / ۴۰ ساعت'] },
  { title: 'دوره‌های ترکیبی', details: ['طول دوره: ۱.۵ ماه', 'ساعات: ۳۰ جلسه / ۶۰ ساعت'] },
];

const shopBooks = [
  { title: 'عنوان کتاب', price: '۵۰۰,۰۰۰', img: '/sample-book.jpg' },
  { title: 'عنوان کتاب', price: '۵۰۰,۰۰۰', img: '/sample-book.jpg' },
  { title: 'عنوان کتاب', price: '۵۰۰,۰۰۰', img: '/sample-book.jpg' },
  { title: 'عنوان کتاب', price: '۵۰۰,۰۰۰', img: '/sample-book.jpg' },
];

const blogPosts = [
  { title: 'عنوان مقاله...', excerpt: 'لورم ایپسوم متن ساختگی با تولید سادگی...', date: '۱۴۰۳/۰۲/۰۱', img: '/sample-blog.jpg' },
  { title: 'عنوان مقاله...', excerpt: 'لورم ایپسوم متن ساختگی با تولید سادگی...', date: '۱۴۰۳/۰۲/۰۲', img: '/sample-blog.jpg' },
  { title: 'عنوان مقاله...', excerpt: 'لورم ایپسوم متن ساختگی با تولید سادگی...', date: '۱۴۰۳/۰۲/۰۳', img: '/sample-blog.jpg' },
];
