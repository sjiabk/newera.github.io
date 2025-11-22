import { getProducts } from '@/lib/db';
import CatalogClient from './CatalogClient';

export const metadata = {
    title: 'Каталог продукции | New Era',
    description: 'Полный каталог продукции New Era: пыльца сосны, бамбук здоровья, натуральная косметика и средства для дома.',
};

export default async function CatalogPage() {
    const products = await getProducts();

    return <CatalogClient initialProducts={products} />;
}
