# Cactus Project Instructions for GitHub Copilot

## Project Overview
This is a **Next.js 14** application with **App Router** for a Persian robotics education platform called **Cactus**. The project follows a **client-side first** approach with **SPA-style** navigation and **RTL (Right-to-Left)** design for Persian content.

### Tech Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, TailwindCSS
- **Backend**: Laravel REST API
- **State Management**: Zustand with devtools middleware
- **Forms**: React Hook Form + Zod validation
- **Styling**: TailwindCSS with RTL support
- **Language**: Persian (فارسی) - all content is RTL
- **Themes**: Dark & Light mode support
- **Deployment**: Vercel

## Architecture & Directory Structure

### Main Directories
```
app/
├── (auth)/          # OTP login, verify, onboarding
├── (main)/          # Public pages (about, blog, shop, footer only here)
├── (panel)/         # User pages after login (admin, student, teacher)
└── components/      # All reusable components
```

### Layout Rules
- **Navbar**: Fixed at top of all pages
- **Sidebar**: Only in `(panel)` routes
- **Footer**: Only in `(main)` routes
- **RTL Global**: Set on `<html>` element
- **Breadcrumbs**: Used in all admin pages for navigation

## API & Data Management

### API Structure
- **Base URL**: `NEXT_PUBLIC_API_BASE_URL` environment variable
- **Client**: Axios with interceptors for bearer token authentication
- **Endpoints**: Defined in `lib/api/endpoints.ts`
- **Error Handling**: Consistent error responses with Persian messages

### State Management with Zustand
All data fetching and state management should use **Zustand stores** with this pattern:

```typescript
// Store structure example
interface ProductStore {
  // State
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (data: CreateProductRequest) => Promise<void>;
  updateProduct: (id: string, data: UpdateProductRequest) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearError: () => void;
}
```

### API Request/Response Patterns
All API calls should follow these structures:

#### Products API
```typescript
// Create/Update Product Request
{
  "title": "string",
  "category_id": "number",
  "description": "string", 
  "price": "number",
  "stock": "number",
  "image": "string",
  "attributes": [
    {"key": "string", "value": "string"}
  ]
}

// Product Response
{
  "id": "number",
  "title": "string",
  "description": "string",
  "price": "number", 
  "stock": "number",
  "image": "string",
  "attributes": "Record<string, string>",
  "category": {
    "id": "number",
    "name": "string"
  }
}
```

## Form Implementation Standards

### Form Validation with Zod
All forms must use **Zod schemas** for validation with Persian error messages:

```typescript
const productSchema = z.object({
  title: z.string().min(1, 'نام محصول نمی‌تواند خالی باشد'),
  category_id: z.string().min(1, 'دسته‌بندی محصول انتخاب کنید'),
  description: z.string().min(1, 'توضیحات محصول نمی‌تواند خالی باشد'),
  price: z.coerce.number().min(0, 'قیمت نمی‌تواند منفی باشد'),
  stock: z.coerce.number().min(0, 'موجودی نمی‌تواند منفی باشد'),
});
```

### Form Pattern
```typescript
const {
  register,
  handleSubmit,
  control,
  formState: { errors },
  reset,
} = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    // Set defaults here
  },
});
```

### Error Handling
- **Client Validation**: Zod schemas with Persian messages
- **API Errors**: Display with `react-hot-toast`
- **Success Messages**: Persian confirmation messages
- **Loading States**: Show loading spinners during API calls

## RTL Design Requirements

### Critical RTL Rules
1. **Margin Direction**: Use `mr-*` instead of `ml-*` for spacing
2. **Text Direction**: All content naturally flows RTL
3. **Icons**: Use `ArrowRight` for back buttons (not `ArrowLeft`)
4. **Layouts**: Use `gap-*` for flexible spacing instead of directional margins

### RTL-Friendly Patterns
```jsx
// ✅ Correct RTL pattern
<div className="flex items-center">
  <div className="flex-shrink-0">
    <Icon className="h-6 w-6" />
  </div>
  <div className="mr-5 w-0 flex-1"> {/* mr-5 for RTL */}
    <content />
  </div>
</div>

// ❌ Wrong LTR pattern  
<div className="ml-5"> {/* ml-5 wrong for RTL */}
```

### Navigation Icons
```jsx
// ✅ Correct for RTL back button
<ArrowRight className="h-4 w-4" />
بازگشت

// ❌ Wrong for RTL
<ArrowLeft className="h-4 w-4" />
```

## Authentication & Security

### Auth Flow
1. **Login**: Mobile number + OTP verification
2. **Token Storage**: Access token in localStorage (migrate to Zustand)
3. **API Calls**: Bearer token via axios interceptors
4. **Route Protection**: Middleware handles protected routes
5. **Logout**: Clear session from localStorage

### Token Management
```typescript
// Current (to be migrated)
localStorage.getItem('access_token')

// Target: Move to Zustand store
useAuthStore.getState().token
```

## Component Standards

### UI Components Location
All components must be in `components/` directory:
- `components/ui/` - Basic UI components (Button, Input, etc.)
- `components/layout/` - Layout components (Navbar, Sidebar, etc.)

### Required UI Components
- **Button**: Support loading states and variants
- **Input**: Persian labels, RTL-friendly
- **Select**: Dropdown with Persian options
- **Textarea**: Multi-line input with RTL
- **Table**: Data display with Persian headers
- **LoadingSpinner**: Consistent loading indicator
- **ConfirmModal**: Custom confirmation dialogs
- **Breadcrumbs**: Navigation breadcrumbs

### Persian Number Formatting
Always use Persian/Farsi number formatting:
```typescript
{totalValue.toLocaleString('fa-IR')} تومان
```

## Admin Panel Patterns

### Page Structure Template
```jsx
export default function AdminPage() {
  // 1. Hooks and state
  const router = useRouter();
  const { data, loading, actions } = useDataStore();
  
  // 2. Effects for data fetching
  useEffect(() => {
    fetchData();
  }, []);
  
  // 3. Event handlers
  const handleCreate = () => { /* */ };
  const handleEdit = () => { /* */ };
  const handleDelete = () => { /* */ };
  
  // 4. Loading state
  if (loading) return <LoadingSpinner />;
  
  // 5. Render
  return (
    <main>
      <Breadcrumbs breadcrumbs={breadcrumbsArray} />
      
      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1>عنوان صفحه</h1>
            <p>توضیحات</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            افزودن جدید
          </Button>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stats cards with mr-5 spacing */}
        </div>
        
        {/* Main Content */}
        <div className="mt-6">
          {/* Content here */}
        </div>
      </div>
    </main>
  );
}
```

### Summary Statistics Cards
All admin pages should include dashboard-style summary cards:
```jsx
<div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
  <div className="p-5">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <div className="mr-5 w-0 flex-1"> {/* RTL: mr-5 not ml-5 */}
        <dl>
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            عنوان آمار
          </dt>
          <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {value.toLocaleString('fa-IR')}
          </dd>
        </dl>
      </div>
    </div>
  </div>
</div>
```

## Dynamic Routes & Next.js 15

### Parameter Handling
For dynamic routes `[id]`, always use the new Next.js Promise-based params:

```typescript
// ✅ Correct Next.js 15 pattern
interface Props {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: Props) {
  const resolvedParams = use(params); // Import 'use' from React
  
  useEffect(() => {
    if (resolvedParams.id !== 'new') {
      fetchData(resolvedParams.id);
    }
  }, [resolvedParams.id]);
}

// ❌ Old pattern (causes errors)
interface Props {
  params: { id: string };
}
```

## CRUD Implementation Standards

### Complete CRUD Pattern
Every admin section should implement full CRUD with:

1. **List Page**: `/admin/resource/page.tsx`
   - Summary statistics dashboard
   - Data table with actions
   - Create button
   
2. **Create/Edit Form**: `/admin/resource/[id]/page.tsx`
   - Unified component handling both create (`id="new"`) and edit
   - Dynamic form population for edit mode
   - Proper validation and error handling
   
3. **Individual Create**: `/admin/resource/new/page.tsx` (optional)
   - Dedicated create form if needed

### Form Patterns for Complex Data

#### Dynamic Arrays (like Product Attributes)
```jsx
const { fields, append, remove } = useFieldArray({
  control,
  name: 'attributes',
});

// Render dynamic fields
{fields.map((field, index) => (
  <div key={field.id} className="flex items-end gap-3">
    <div className="flex-1">
      <Input {...register(`attributes.${index}.key`)} />
    </div>
    <div className="flex-1">
      <Input {...register(`attributes.${index}.value`)} />
    </div>
    <Button onClick={() => remove(index)}>
      <X className="h-4 w-4" />
    </Button>
  </div>
))}
```

## Code Quality Standards

### TypeScript Requirements
- **Strict mode**: All TypeScript strict rules enabled
- **Interface definitions**: Proper typing for all API responses
- **Generic types**: Use generics for reusable components
- **Type exports**: Export types from dedicated files

### Code Organization
```
lib/
├── api/               # API client and endpoints
├── hooks/             # Custom React hooks  
├── stores/            # Zustand stores
├── types/             # TypeScript interfaces
└── utils/             # Utility functions
```

### Performance Considerations
- **Client-side fetching**: All data fetched on client
- **Loading states**: Show spinners during API calls
- **Error boundaries**: Handle component errors gracefully
- **Memoization**: Use React.memo for heavy components

## Specific Implementation Examples

### Products CRUD
- **List**: `/admin/products` with inventory stats
- **Categories**: `/admin/product-categories` with management
- **Create/Edit**: `/admin/products/[id]` with attributes system
- **New**: `/admin/products/new` dedicated create form

### API Endpoints Pattern
```typescript
// lib/api/endpoints.ts
export const ENDPOINTS = {
  PRODUCTS: '/api/admin/products',
  PRODUCT_CATEGORIES: '/api/admin/product-categories',
  ORDERS: '/api/admin/orders',
} as const;
```

### Store Implementation
```typescript
// lib/stores/product.store.ts
export const useProduct = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS);
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // ... other actions
}));
```

## Important Notes

### Migration Priorities
1. **Standardize all stores**: Follow Zustand pattern
2. **Move token to store**: From localStorage to Zustand
3. **RTL compliance**: Fix all directional spacing
4. **Form consistency**: Zod + React Hook Form everywhere

### Persian Content Rules
- **All text**: Must be in Persian
- **Numbers**: Use Persian formatting (`fa-IR`)
- **Dates**: Persian calendar support where applicable
- **Validation**: Persian error messages
- **Success/Error**: Persian toast messages

### Development Workflow
1. **API First**: Define API structure before frontend
2. **Types**: Create TypeScript interfaces from API
3. **Store**: Implement Zustand store for data management
4. **UI**: Build RTL-compliant components
5. **Forms**: Add validation with Persian messages
6. **Testing**: Verify RTL layout and functionality

This instruction set should be followed for all new features and refactoring to maintain consistency across the entire Cactus platform.
