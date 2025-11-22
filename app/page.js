import Link from 'next/link';
import ReviewsCarousel from './components/ReviewsCarousel';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import { getHomePageData } from '@/lib/db';

export default async function Home() {
    const data = await getHomePageData();

    // Fallback if data is missing
    const hero = data?.hero || {
        title: 'Здоровье и процветание с <span class="text-gold">New Era</span>',
        subtitle: 'Натуральная продукция на основе пыльцы сосны и бамбука для вашего активного долголетия.',
        image: 'assets/main.jpg'
    };

    const about = data?.about || {
        title: 'Обо мне',
        content: '<p>Приветствую! Я являюсь официальным партнером компании New Era Health Industry. Моя миссия — познакомить вас с уникальными природными продуктами, которые помогают сохранить здоровье, молодость и энергию.</p><p>Компания New Era — это государственный гигант Китая, специализирующийся на продуктах из пыльцы сосны и бамбука. Вся продукция сертифицирована и имеет высшие награды за качество.</p>'
    };

    const contact = data?.contact || {
        title: 'Свяжитесь со мной',
        description: 'Готов ответить на любые вопросы о продукции и сотрудничестве.',
        phone: '+7 (999) 000-00-00',
        email: 'info@newera-partner.ru',
        whatsapp: '#'
    };

    const catalog = data?.catalog || {
        title: 'Каталог продукции'
    };

    const reviews = data?.reviews || [
        {
            id: 1,
            text: "Пользуюсь пыльцой сосны уже полгода. Энергии стало намного больше, перестал болеть простудами. Отличный продукт!",
            author: "Алексей, Москва"
        },
        {
            id: 2,
            text: "Косметика просто чудо. Кожа стала бархатистой и сияющей. Очень рекомендую всем женщинам.",
            author: "Мария, Санкт-Петербург"
        },
        {
            id: 3,
            text: "Средство для стирки отстирывает всё и при этом не пахнет химией. Для аллергиков — спасение.",
            author: "Елена, Екатеринбург"
        }
    ];

    return (
        <>
            <Header />

            <main>
                <section id="hero" className="hero">
                    <div className="container hero__container">
                        <div className="hero__content">
                            <h1 className="hero__title" dangerouslySetInnerHTML={{ __html: hero.title }}></h1>
                            <p className="hero__subtitle">{hero.subtitle}</p>
                            <div className="hero__actions">
                                <Link href="/catalog" className="btn btn--primary">Перейти в каталог</Link>
                                <Link href="#contact" className="btn btn--outline">Связаться со мной</Link>
                            </div>
                        </div>
                        <div className="hero__image-wrapper">
                            <img src={hero.image}
                                alt="Дистрибьютор New Era" className="hero__image" />
                        </div>
                    </div>
                </section>

                <section id="about" className="about">
                    <div className="container">
                        <h2 className="section-title">{about.title}</h2>
                        <div className="about__content" dangerouslySetInnerHTML={{ __html: about.content }}></div>
                    </div>
                </section>

                <section id="catalog" className="catalog">
                    <div className="container">
                        <h2 className="section-title">{catalog.title}</h2>
                        <div className="catalog__grid home-catalog-grid">
                            {(catalog.categories || []).map((category, index) => (
                                <article className="card" key={index}>
                                    <div className="card__image-wrapper">
                                        <img src={category.image}
                                            alt={category.title} className="card__image" />
                                    </div>
                                    <div className="card__content">
                                        <h3 className="card__title">{category.title}</h3>
                                        <p className="card__desc">{category.description}</p>
                                        <Link href={category.link} className="card__link">Смотреть раздел &rarr;</Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <div className="catalog__footer">
                            <Link href="/catalog" className="btn btn--primary">Весь каталог</Link>
                        </div>
                    </div>
                </section>

                <section id="reviews" className="reviews">
                    <div className="container">
                        <h2 className="section-title">Отзывы клиентов</h2>
                        <ReviewsCarousel items={reviews} />
                    </div>
                </section>

                <section id="contact" className="contact">
                    <div className="container contact__container">
                        <div className="contact__info">
                            <h2 className="section-title">{contact.title}</h2>
                            <p>{contact.description}</p>
                            <ul className="contact__list">
                                <li><strong>Телефон:</strong> <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}>{contact.phone}</a></li>
                                <li><strong>Email:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a>
                                </li>
                                <li><strong>WhatsApp:</strong> <a href={contact.whatsapp}>Написать в WhatsApp</a></li>
                            </ul>
                        </div>
                        <ContactForm />
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}