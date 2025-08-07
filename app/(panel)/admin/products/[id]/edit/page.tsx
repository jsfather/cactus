'use client';

import { use } from 'react';
import ProductFormPage from '../../new/page';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <ProductFormPage params={Promise.resolve({ id: resolvedParams.id })} />
  );
}
