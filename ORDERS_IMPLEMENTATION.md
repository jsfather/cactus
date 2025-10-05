# Student Orders System Implementation

This implementation provides a complete orders management system for students in the Cactus project. The system follows the established patterns and architecture of the project.

## Features Implemented

### 1. API Integration

- **GET /api/orders** - List all orders for the student
- **GET /api/orders/{id}** - Get order details by ID
- **POST /order/buy** - Create and finalize order for payment
- **POST /orders/show_with_code** - Track order by code

### 2. Pages Created

- **Orders List**: `/student/orders` - Shows all student orders with filtering and search
- **Order Details**: `/student/orders/{id}` - Detailed view of a specific order
- **Order Tracking**: Modal for tracking orders by code

### 3. Components Structure

- **Service Layer**: `lib/services/student-order.service.ts`
- **Store Layer**: `lib/stores/student-order.store.ts` (Zustand)
- **Hook Layer**: `lib/hooks/use-student-order.ts`
- **Types**: Updated `lib/types/order.ts` to match API response
- **Utils**: `lib/utils/order.ts` for status management

### 4. Navigation Integration

- Added "سفارشات" (Orders) route to student sidebar menu
- Route protection through existing RoleGuard system

### 5. Checkout Integration

- Updated `(main)/shop/checkout/page.tsx` to use the buy order API
- Integrates with existing CartContext
- Redirects to payment gateway on successful order creation

## Usage Examples

### Creating an Order (Checkout Process)

```typescript
const orderData = {
  products: [6], // Array of product IDs
  address: 'تهران، خیابان آزادی، پلاک ۱۲۳',
  postal_code: '1234567890',
};

const response = await buyOrder(orderData);
// Redirects to response.payment_url for payment
```

### Tracking an Order

```typescript
await showOrderWithCode({ code: 'O-20251004-000002' });
```

## Order Status System

The system supports the following order statuses:

- `pending` - در انتظار پردازش
- `processing` - در حال پردازش
- `shipped` - ارسال شده
- `delivered` - تحویل داده شده
- `cancelled` - لغو شده

Each status has its own icon, color scheme, and Persian translation.

## File Structure

```
app/
├── (panel)/student/orders/
│   ├── page.tsx                    # Orders list page
│   ├── [id]/page.tsx              # Order details page
│   ├── error.tsx                   # Error boundary
│   └── loading.tsx                 # Loading skeleton
├── lib/
│   ├── services/
│   │   └── student-order.service.ts
│   ├── stores/
│   │   └── student-order.store.ts
│   ├── hooks/
│   │   └── use-student-order.ts
│   ├── types/
│   │   └── order.ts               # Updated types
│   └── utils/
│       └── order.ts               # Order utilities
└── (main)/shop/checkout/
    └── page.tsx                   # Updated checkout
```

## API Response Structures

### Order List Response

```json
{
  "data": [
    /* orders array */
  ],
  "links": {
    /* pagination links */
  },
  "meta": {
    /* pagination metadata */
  }
}
```

### Order Item Structure

```json
{
  "id": 2,
  "code": "O-20251004-000002",
  "user": {
    "id": 68,
    "name": "فرید حسین پور",
    "email": null,
    "phone": "09148009297"
  },
  "status": "pending",
  "total_price": 100000,
  "address": "تهران، خیابان آزادی، پلاک ۱۲۳",
  "postal_code": "1234567890",
  "created_at": "2025-10-04T17:27:35.000000Z",
  "items": [
    /* order items */
  ]
}
```

## Error Handling

- API errors are handled in the Zustand store
- User-friendly Persian error messages
- Toast notifications for success/error states
- Proper loading states throughout the UI

## RTL Support

- All components are RTL-compatible
- Persian date formatting
- Proper text alignment and spacing
- Arabic numerals formatted for Persian locale
