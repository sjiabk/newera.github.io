'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { toggleCart, cartCount } = useCart();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="container header__container">
                <Link href="/" className="logo">
                    <img src="/assets/logo.png" alt="New Era Logo" className="logo__img" />
                </Link>
                <nav className="nav">
                    <ul className={`nav__list ${isMenuOpen ? 'active' : ''}`}>
                        <li className="nav__item"><Link href="/" className="nav__link" onClick={closeMenu}>Главная</Link></li>
                        <li className="nav__item"><Link href="/#about" className="nav__link" onClick={closeMenu}>Обо мне</Link></li>
                        <li className="nav__item"><Link href="/catalog" className="nav__link" onClick={closeMenu}>Каталог</Link></li>
                        <li className="nav__item"><Link href="/#reviews" className="nav__link" onClick={closeMenu}>Отзывы</Link></li>
                        <li className="nav__item"><Link href="/#contact" className="nav__link" onClick={closeMenu}>Контакты</Link></li>
                    </ul>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="nav__cart" onClick={toggleCart} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <ShoppingBag />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button className="nav__toggle" aria-label="Открыть меню" onClick={toggleMenu}>
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
