# Cactus - Blog Management System

A modern blog management system built with Next.js, TypeScript, Tailwind CSS, and a Laravel backend.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, Delete blogs
- **State Management**: Zustand for efficient state management
- **Form Validation**: Zod schema validation with React Hook Form
- **Notifications**: Toast notifications with React-Toastify
- **Responsive Design**: Tailwind CSS for modern UI
- **TypeScript**: Full type safety throughout the application

## 🛠️ Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Notifications**: React-Toastify
- **Backend**: Laravel (separate repository)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cactus
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_BEARER_TOKEN=your-bearer-token-here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: The base URL of your Laravel API
- `NEXT_PUBLIC_BEARER_TOKEN`: Bearer token for API authentication

### API Endpoints

The application expects the following Laravel API endpoints:

- `GET /api/admin/blogs` - List all blogs
- `GET /api/admin/blogs/{id}` - Get single blog
- `POST /api/admin/blogs` - Create new blog
- `PUT /api/admin/blogs/{id}` - Update existing blog
- `DELETE /api/admin/blogs/{id}` - Delete blog

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with ToastProvider
│   ├── page.tsx            # Main page with BlogList
│   └── globals.css         # Global styles
├── components/
│   ├── blog/
│   │   ├── BlogList.tsx    # Blog listing component
│   │   ├── BlogForm.tsx    # Blog create/edit form
│   │   └── BlogDetail.tsx  # Blog detail view
│   └── providers/
│       └── ToastProvider.tsx # Toast notification provider
├── lib/
│   ├── api/
│   │   ├── client.ts       # Axios HTTP client
│   │   └── blog.ts         # Blog API functions
│   ├── store/
│   │   └── blog.ts         # Zustand blog store
│   ├── types/
│   │   └── blog.ts         # TypeScript interfaces
│   └── validations/
│       └── blog.ts         # Zod validation schemas
└── .env.local              # Environment configuration
```

## 🎯 Usage

### Blog Management

1. **View Blogs**: The main page displays a list of all blogs
2. **Create Blog**: Click "Create New Blog" to add a new blog post
3. **Edit Blog**: Click "Edit" on any blog to modify it
4. **View Blog**: Click "View" to see full blog details
5. **Delete Blog**: Click "Delete" and confirm to remove a blog

### Form Fields

When creating or editing a blog, you can set:

- **Title**: Blog post title
- **Short Description**: Brief summary
- **Description**: Full blog content
- **Meta Title**: SEO title
- **Meta Description**: SEO description
- **Slug**: URL-friendly identifier
- **Tags**: Categorization tags
- **User ID**: Author identifier
- **Publish Date**: When to publish the blog

## 🔍 State Management

The application uses Zustand for state management with the following features:

- **Centralized State**: All blog data managed in one store
- **Optimistic Updates**: UI updates immediately with API calls
- **Error Handling**: Comprehensive error states and messaging
- **Loading States**: Loading indicators during API operations

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean and professional interface
- **Toast Notifications**: User feedback for all operations

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
