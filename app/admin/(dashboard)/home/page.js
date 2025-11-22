'use client';

import { useState, useEffect } from 'react';

export default function AdminHome() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetch('/api/admin/home')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch('/api/admin/home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            alert('Сохранено!');
        } catch (error) {
            alert('Ошибка при сохранении');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (section, field, value) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleImageUpload = async (e, section, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const json = await res.json();
                if (section === 'hero') {
                    handleChange('hero', 'image', json.url);
                } else if (section === 'catalog' && index !== null) {
                    const newCategories = [...(data.catalog?.categories || [])];
                    newCategories[index] = { ...newCategories[index], image: json.url };
                    handleChange('catalog', 'categories', newCategories);
                }
            } else {
                alert('Ошибка загрузки изображения');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Ошибка загрузки изображения');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="container">
            <h1 className="section-title" style={{ textAlign: 'left' }}>Редактирование главной страницы</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Первый экран (Hero)</h2>
                    <div className="form__group">
                        <label className="form__label">Заголовок (HTML поддерживается)</label>
                        <input
                            type="text"
                            className="form__input"
                            value={data.hero?.title || ''}
                            onChange={(e) => handleChange('hero', 'title', e.target.value)}
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Подзаголовок</label>
                        <textarea
                            className="form__textarea"
                            value={data.hero?.subtitle || ''}
                            onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изображение</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                className="form__input"
                                value={data.hero?.image || ''}
                                onChange={(e) => handleChange('hero', 'image', e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <label className="btn btn--outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap', height: '45px', display: 'flex', alignItems: 'center' }}>
                                {uploading ? 'Загрузка...' : 'Загрузить'}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero')} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                        </div>
                        {data.hero?.image && (
                            <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', display: 'inline-block' }}>
                                <img src={data.hero.image} alt="Hero Preview" style={{ height: '150px', objectFit: 'contain', display: 'block' }} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Обо мне</h2>
                    <div className="form__group">
                        <label className="form__label">Заголовок</label>
                        <input
                            type="text"
                            className="form__input"
                            value={data.about?.title || ''}
                            onChange={(e) => handleChange('about', 'title', e.target.value)}
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Текст (HTML поддерживается)</label>
                        <textarea
                            className="form__textarea"
                            style={{ minHeight: '200px' }}
                            value={data.about?.content || ''}
                            onChange={(e) => handleChange('about', 'content', e.target.value)}
                        />
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Каталог</h2>
                    <div className="form__group">
                        <label className="form__label">Заголовок</label>
                        <input
                            type="text"
                            className="form__input"
                            value={data.catalog?.title || ''}
                            onChange={(e) => handleChange('catalog', 'title', e.target.value)}
                        />
                    </div>
                    <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Категории</h3>
                    {(data.catalog?.categories || []).map((category, index) => (
                        <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px', position: 'relative' }}>
                            <div className="form__group">
                                <label className="form__label">Название категории</label>
                                <input
                                    type="text"
                                    className="form__input"
                                    value={category.title || ''}
                                    onChange={(e) => {
                                        const newCategories = [...(data.catalog?.categories || [])];
                                        newCategories[index] = { ...newCategories[index], title: e.target.value };
                                        handleChange('catalog', 'categories', newCategories);
                                    }}
                                />
                            </div>
                            <div className="form__group">
                                <label className="form__label">Описание</label>
                                <textarea
                                    className="form__textarea"
                                    rows="2"
                                    value={category.description || ''}
                                    onChange={(e) => {
                                        const newCategories = [...(data.catalog?.categories || [])];
                                        newCategories[index] = { ...newCategories[index], description: e.target.value };
                                        handleChange('catalog', 'categories', newCategories);
                                    }}
                                />
                            </div>
                            <div className="form__group">
                                <label className="form__label">Изображение</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        className="form__input"
                                        value={category.image || ''}
                                        onChange={(e) => {
                                            const newCategories = [...(data.catalog?.categories || [])];
                                            newCategories[index] = { ...newCategories[index], image: e.target.value };
                                            handleChange('catalog', 'categories', newCategories);
                                        }}
                                        style={{ flex: 1 }}
                                    />
                                    <label className="btn btn--outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap', height: '45px', display: 'flex', alignItems: 'center' }}>
                                        {uploading ? 'Загрузка...' : 'Загрузить'}
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'catalog', index)} style={{ display: 'none' }} disabled={uploading} />
                                    </label>
                                </div>
                                {category.image && (
                                    <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', display: 'inline-block' }}>
                                        <img src={category.image} alt={`Category ${index}`} style={{ height: '100px', objectFit: 'cover', display: 'block' }} />
                                    </div>
                                )}
                            </div>
                            <div className="form__group">
                                <label className="form__label">Ссылка на раздел (например, /catalog#health)</label>
                                <input
                                    type="text"
                                    className="form__input"
                                    value={category.link || ''}
                                    onChange={(e) => {
                                        const newCategories = [...(data.catalog?.categories || [])];
                                        newCategories[index] = { ...newCategories[index], link: e.target.value };
                                        handleChange('catalog', 'categories', newCategories);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Отзывы</h2>
                    {(data.reviews || []).map((review, index) => (
                        <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px', position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    const newReviews = [...(data.reviews || [])];
                                    newReviews.splice(index, 1);
                                    setData(prev => ({ ...prev, reviews: newReviews }));
                                }}
                                style={{ position: 'absolute', top: '10px', right: '10px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Удалить
                            </button>
                            <div className="form__group">
                                <label className="form__label">Текст отзыва</label>
                                <textarea
                                    className="form__textarea"
                                    rows="3"
                                    value={review.text || ''}
                                    onChange={(e) => {
                                        const newReviews = [...(data.reviews || [])];
                                        newReviews[index] = { ...newReviews[index], text: e.target.value };
                                        setData(prev => ({ ...prev, reviews: newReviews }));
                                    }}
                                />
                            </div>
                            <div className="form__group">
                                <label className="form__label">Автор</label>
                                <input
                                    type="text"
                                    className="form__input"
                                    value={review.author || ''}
                                    onChange={(e) => {
                                        const newReviews = [...(data.reviews || [])];
                                        newReviews[index] = { ...newReviews[index], author: e.target.value };
                                        setData(prev => ({ ...prev, reviews: newReviews }));
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn--outline"
                        onClick={() => {
                            setData(prev => ({
                                ...prev,
                                reviews: [...(prev.reviews || []), { id: Date.now(), text: '', author: '' }]
                            }));
                        }}
                    >
                        + Добавить отзыв
                    </button>
                </div>

                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Контакты</h2>
                    <div className="form__group">
                        <label className="form__label">Заголовок</label>
                        <input
                            type="text"
                            className="form__input"
                            value={data.contact?.title || ''}
                            onChange={(e) => handleChange('contact', 'title', e.target.value)}
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Описание</label>
                        <textarea
                            className="form__textarea"
                            value={data.contact?.description || ''}
                            onChange={(e) => handleChange('contact', 'description', e.target.value)}
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Телефон</label>
                        <input
                            type="text"
                            className="form__input"
                            value={data.contact?.phone || ''}
                            onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Email</label>
                        <input
                            type="text"
                            className="form__input"
                            value={data.contact?.email || ''}
                            onChange={(e) => handleChange('contact', 'email', e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn--primary" disabled={saving}>
                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
            </form>
        </div>
    );
}
