'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Download,
  ExternalLink,
  X,
  BookOpen,
  Cpu,
  HardDrive,
  Terminal,
  Settings,
  Play,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useLocale } from '@/app/contexts/LocaleContext';

interface SoftwareRequirement {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  version: string;
  size: string;
  platform: string[];
  difficulty: 'مبتدی' | 'متوسط' | 'پیشرفته';
  requirements: {
    os: string[];
    ram: string;
    storage: string;
    processor: string;
    graphics?: string;
  };
  features: string[];
  installation: {
    windows?: string[];
    mac?: string[];
    linux?: string[];
  };
  downloadLinks: {
    official: string;
    alternative?: string;
  };
  documentation: string;
  tutorials: string[];
  price: 'رایگان' | 'پولی' | 'فریمیوم';
  license: string;
  lastUpdate: string;
}

const softwareRequirements: SoftwareRequirement[] = [
  {
    id: 'arduino-ide',
    name: 'Arduino IDE',
    icon: '🔧',
    category: 'برنامه‌نویسی',
    description: 'محیط توسعه یکپارچه برای برنامه‌نویسی میکروکنترلرهای Arduino',
    version: '2.3.2',
    size: '150 MB',
    platform: ['Windows', 'macOS', 'Linux'],
    difficulty: 'مبتدی',
    requirements: {
      os: ['Windows 10+', 'macOS 10.14+', 'Ubuntu 18.04+'],
      ram: '2 GB',
      storage: '500 MB',
      processor: 'Intel/AMD 64-bit',
    },
    features: [
      'ویرایشگر کد با نحو‌نمایی',
      'کامپایلر و آپلودر یکپارچه',
      'مدیریت کتابخانه‌ها',
      'پشتیبانی از انواع بردهای Arduino',
      'Serial Monitor برای دیباگ',
    ],
    installation: {
      windows: [
        'فایل نصب را از سایت رسمی دانلود کنید',
        'فایل .exe را اجرا کرده و مراحل نصب را دنبال کنید',
        'درایورهای USB را نصب کنید',
        'Arduino IDE را اجرا کرده و برد خود را انتخاب کنید',
      ],
      mac: [
        'فایل .dmg را دانلود کنید',
        'فایل را باز کرده و Arduino IDE را به Applications کپی کنید',
        'اپلیکیشن را اجرا کرده و مجوزهای لازم را بدهید',
      ],
      linux: [
        'فایل .tar.xz را دانلود کنید',
        'فایل را استخراج کرده و install.sh را اجرا کنید',
        'کاربر را به گروه dialout اضافه کنید',
      ],
    },
    downloadLinks: {
      official: 'https://www.arduino.cc/en/software',
    },
    documentation: 'https://docs.arduino.cc/',
    tutorials: [
      'آموزش نصب و راه‌اندازی Arduino IDE',
      'اولین پروژه با Arduino',
      'کار با سنسورها در Arduino',
    ],
    price: 'رایگان',
    license: 'GPL v2',
    lastUpdate: '2024-01-15',
  },
  {
    id: 'scratch',
    name: 'Scratch 3.0',
    icon: '🐱',
    category: 'برنامه‌نویسی بصری',
    description:
      'زبان برنامه‌نویسی بصری برای آموزش مفاهیم برنامه‌نویسی به کودکان',
    version: '3.29.1',
    size: '200 MB',
    platform: ['Windows', 'macOS', 'Linux', 'Web'],
    difficulty: 'مبتدی',
    requirements: {
      os: ['Windows 10+', 'macOS 10.13+', 'Ubuntu 18.04+'],
      ram: '1 GB',
      storage: '300 MB',
      processor: 'Intel/AMD 32/64-bit',
    },
    features: [
      'برنامه‌نویسی با کشیدن و رها کردن',
      'انیمیشن و بازی‌سازی',
      'کار با صدا و تصویر',
      'اشتراک‌گذاری پروژه‌ها آنلاین',
      'پشتیبانی از زبان فارسی',
    ],
    installation: {
      windows: [
        'از Microsoft Store یا سایت رسمی دانلود کنید',
        'فایل نصب را اجرا کنید',
        'حساب کاربری Scratch ایجاد کنید (اختیاری)',
      ],
      mac: ['از App Store یا سایت رسمی دانلود کنید', 'فایل .dmg را نصب کنید'],
    },
    downloadLinks: {
      official: 'https://scratch.mit.edu/download',
      alternative: 'https://scratch.mit.edu/projects/editor/',
    },
    documentation: 'https://scratch.mit.edu/help/',
    tutorials: [
      'آشنایی با محیط Scratch',
      'ساخت اولین انیمیشن',
      'برنامه‌نویسی بازی ساده',
    ],
    price: 'رایگان',
    license: 'BSD 3-Clause',
    lastUpdate: '2024-02-01',
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    category: 'زبان برنامه‌نویسی',
    description: 'زبان برنامه‌نویسی قدرتمند برای هوش مصنوعی، رباتیک و علم داده',
    version: '3.12.1',
    size: '30 MB',
    platform: ['Windows', 'macOS', 'Linux'],
    difficulty: 'متوسط',
    requirements: {
      os: ['Windows 8+', 'macOS 10.9+', 'Ubuntu 16.04+'],
      ram: '1 GB',
      storage: '100 MB',
      processor: 'Intel/AMD 32/64-bit',
    },
    features: [
      'نحو ساده و قابل فهم',
      'کتابخانه‌های غنی برای رباتیک',
      'پشتیبانی از OpenCV و TensorFlow',
      'مناسب برای پردازش تصویر',
      'اتصال به Arduino و Raspberry Pi',
    ],
    installation: {
      windows: [
        'از python.org فایل نصب را دانلود کنید',
        'گزینه "Add Python to PATH" را فعال کنید',
        'pip install opencv-python numpy matplotlib',
        'محیط توسعه مانند PyCharm یا VS Code نصب کنید',
      ],
      mac: [
        'از python.org یا Homebrew نصب کنید',
        'brew install python3',
        'pip3 install opencv-python numpy matplotlib',
      ],
      linux: [
        'sudo apt update && sudo apt install python3 python3-pip',
        'pip3 install opencv-python numpy matplotlib',
      ],
    },
    downloadLinks: {
      official: 'https://www.python.org/downloads/',
    },
    documentation: 'https://docs.python.org/3/',
    tutorials: [
      'آموزش مقدماتی Python',
      'کار با OpenCV در Python',
      'اتصال Python به Arduino',
    ],
    price: 'رایگان',
    license: 'PSF License',
    lastUpdate: '2024-01-20',
  },
  {
    id: 'ros',
    name: 'ROS (Robot Operating System)',
    icon: '🤖',
    category: 'سیستم عامل رباتیک',
    description: 'چارچوب نرم‌افزاری برای توسعه نرم‌افزارهای رباتیک پیشرفته',
    version: 'ROS 2 Humble',
    size: '2 GB',
    platform: ['Ubuntu', 'Windows', 'macOS'],
    difficulty: 'پیشرفته',
    requirements: {
      os: ['Ubuntu 22.04 LTS', 'Windows 10+', 'macOS 12+'],
      ram: '4 GB',
      storage: '5 GB',
      processor: 'Intel/AMD 64-bit',
    },
    features: [
      'معماری توزیع‌شده',
      'ابزارهای شبیه‌سازی قدرتمند',
      'پشتیبانی از انواع سنسورها',
      'الگوریتم‌های ناوبری و مسیریابی',
      'رابط گرافیکی RViz',
    ],
    installation: {
      linux: [
        'sudo apt update && sudo apt install curl gnupg lsb-release',
        'curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg',
        'sudo apt update && sudo apt install ros-humble-desktop',
        'echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc',
      ],
      windows: [
        'Visual Studio 2019 را نصب کنید',
        'Chocolatey package manager را نصب کنید',
        'choco install ros-humble-desktop',
      ],
    },
    downloadLinks: {
      official: 'https://docs.ros.org/en/humble/Installation.html',
    },
    documentation: 'https://docs.ros.org/',
    tutorials: [
      'نصب و راه‌اندازی ROS 2',
      'ایجاد اولین Node در ROS',
      'کار با Gazebo Simulator',
    ],
    price: 'رایگان',
    license: 'Apache 2.0',
    lastUpdate: '2024-01-10',
  },
  {
    id: 'gazebo',
    name: 'Gazebo Simulator',
    icon: '🌐',
    category: 'شبیه‌سازی',
    description: 'شبیه‌ساز سه‌بعدی قدرتمند برای رباتیک و فیزیک',
    version: 'Gazebo 11',
    size: '1.5 GB',
    platform: ['Ubuntu', 'macOS', 'Windows'],
    difficulty: 'پیشرفته',
    requirements: {
      os: ['Ubuntu 20.04+', 'macOS 10.14+', 'Windows 10+'],
      ram: '4 GB',
      storage: '3 GB',
      processor: 'Intel/AMD 64-bit',
      graphics: 'OpenGL 3.3+',
    },
    features: [
      'شبیه‌سازی فیزیک دقیق',
      'مدل‌های رباتیک متنوع',
      'محیط‌های مختلف شبیه‌سازی',
      'پشتیبانی از سنسورهای مختلف',
      'رندرینگ گرافیکی پیشرفته',
    ],
    installation: {
      linux: [
        'sudo apt update',
        'sudo apt install gazebo11 libgazebo11-dev',
        'gazebo --version برای تست نصب',
      ],
      mac: [
        'brew install gazebo11',
        'export GAZEBO_MODEL_PATH=/usr/local/share/gazebo-11/models',
      ],
    },
    downloadLinks: {
      official: 'http://gazebosim.org/download',
    },
    documentation: 'http://gazebosim.org/tutorials',
    tutorials: [
      'آشنایی با محیط Gazebo',
      'ایجاد مدل رباتیک',
      'شبیه‌سازی سنسورها',
    ],
    price: 'رایگان',
    license: 'Apache 2.0',
    lastUpdate: '2024-01-05',
  },
  {
    id: 'opencv',
    name: 'OpenCV',
    icon: '👁️',
    category: 'بینایی کامپیوتر',
    description: 'کتابخانه قدرتمند برای پردازش تصویر و بینایی کامپیوتر',
    version: '4.8.1',
    size: '500 MB',
    platform: ['Windows', 'macOS', 'Linux'],
    difficulty: 'متوسط',
    requirements: {
      os: ['Windows 10+', 'macOS 10.13+', 'Ubuntu 18.04+'],
      ram: '2 GB',
      storage: '1 GB',
      processor: 'Intel/AMD 64-bit',
    },
    features: [
      'تشخیص اشیاء و چهره',
      'پردازش تصاویر و ویدیو',
      'الگوریتم‌های یادگیری ماشین',
      'پشتیبانی از دوربین‌های مختلف',
      'ابزارهای کالیبراسیون دوربین',
    ],
    installation: {
      windows: [
        'pip install opencv-python',
        'pip install opencv-contrib-python',
        'برای GPU: pip install opencv-python-headless',
      ],
      mac: ['pip3 install opencv-python', 'brew install opencv'],
      linux: ['pip3 install opencv-python', 'sudo apt install python3-opencv'],
    },
    downloadLinks: {
      official: 'https://opencv.org/releases/',
    },
    documentation: 'https://docs.opencv.org/',
    tutorials: [
      'آموزش مقدماتی OpenCV',
      'تشخیص چهره با OpenCV',
      'پردازش تصویر در زمان واقعی',
    ],
    price: 'رایگان',
    license: 'Apache 2.0',
    lastUpdate: '2024-01-25',
  },
  {
    id: 'matlab',
    name: 'MATLAB',
    icon: '📊',
    category: 'محاسبات علمی',
    description: 'محیط محاسباتی برای تجزیه و تحلیل داده‌ها و شبیه‌سازی',
    version: 'R2024a',
    size: '3 GB',
    platform: ['Windows', 'macOS', 'Linux'],
    difficulty: 'متوسط',
    requirements: {
      os: ['Windows 10+', 'macOS 11+', 'Ubuntu 20.04+'],
      ram: '4 GB',
      storage: '8 GB',
      processor: 'Intel/AMD 64-bit',
    },
    features: [
      'Robotics System Toolbox',
      'Computer Vision Toolbox',
      'Simulink برای مدل‌سازی',
      'پردازش سیگنال پیشرفته',
      'الگوریتم‌های کنترل',
    ],
    installation: {
      windows: [
        'حساب MathWorks ایجاد کنید',
        'نصب‌کننده را از سایت دانلود کنید',
        'لایسنس دانشجویی یا آموزشی دریافت کنید',
        'Toolbox های مورد نیاز را انتخاب کنید',
      ],
    },
    downloadLinks: {
      official: 'https://www.mathworks.com/products/matlab.html',
    },
    documentation: 'https://www.mathworks.com/help/matlab/',
    tutorials: [
      'آشنایی با MATLAB',
      'Robotics Toolbox آموزش',
      'شبیه‌سازی سیستم‌های کنترل',
    ],
    price: 'پولی',
    license: 'Commercial',
    lastUpdate: '2024-03-01',
  },
];

const difficultyColors = {
  مبتدی: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  متوسط:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  پیشرفته: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

const priceColors = {
  رایگان:
    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  فریمیوم: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  پولی: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
};

export default function RequirementsPage() {
  const { t, dir } = useLocale();
  const [selectedSoftware, setSelectedSoftware] =
    useState<SoftwareRequirement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(
    t.requirements.allCategories
  );
  const [selectedPlatform, setSelectedPlatform] = useState(
    t.requirements.allPlatforms
  );

  const categories = [
    t.requirements.allCategories,
    dir === 'rtl' ? 'برنامه‌نویسی' : 'Programming',
    dir === 'rtl' ? 'برنامه‌نویسی بصری' : 'Visual Programming',
    dir === 'rtl' ? 'زبان برنامه‌نویسی' : 'Programming Language',
    dir === 'rtl' ? 'سیستم عامل رباتیک' : 'Robot Operating System',
    dir === 'rtl' ? 'شبیه‌سازی' : 'Simulation',
    dir === 'rtl' ? 'بینایی کامپیوتر' : 'Computer Vision',
    dir === 'rtl' ? 'محاسبات علمی' : 'Scientific Computing',
  ];

  const platforms = [
    t.requirements.allPlatforms,
    'Windows',
    'macOS',
    'Linux',
    'Web',
  ];

  const filteredSoftware = softwareRequirements.filter((software) => {
    const categoryMatch =
      selectedCategory === t.requirements.allCategories ||
      software.category === selectedCategory;
    const platformMatch =
      selectedPlatform === t.requirements.allPlatforms ||
      software.platform.includes(selectedPlatform);
    return categoryMatch && platformMatch;
  });

  return (
    <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold">
              {t.requirements.pageTitle}
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                {t.requirements.pageTitleHighlight}
              </span>
            </h1>
            <p className="mb-12 text-xl text-gray-600 dark:text-gray-300">
              {t.requirements.pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Category Filter */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.requirements.category}:
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary-600 dark:bg-primary-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Filter */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.requirements.platform}:
              </h3>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedPlatform === platform
                        ? 'bg-primary-600 dark:bg-primary-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Software Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSoftware.map((software, index) => (
              <motion.div
                key={software.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50"
                onClick={() => setSelectedSoftware(software)}
              >
                {/* Software Header */}
                <div className="relative p-6 pb-4">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-100 dark:bg-primary-900/20 flex h-12 w-12 items-center justify-center rounded-xl text-2xl">
                        {software.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {software.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {software.version}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${difficultyColors[software.difficulty]}`}
                      >
                        {software.difficulty}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${priceColors[software.price]}`}
                      >
                        {software.price}
                      </span>
                    </div>
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {software.description}
                  </p>
                </div>

                {/* Software Details */}
                <div className="border-t border-gray-100 p-6 pt-4 dark:border-gray-700">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {software.platform.slice(0, 3).map((platform, index) => (
                      <span
                        key={`${software.id}-platform-${index}`}
                        className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      >
                        <Monitor className="h-3 w-3" />
                        {platform}
                      </span>
                    ))}
                    {software.platform.length > 3 && (
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        +{software.platform.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <HardDrive className="h-4 w-4" />
                      <span>
                        {dir === 'rtl' ? 'حجم' : 'Size'}: {software.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Cpu className="h-4 w-4" />
                      <span>RAM: {software.requirements.ram}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(software.downloadLinks.official, '_blank');
                      }}
                    >
                      <Download className="ml-1 h-4 w-4" />
                      {dir === 'rtl' ? 'دانلود' : 'Download'}
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSoftware(software);
                      }}
                    >
                      {dir === 'rtl' ? 'جزئیات' : 'Details'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Software Detail View */}
        <AnimatePresence>
          {selectedSoftware && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSoftware(null)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              />

              {/* Detail Card */}
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 shadow-2xl sm:max-w-xl md:max-w-2xl lg:max-w-4xl dark:bg-gray-800"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-100 dark:bg-primary-900/20 flex h-16 w-16 items-center justify-center rounded-xl text-3xl">
                      {selectedSoftware.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {selectedSoftware.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {dir === 'rtl' ? 'نسخه' : 'Version'}{' '}
                        {selectedSoftware.version} •{' '}
                        {dir === 'rtl' ? 'آخرین بروزرسانی' : 'Last Update'}:{' '}
                        {selectedSoftware.lastUpdate}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSoftware(null)}
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Description */}
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                      {dir === 'rtl' ? 'توضیحات' : 'Description'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedSoftware.description}
                    </p>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {dir === 'rtl' ? 'دسته‌بندی' : 'Category'}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedSoftware.category}
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {dir === 'rtl' ? 'سطح دشواری' : 'Difficulty'}
                      </div>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${difficultyColors[selectedSoftware.difficulty]}`}
                      >
                        {selectedSoftware.difficulty}
                      </span>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {dir === 'rtl' ? 'قیمت' : 'Price'}
                      </div>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${priceColors[selectedSoftware.price]}`}
                      >
                        {selectedSoftware.price}
                      </span>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {dir === 'rtl' ? 'حجم' : 'Size'}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedSoftware.size}
                      </div>
                    </div>
                  </div>

                  {/* System Requirements */}
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                      {dir === 'rtl'
                        ? 'حداقل سیستم مورد نیاز'
                        : 'Minimum System Requirements'}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                        <div className="mb-3 flex items-center gap-2">
                          <Monitor className="text-primary-600 dark:text-primary-400 h-5 w-5" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {dir === 'rtl' ? 'سیستم عامل' : 'Operating System'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {selectedSoftware.requirements.os.map((os, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-600 dark:text-gray-400"
                            >
                              • {os}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                        <div className="mb-3 flex items-center gap-2">
                          <Cpu className="text-primary-600 dark:text-primary-400 h-5 w-5" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {dir === 'rtl' ? 'سخت‌افزار' : 'Hardware'}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            • {dir === 'rtl' ? 'پردازنده' : 'Processor'}:{' '}
                            {selectedSoftware.requirements.processor}
                          </div>
                          <div>
                            • {dir === 'rtl' ? 'حافظه RAM' : 'RAM'}:{' '}
                            {selectedSoftware.requirements.ram}
                          </div>
                          <div>
                            • {dir === 'rtl' ? 'فضای ذخیره' : 'Storage'}:{' '}
                            {selectedSoftware.requirements.storage}
                          </div>
                          {selectedSoftware.requirements.graphics && (
                            <div>
                              •{' '}
                              {dir === 'rtl' ? 'کارت گرافیک' : 'Graphics Card'}:{' '}
                              {selectedSoftware.requirements.graphics}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                      {dir === 'rtl' ? 'ویژگی‌های کلیدی' : 'Key Features'}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {selectedSoftware.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Supported Platforms */}
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                      {dir === 'rtl'
                        ? 'پلتفرم‌های پشتیبانی شده'
                        : 'Supported Platforms'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedSoftware.platform.map((platform) => (
                        <div
                          key={platform}
                          className="bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 flex items-center gap-2 rounded-lg px-4 py-2"
                        >
                          <Monitor className="h-4 w-4" />
                          {platform}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Installation Guide */}
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                      {dir === 'rtl' ? 'راهنمای نصب' : 'Installation Guide'}
                    </h3>
                    <div className="space-y-6">
                      {Object.entries(selectedSoftware.installation).map(
                        ([platform, steps]) => (
                          <div
                            key={platform}
                            className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                          >
                            <h4 className="mb-3 flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                              <Terminal className="text-primary-600 dark:text-primary-400 h-5 w-5" />
                              {platform === 'windows'
                                ? 'Windows'
                                : platform === 'mac'
                                  ? 'macOS'
                                  : 'Linux'}
                            </h4>
                            <ol className="space-y-2">
                              {steps.map((step, index) => (
                                <li key={index} className="flex gap-3">
                                  <span className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                                    {index + 1}
                                  </span>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {step}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Tutorials */}
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                      {dir === 'rtl'
                        ? 'آموزش‌های پیشنهادی'
                        : 'Recommended Tutorials'}
                    </h3>
                    <div className="space-y-3">
                      {selectedSoftware.tutorials.map((tutorial, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                        >
                          <Play className="text-primary-600 dark:text-primary-400 h-5 w-5" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {tutorial}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          selectedSoftware.downloadLinks.official,
                          '_blank'
                        )
                      }
                    >
                      <Download className="ml-2 h-5 w-5" />
                      {dir === 'rtl'
                        ? 'دانلود از سایت رسمی'
                        : 'Download from Official Site'}
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() =>
                        window.open(selectedSoftware.documentation, '_blank')
                      }
                    >
                      <BookOpen className="ml-2 h-5 w-5" />
                      {dir === 'rtl' ? 'مستندات' : 'Documentation'}
                    </Button>
                    {selectedSoftware.downloadLinks.alternative && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          window.open(
                            selectedSoftware.downloadLinks.alternative,
                            '_blank'
                          )
                        }
                      >
                        <ExternalLink className="ml-2 h-5 w-5" />
                        {dir === 'rtl' ? 'لینک جایگزین' : 'Alternative Link'}
                      </Button>
                    )}
                  </div>

                  {/* License Info */}
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Settings className="h-4 w-4" />
                      <span>
                        {dir === 'rtl' ? 'مجوز' : 'License'}:{' '}
                        {selectedSoftware.license}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
