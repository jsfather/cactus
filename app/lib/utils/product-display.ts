import { PublicProduct } from '@/app/lib/services/public-product.service';

export interface DisplayProduct {
  id: string | number;
  title: string;
  price: string;
  discount: string | null;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  originalId?: number;
  actualPrice?: number;
}

export function formatProductPrice(price: number, locale = 'fa-IR'): string {
  return new Intl.NumberFormat(locale).format(price);
}

export function convertApiProductToDisplayFormat(
  apiProduct: PublicProduct,
  locale = 'fa-IR'
): DisplayProduct {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    price: formatProductPrice(apiProduct.price, locale),
    discount: apiProduct.discount_price
      ? formatProductPrice(apiProduct.discount_price, locale)
      : null,
    image: apiProduct.image || '/product-1.jpg',
    category: apiProduct.category?.name || 'عمومی',
    rating: apiProduct.rating || 4.0,
    reviews: apiProduct.reviews_count || 0,
    inStock: apiProduct.stock > 0,
    originalId: apiProduct.id,
    actualPrice: apiProduct.discount_price || apiProduct.price,
  };
}
