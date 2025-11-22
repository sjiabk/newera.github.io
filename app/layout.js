import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import BackToTop from './components/BackToTop';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-main' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-heading' });

export const metadata = {
    title: 'New Era - Ваш проводник в мир здоровья и красоты',
    description: 'Официальный партнер New Era. Продукция для здоровья, красоты и дома. Пыльца сосны, бамбук здоровья и натуральная косметика.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
            <body>
                <CartProvider>
                    {children}
                    <BackToTop />
                    <CartDrawer />
                </CartProvider>
            </body>
        </html>
    );
}
