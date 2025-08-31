# Blog Management System - Usage Examples

## API Configuration

Before using the application, make sure to set up your environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BEARER_TOKEN=your-actual-bearer-token
```

## Quick Start

1. **Start your Laravel backend** (make sure it's running on port 8000)
2. **Start the Next.js frontend**:
   ```bash
   npm run dev
   ```
3. **Open your browser** to http://localhost:3000

## API Testing

You can test the API endpoints directly to ensure they work:

### List Blogs

```bash
curl -H "Authorization: Bearer your-token" \
     -H "Accept: application/json" \
     http://localhost:8000/api/admin/blogs
```

### Create Blog

```bash
curl -X POST \
     -H "Authorization: Bearer your-token" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{
       "title": "Test Blog",
       "little_description": "A test blog description",
       "description": "Full blog content here",
       "meta_title": "Test Blog SEO Title",
       "meta_description": "SEO description",
       "slug": "test-blog",
       "tags": ["test", "example"],
       "user_id": 1,
       "publish_at": "2024-12-31"
     }' \
     http://localhost:8000/api/admin/blogs
```

### Update Blog

```bash
curl -X PUT \
     -H "Authorization: Bearer your-token" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{
       "title": "Updated Blog Title",
       "little_description": "Updated description"
     }' \
     http://localhost:8000/api/admin/blogs/1
```

### Delete Blog

```bash
curl -X DELETE \
     -H "Authorization: Bearer your-token" \
     -H "Accept: application/json" \
     http://localhost:8000/api/admin/blogs/1
```

## Frontend Features

### 1. Blog List View

- Displays all blogs in a clean, responsive grid
- Shows title, short description, creation date, publish date, and tags
- Provides action buttons for View, Edit, and Delete operations

### 2. Create New Blog

- Click "Create New Blog" button
- Fill in all required fields (marked with \*)
- Add tags by typing and pressing Enter or clicking "Add"
- Submit the form to create the blog

### 3. Edit Existing Blog

- Click "Edit" on any blog in the list
- Form pre-populates with existing data
- Make changes and submit to update

### 4. View Blog Details

- Click "View" to see the full blog information
- Displays content, SEO information, and metadata
- Includes author information if available

### 5. Delete Blog

- Click "Delete" on any blog
- Confirm deletion in the popup dialog
- Blog is removed from the list

## State Management

The application uses Zustand for state management:

```typescript
// Example of using the blog store in a component
import { useBlogStore } from "../lib/store/blog";

function MyComponent() {
  const {
    blogs,
    loading,
    error,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  } = useBlogStore();

  // Use the store methods and state
}
```

## Error Handling

The application provides comprehensive error handling:

- **Network Errors**: Displayed as toast notifications
- **Validation Errors**: Shown inline with form fields
- **API Errors**: Converted to user-friendly messages
- **Loading States**: Visual indicators during operations

## Form Validation

All forms use Zod schemas for validation:

```typescript
// Blog creation validation
const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  little_description: z.string().min(1, "Description is required"),
  // ... other fields
});
```

## Notifications

Toast notifications inform users of:

- Successful operations (create, update, delete)
- Error messages
- Loading states for long operations

## Responsive Design

The application is fully responsive:

- **Desktop**: Full featured interface with sidebar navigation
- **Tablet**: Adapted layout for medium screens
- **Mobile**: Optimized for touch interaction

## Best Practices

1. **Always validate data** before sending to API
2. **Handle loading states** for better UX
3. **Show meaningful error messages** to users
4. **Use TypeScript** for type safety
5. **Follow component composition** patterns
6. **Keep state minimal** and normalized

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your Laravel backend allows requests from localhost:3000
2. **Authentication Errors**: Check your bearer token in `.env.local`
3. **Network Errors**: Verify your API base URL is correct
4. **Module Not Found**: Try restarting the development server

### Debug Mode

To enable debug logging, check the browser console for:

- API request/response logs
- State change logs (with Redux DevTools)
- Error details and stack traces
