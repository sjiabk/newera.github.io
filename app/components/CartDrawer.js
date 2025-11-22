'use client';

import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();

    const handleCheckout = () => {
        const message = cart.map(item => `${item.title} (${item.quantity} шт.)`).join('\n');
        const total = `Итого: ${cartTotal.toLocaleString('ru-RU')} ₽`;
        const whatsappMessage = `Здравствуйте! Я хочу оформить заказ:\n\n${message}\n\n${total}`;
        const whatsappLink = `https://wa.me/79990000000?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappLink, '_blank');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="cart-overlay"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#000',
                            zIndex: 999,
                        }}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="cart-drawer"
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '100%',
                            maxWidth: '400px',
                            height: '100%',
                            backgroundColor: '#fff',
                            zIndex: 1000,
                            zIndex: 1000,
                            boxShadow: 'var(--shadow)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div className="cart-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Корзина</h2>
                            <button onClick={toggleCart} className="cart-close-btn" aria-label="Закрыть корзину">
                                <X />
                            </button>
                        </div>

                        <div className="cart-items">
                            {cart.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '2rem' }}>Ваша корзина пуста</p>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {cart.map((item) => (
                                        <li key={item.id} className="cart-item">
                                            <img src={item.image} alt={item.title} className="cart-item__image" />
                                            <div className="cart-item__details">
                                                <h3 className="cart-item__title">{item.title}</h3>
                                                <p className="cart-item__price">{item.price.toLocaleString('ru-RU')} ₽</p>
                                                <div className="cart-item__actions">
                                                    <div className="quantity-controls">
                                                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus size={16} /></button>
                                                        <span className="quantity-value">{item.quantity}</span>
                                                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.id)} className="remove-btn" aria-label="Удалить">
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total">
                                <span>Итого:</span>
                                <span>{cartTotal.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className="btn btn--primary checkout-btn"
                                style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
                            >
                                Оформить заказ
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
