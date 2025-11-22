'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__container">
                <div className="footer__col">
                    <Link href="/" className="logo">
                        <span className="logo__text logo__text--footer">New Era</span>
                    </Link>
                    <p className="footer__desc">Независимый дистрибьютор.</p>
                </div>
                <div className="footer__col">
                    <h4 className="footer__title">Меню</h4>
                    <ul className="footer__links">
                        <li><Link href="/">Главная</Link></li>
                        <li><Link href="/catalog">Каталог</Link></li>
                        <li><Link href="/#reviews">Отзывы</Link></li>
                    </ul>
                </div>
                <div className="footer__col">
                    <h4 className="footer__title">Соцсети</h4>
                    <div className="social-links">
                        <a href="#" className="social-link">VK</a>
                        <a href="#" className="social-link">Telegram</a>
                        <a href="#" className="social-link">YouTube</a>
                    </div>
                </div>
            </div>
            <div className="footer__bottom">
                <p>&copy; 2025 New Era Distributor. Все права защищены.</p>
            </div>
        </footer>
    );
}
