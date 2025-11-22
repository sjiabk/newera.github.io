import ProductForm from '../../components/ProductForm';

export default function NewProductPage() {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '2rem' }}>Добавить новый товар</h1>
            <ProductForm />
        </div>
    );
}
