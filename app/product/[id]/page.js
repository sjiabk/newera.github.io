import { getProductById, getProducts } from '@/lib/db';
import ProductClient from './ProductClient';

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        id: product.id,
    }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return {
            title: 'Товар не найден',
        };
    }

    return {
        title: `${product.title} | New Era`,
        description: product.description,
        openGraph: {
            title: product.title,
            description: product.description,
            images: [product.image],
        },
    };
}

export default async function ProductPage({ params }) {
    const { id } = await params;
    const product = await getProductById(id);

    return <ProductClient product={product} />;
}
