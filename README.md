# 🌵 Cactus - Online Robotics Academy

A modern educational platform for robotics learning, built with Next.js 15, React, and TypeScript. This platform provides an interactive and user-friendly environment for robotics education.

## 📚 About The Project

Cactus is a comprehensive online robotics education platform that brings together students, educators, and robotics enthusiasts. Our platform offers:

- **Interactive Courses**: Wide range of robotics courses from beginner to advanced levels
- **Hands-on Projects**: Real-world experience with actual robots and equipment
- **Innovation Hub**: Space for creativity and innovation in robotics
- **Active Community**: Over 500 students and 50+ courses
- **Equipment Shop**: Access to robotics parts and tools
- **Expert Blog**: Latest news and articles in robotics

## 🎯 Core Features

- **Modern Interface**: Beautiful and user-friendly design with dark theme support
- **Multilingual**: Full RTL support with Persian language and Jalali calendar
- **Learning Management**: 
  - Course creation and management
  - Student progress tracking
  - Assignment submission
  - Interactive quizzes
- **E-commerce Integration**:
  - Course purchases
  - Equipment shop
  - Secure payment processing
- **Community Features**:
  - Student profiles
  - Discussion forums
  - Progress sharing
- **Admin Dashboard**: Comprehensive management tools

## 🚀 Technical Features

- **Modern Stack**: Built with Next.js 15.3.1 and React 19
- **Type Safety**: Full TypeScript support
- **Fast Development**: Powered by Turbopack for lightning-fast builds
- **Authentication**: Secure user authentication system
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.3.1](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: 
  - [@headlessui/react](https://headlessui.com/)
  - [@heroicons/react](https://heroicons.com/)
  - [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Date Handling**: 
  - [jalali-moment](https://github.com/jalaali/moment-jalaali)
  - [react-multi-date-picker](https://github.com/shahabyazdi/react-multi-date-picker)
- **Validation**: [Zod](https://github.com/colinhacks/zod)
- **Development Tools**:
  - ESLint
  - Prettier
  - Turbopack

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/jsfather/cactus.git
cd cactus
```

2. Install dependencies:
```bash
npm install
```

3. Create necessary environment files:
```bash
cp .env.example .env.local
```

## 🚀 Development

To start the development server with Turbopack:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

Other available scripts:
- `npm run build`: Create a production build
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## 📁 Project Structure

```
cactus/
├── app/                    # Next.js 13+ App Router
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main application routes
│   │   ├── courses/       # Course pages
│   │   ├── shop/         # Equipment shop
│   │   ├── blog/         # Blog articles
│   │   └── teachers/     # Teacher profiles
│   ├── (panel)/           # Admin panel routes
│   ├── components/        # Shared components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── fonts/            # Font assets
├── public/               # Static assets
└── [Configuration files] # Various config files
```

## 🔧 Configuration

The project uses several configuration files:
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `.prettierrc`: Prettier formatting rules
- `eslint.config.mjs`: ESLint rules
- `postcss.config.mjs`: PostCSS configuration for Tailwind

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
