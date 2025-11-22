'use client';

import Link from 'next/link';


export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <Link href="/admin" className="admin-logo">
                    <img src="/assets/logo.png" alt="New Era Admin" style={{ height: '40px' }} />
                    <span style={{ fontSize: '0.9rem', opacity: 0.7, fontWeight: 'normal', marginLeft: 'auto' }}>Admin</span>
                </Link>
                <nav>
                    <ul className="admin-nav__list">
                        <li className="admin-nav__item">
                            <Link href="/admin" className="admin-nav__link">Товары</Link>
                        </li>
                        <li className="admin-nav__item">
                            <Link href="/admin/home" className="admin-nav__link">Главная страница</Link>
                        </li>
                        <li className="admin-nav__item">
                            <Link href="/" target="_blank" className="admin-nav__link">На сайт ↗</Link>
                        </li>
                        <li className="admin-nav__item" style={{ marginTop: 'auto' }}>
                            <button onClick={async () => {
                                await fetch('/api/auth/logout', { method: 'POST' });
                                window.location.href = '/admin/login';
                            }} className="text-danger" style={{ fontSize: '1.1rem' }}>
                                Выйти
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="admin-content">
                {children}
            </main>
        </div>
    );
}
