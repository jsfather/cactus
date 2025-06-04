# 🌵 Cactus

A modern web application built with Next.js 15, React, and TypeScript, featuring a beautiful UI and excellent developer experience.

## 🚀 Features

- **Modern Stack**: Built with Next.js 15.3.1 and React 19
- **Type Safety**: Full TypeScript support
- **Fast Development**: Powered by Turbopack for lightning-fast builds
- **Beautiful UI**: Styled with modern design principles
- **Authentication**: Secure user authentication system
- **Panel Interface**: Administrative dashboard
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
git clone [your-repository-url]
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
│   ├── (panel)/           # Admin panel routes
│   ├── components/        # Shared components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
