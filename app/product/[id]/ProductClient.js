'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';

export default function ProductClient({ product }) {
    const { addToCart } = useCart();

    if (!product) {
        return (
            <>
                <Header />
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <h2>Товар не найден</h2>
                    <Link href="/catalog" className="btn btn--primary" style={{ marginTop: '1rem' }}>Вернуться в каталог</Link>
                </div>
                <Footer />
            </>
        );
    }

    const whatsappMessage = `Здравствуйте! Я хочу заказать: ${product.title}`;
    const whatsappLink = `https://wa.me/79990000000?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <>
            <Header />

            <main className="main">
                <section className="section product-details">
                    <div className="container">
                        <Link href="/catalog" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: '500', color: 'var(--color-text-light)' }}>
                            <ArrowLeft size={20} /> Вернуться в каталог
                        </Link>

                        <div className="product-detail__container">
                            <div className="product-image-col">
                                <img src={product.image} alt={product.title} className="product-detail__image" />
                            </div>
                            <div className="product-info-col">
                                <h1 className="product-detail__title">{product.title}</h1>
                                <div className="product-meta">
                                    <span className="product-detail__price">{product.price.toLocaleString('ru-RU')} ₽</span>
                                    <span className="product-pv" style={{ marginLeft: '15px', fontSize: '1.1rem', color: 'var(--color-text-light)' }}>{product.pv} PV</span>
                                </div>
                                <p className="product-detail__description">{product.fullDescription || product.description}</p>

                                <div className="product-properties">
                                    <h3 className="product-detail__subtitle">Свойства:</h3>
                                    <ul className="product-detail__list">
                                        {product.properties && product.properties.map((prop, index) => (
                                            <li key={index}>{prop}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="product-composition">
                                    <h3 className="product-detail__subtitle">Состав:</h3>
                                    <p>{product.composition}</p>
                                </div>

                                <div className="product-usage">
                                    <h3 className="product-detail__subtitle">Способ применения:</h3>
                                    <p>{product.usage}</p>
                                </div>

                                {product.certificates && product.certificates.length > 0 && (
                                    <div className="product-certificates">
                                        <h3 className="product-detail__subtitle">Сертификаты:</h3>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {product.certificates.map((cert, index) => (
                                                <a key={index} href={cert} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={cert}
                                                        alt={`Сертификат ${index + 1}`}
                                                        style={{ width: '100px', height: '140px', objectFit: 'cover', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)' }}
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="product-detail__actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                    <button onClick={() => addToCart(product)} className="btn btn--primary">
                                        Добавить в корзину
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
