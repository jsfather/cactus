# APIهای مورد نیاز بخش دوره‌ها

> این فایل برای محمد (بک‌اند) است. فرانت‌اند آماده است و بعد از پیاده‌سازی این APIها به‌صورت خودکار از بک‌اند داده می‌گیرد. تا آن زمان از داده mock استفاده می‌شود.

---

## ۱. API عمومی — لیست دوره‌ها (آرشیو `/courses`)

**مسیر:** `GET /courses`

**توضیح:** لیست دوره‌های قابل نمایش در سایت عمومی. این با «ترم‌های آموزشی» پنل مدیریت متفاوت است — اینجا کاتالوگ بازاریابی/نمایشی دوره‌هاست.

**Query Parameters (فیلترها):**

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `search` | string | جستجو در عنوان و توضیحات |
| `topic` | string | موضوع: `robotics`, `programming`, `ai`, `electronics` |
| `level` | string | سطح: `beginner`, `intermediate`, `advanced` |
| `age_group` | string | سن: `6-10`, `10-14`, `14-18`, `18+` |
| `price_type` | string | قیمت: `free` یا `paid` |
| `sort` | string | مرتب‌سازی: `newest` یا `popular` |
| `page` | number | صفحه‌بندی (اختیاری) |

**نمونه پاسخ:**

```json
{
  "data": [
    {
      "id": 1,
      "term_id": 1,
      "title": "مقدمات رباتیک",
      "description": "توضیحات کامل دوره...",
      "little_description": "توضیح کوتاه",
      "duration": "۸ هفته",
      "level": "beginner",
      "level_label": "مبتدی",
      "topic": "robotics",
      "topic_label": "رباتیک",
      "age_group": "10-14",
      "age_group_label": "۱۰ تا ۱۴ سال",
      "price_type": "paid",
      "price": 2990000,
      "price_label": "۲,۹۹۰,۰۰۰",
      "image": "https://...",
      "rating": 4.8,
      "rating_count": 124,
      "student_count": 320,
      "is_popular": true,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "per_page": 12
  }
}
```

---

## ۲. API عمومی — جزئیات دوره (`/courses/:id`)

**مسیر:** `GET /courses/:id`

**توضیح:** اطلاعات کامل یک دوره + محتوای تکمیلی صفحه (ویدیو، FAQ، سرفصل و...)

**نمونه پاسخ:**

```json
{
  "data": {
    "id": 1,
    "term_id": 1,
    "title": "مقدمات رباتیک",
    "description": "...",
    "duration": "۸ هفته",
    "level": "beginner",
    "level_label": "مبتدی",
    "topic": "robotics",
    "topic_label": "رباتیک",
    "age_group": "10-14",
    "age_group_label": "۱۰ تا ۱۴ سال",
    "price_type": "paid",
    "price": 2990000,
    "price_label": "۲,۹۹۰,۰۰۰",
    "image": "https://...",
    "rating": 4.8,
    "rating_count": 124,
    "student_count": 320,
    "instructor": {
      "id": "1",
      "name": "امیر محمدی",
      "role": "مدرس ارشد",
      "avatar": "https://...",
      "bio": "..."
    },
    "schedule": [
      { "day": "شنبه", "time": "۱۸:۰۰", "duration": "۲ ساعت" }
    ],
    "prerequisites": ["آشنایی با کامپیوتر"],
    "what_you_will_learn": ["مفاهیم پایه رباتیک"],
    "page_content": {
      "id": 1,
      "term_id": 1,
      "title": "مقدمات رباتیک",
      "supplementary_description": "توضیحات تکمیلی صفحه...",
      "intro_video_url": "https://www.youtube.com/embed/...",
      "certificate_image_url": "/storage/certificates/sample.png",
      "faqs": [
        { "id": 1, "question": "سوال؟", "answer": "پاسخ" }
      ],
      "video_testimonials": [
        {
          "id": 1,
          "student_name": "علی رضایی",
          "title": "تجربه من",
          "video_url": "https://www.youtube.com/embed/...",
          "thumbnail_url": "https://..."
        }
      ],
      "syllabus": [
        {
          "id": 1,
          "title": "فصل اول",
          "items": ["مورد ۱", "مورد ۲"]
        }
      ],
      "related_blog_tags": ["رباتیک", "آموزش"],
      "recommended_tools": [
        {
          "id": 1,
          "name": "Arduino IDE",
          "description": "محیط برنامه‌نویسی",
          "link": "https://arduino.cc",
          "icon": "🔧"
        }
      ],
      "rating": 4.8,
      "rating_count": 124,
      "is_published": true
    }
  }
}
```

---

## ۳. API ادمین — مدیریت صفحات دوره (`/admin/course-pages`)

**توضیح:** این بخش فقط محتوای تکمیلی صفحه عمومی دوره را مدیریت می‌کند (ویدیو معرفی، FAQ، نظرات ویدیویی، سرفصل، ابزارها، مقالات مرتبط). محتوای اصلی دوره (ترم، قیمت، ظرفیت، مدرس) از `/admin/terms` مدیریت می‌شود.

### ۳.۱ لیست صفحات دوره
- **مسیر:** `GET /admin/course-pages`
- **احراز هویت:** ادمین

### ۳.۲ جزئیات یک صفحه
- **مسیر:** `GET /admin/course-pages/:id`

### ۳.۳ ایجاد صفحه جدید
- **مسیر:** `POST /admin/course-pages`

**Body:**

```json
{
  "term_id": 1,
  "title": "مقدمات رباتیک",
  "supplementary_description": "توضیحات تکمیلی...",
  "intro_video_url": "https://www.youtube.com/embed/...",
  "certificate_image_url": "/storage/certificates/sample.png",
  "faqs": [
    { "question": "سوال؟", "answer": "پاسخ" }
  ],
  "video_testimonials": [
    {
      "student_name": "علی",
      "title": "نظر من",
      "video_url": "https://...",
      "thumbnail_url": "https://..."
    }
  ],
  "syllabus": [
    { "title": "فصل ۱", "items": ["مورد ۱"] }
  ],
  "related_blog_tags": ["رباتیک"],
  "recommended_tools": [
    { "name": "Arduino IDE", "description": "...", "link": "https://...", "icon": "🔧" }
  ],
  "is_published": true
}
```

### ۳.۴ ویرایش
- **مسیر:** `PUT /admin/course-pages/:id`
- **Body:** همان فیلدهای POST (همه اختیاری)

### ۳.۵ حذف
- **مسیر:** `DELETE /admin/course-pages/:id`

---

## ۴. نکات مهم برای پیاده‌سازی

### رابطه با ترم‌ها (Terms)
- هر `course-page` باید به یک `term_id` متصل باشد.
- API عمومی `/courses` می‌تواند از جدول ترم‌ها + صفحات تکمیلی ساخته شود، یا جدول جداگانه `courses` داشته باشد که `term_id` را reference کند.

### مقالات مرتبط
- فیلد `related_blog_tags` آرایه‌ای از برچسب‌های وبلاگ است.
- فرانت با API موجود `GET /home/blogs?tags=رباتیک,آموزش` مقالات را می‌گیرد — نیازی به API جدید نیست.

### آپلود ویدیو
- فعلاً لینک embed (مثلاً YouTube) کافی است.
- اگر آپلود مستقیم ویدیو لازم شد، API آپلود فایل موجود (`/upload`) قابل استفاده است.

### امتیاز دوره
- `rating` و `rating_count` می‌تواند از نظرات واقعی دانشجویان محاسبه شود یا دستی در پنل تنظیم شود.

### فیلدهای پیشنهادی جدول `course_pages`

| فیلد | نوع | توضیح |
|------|-----|-------|
| id | bigint | PK |
| term_id | bigint | FK به terms |
| title | string | عنوان |
| supplementary_description | text | توضیحات تکمیلی |
| intro_video_url | string nullable | ویدیو معرفی |
| certificate_image_url | string nullable | تصویر مدرک دوره |
| related_blog_tags | json | برچسب‌های وبلاگ |
| is_published | boolean | وضعیت انتشار |
| created_at / updated_at | timestamp | |

**جداول فرعی (یا JSON):**
- `course_page_faqs` — question, answer, sort
- `course_page_testimonials` — student_name, title, video_url, thumbnail_url, sort
- `course_page_syllabus_sections` — title, items (json), sort
- `course_page_tools` — name, description, link, icon, sort

---

## ۵. اولویت پیاده‌سازی

1. **`GET /courses`** با فیلترها — آرشیو دوره‌ها
2. **`GET /courses/:id`** — صفحه جزئیات
3. **CRUD `/admin/course-pages`** — پنل مدیریت محتوای تکمیلی

بعد از آماده شدن API شماره ۱ و ۲، سایت عمومی کاملاً داینامیک می‌شود.
بعد از API شماره ۳، پنل ادمین هم به بک‌اند وصل می‌شود (الان UI آماده است).

---

## ۶. Endpointهایی که از قبل در فرانت تعریف شده

```
GET  /courses              → PUBLIC.COURSES.GET_ALL
GET  /courses/:id          → PUBLIC.COURSES.GET_BY_ID
GET  /admin/course-pages   → PANEL.ADMIN.COURSE_PAGES.GET_ALL
GET  /admin/course-pages/:id
POST /admin/course-pages
PUT  /admin/course-pages/:id
DELETE /admin/course-pages/:id
```

فایل مرجع فرانت: `app/lib/api/endpoints.ts`

---

## ۷. API مدرسین — فیلد نمایش در سایت (برای محمد)

### فیلد جدید در مدل Teacher

| فیلد | نوع | توضیح |
|------|-----|-------|
| `show_on_website` | tinyint (0 یا 1) | `1` = نمایش در سایت، `0` = مخفی |

### APIهای affected

**`GET /home/teachers`** (لیست عمومی مدرسین)
- فقط مدرسانی که `show_on_website = 1` هستند را برگرداند

**`GET /admin/teachers` و `GET /admin/teachers/:id`**
- فیلد `show_on_website` را به صورت `0` یا `1` برگرداند

**`POST /admin/teachers` و `PUT /admin/teachers/:id`**
- فیلد `show_on_website` را به صورت `0` یا `1` بپذیرد

### نمونه

```json
{
  "user_id": 5,
  "bio": "...",
  "show_on_website": 1,
  "user": { ... }
}
```

**فرانت:** مقدار `0`/`1` از API خوانده می‌شود و هنگام ذخیره از پنل ادمین دوباره `0`/`1` ارسال می‌شود.

---

## ۸. مشکل ۴۰۴ تصاویر (Storage)

### مشکل
تصاویر محصولات و فایل‌های آپلودی با URL مثل زیر ۴۰۴ می‌دهند:
```
https://kaktos.kanoonbartarha.ir/storage/product_images/6a43a51c5aa6f.png
```

### کارهای لازم سمت سرور

1. **`php artisan storage:link`** — symlink از `public/storage` به `storage/app/public`
2. **بررسی مسیر ذخیره‌سازی** — فایل‌ها باید در `storage/app/public/product_images/` ذخیره شوند
3. **پاسخ API** — فیلد `image` در محصولات می‌تواند یکی از این فرمت‌ها باشد:
   - URL کامل: `https://kaktos.kanoonbartarha.ir/storage/product_images/xxx.png`
   - مسیر نسبی: `/storage/product_images/xxx.png` یا `storage/product_images/xxx.png`
4. **دسترسی فایل** — nginx/apache باید `/storage/*` را سرو کند
5. **CORS** — اگر دامنه API و سایت متفاوت است، headerهای لازم برای تصاویر

### فیلد جدید: تصویر مدرک دوره
کارفرما **ویدیو مدرک** نمی‌خواهد — **تصویر** می‌خواهد.
- فیلد: `certificate_image_url` (نه `certificate_video_url`)
- در `page_content` و CRUD `/admin/course-pages`
- مقدار: مسیر تصویر آپلودشده مثل `/storage/certificates/xxx.png`
