'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CatalogClient({ initialProducts }) {
    const [mounted, setMounted] = useState(false);
    const products = initialProducts || [];

    useEffect(() => {
        setMounted(true);
    }, []);

    // Group products by category
    const categories = {
        health: { title: 'Здоровье', items: products.filter(p => p.category === 'health') },
        beauty: { title: 'Красота', items: products.filter(p => p.category === 'beauty') },
        hygiene: { title: 'Гигиена', items: products.filter(p => p.category === 'hygiene') },
        home: { title: 'Дом', items: products.filter(p => p.category === 'home') },
    };

    if (!mounted) return null;

    return (
        <>
            <Header />

            <main className="main">
                <section className="catalog">
                    <div className="container">
                        <h1 className="section-title">Каталог продукции</h1>

                        <div className="catalog-nav">
                            <Link href="#health" className="catalog-nav__link">Здоровье</Link>
                            <Link href="#beauty" className="catalog-nav__link">Красота</Link>
                            <Link href="#hygiene" className="catalog-nav__link">Гигиена</Link>
                            <Link href="#home" className="catalog-nav__link">Дом</Link>
                        </div>

                        {Object.entries(categories).map(([key, category]) => (
                            <div key={key} id={key} className="catalog-category" style={{ marginBottom: 'var(--spacing-lg)', scrollMarginTop: '100px' }}>
                                <h2 className="catalog-category__title" style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>{category.title}</h2>
                                <div className="catalog__grid">
                                    {category.items.map(product => (
                                        <article key={product.id} className="card">
                                            <div className="card__image-wrapper">
                                                <img src={product.image} alt={product.title} className="card__image" />
                                            </div>
                                            <div className="card__content">
                                                <h3 className="card__title">{product.title}</h3>
                                                <p className="card__desc">{product.description}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                                    <div>
                                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-primary)' }}>{product.price.toLocaleString('ru-RU')} ₽</span>
                                                        <span className="card__pv" style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#666' }}>{product.pv} PV</span>
                                                    </div>
                                                    <Link href={`/product/${product.id}`} className="btn btn--primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                                                        Подробнее
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
