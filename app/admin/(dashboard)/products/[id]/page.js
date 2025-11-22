import { getProductById, getProducts } from '@/lib/db';
import ProductForm from '../../components/ProductForm';

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        id: product.id,
    }));
}

export default async function EditProductPage({ params }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return <div>Товар не найден</div>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '2rem' }}>Редактировать товар</h1>
            <ProductForm initialData={product} isEdit={true} />
        </div>
    );
}
