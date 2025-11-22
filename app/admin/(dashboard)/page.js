'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert('Не удалось удалить товар');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Загрузка...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: '#333' }}>Товары</h1>
                <Link href="/admin/products/new" className="btn btn--primary">
                    + Добавить товар
                </Link>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Фото</th>
                            <th>Название</th>
                            <th>Категория</th>
                            <th>Цена</th>
                            <th>PV</th>
                            <th style={{ textAlign: 'right' }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <img src={product.image} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td style={{ fontWeight: '500' }}>{product.title}</td>
                                <td style={{ textTransform: 'capitalize' }}>
                                    {{
                                        'health': 'Здоровье',
                                        'beauty': 'Красота',
                                        'hygiene': 'Гигиена',
                                        'home': 'Дом'
                                    }[product.category] || product.category}
                                </td>
                                <td>{product.price} ₽</td>
                                <td>{product.pv}</td>
                                <td>
                                    <div className="table__actions">
                                        <Link href={`/admin/products/${product.id}`} style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
                                            Изменить
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-danger"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
