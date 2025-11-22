'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductForm({ initialData, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        category: 'health',
        price: '',
        pv: '',
        image: '',
        description: '',
        fullDescription: '',
        properties: '', // Will be split by newline
        composition: '',
        usage: '',
        certificates: '' // New field for certificates (URLs or text)
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                properties: Array.isArray(initialData.properties) ? initialData.properties.join('\n') : initialData.properties || '',
                certificates: Array.isArray(initialData.certificates) ? initialData.certificates.join('\n') : initialData.certificates || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                const json = await res.json();
                setFormData(prev => ({ ...prev, image: json.url }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                pv: Number(formData.pv),
                properties: formData.properties.split('\n').filter(line => line.trim() !== ''),
                certificates: formData.certificates ? formData.certificates.split('\n').filter(line => line.trim() !== '') : []
            };

            const url = isEdit ? `/api/products/${initialData.id}` : '/api/products';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                alert('Ошибка сохранения товара');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ошибка сохранения товара');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                {!isEdit && (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label className="form__label">ID (Необязательно - генерируется автоматически)</label>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            className="form__input"
                            placeholder="например: pine-pollen"
                        />
                    </div>
                )}

                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form__label">Название</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form__input"
                        required
                    />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form__label">Категория</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form__input"
                        style={{ height: '45px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                    >
                        <option value="health">Здоровье</option>
                        <option value="beauty">Красота</option>
                        <option value="hygiene">Гигиена</option>
                        <option value="home">Дом</option>
                    </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form__label">Изображение</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="form__input"
                            placeholder="URL изображения или загрузите файл"
                            required
                            style={{ flex: 1 }}
                        />
                        <label className="btn btn--outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap', height: '45px', display: 'flex', alignItems: 'center' }}>
                            {uploading ? 'Загрузка...' : 'Загрузить'}
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                        </label>
                    </div>
                    {formData.image && (
                        <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', display: 'inline-block' }}>
                            <img src={formData.image} alt="Preview" style={{ height: '150px', objectFit: 'contain', display: 'block' }} />
                        </div>
                    )}
                </div>

                <div>
                    <label className="form__label">Цена (₽)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="form__input"
                        required
                    />
                </div>

                <div>
                    <label className="form__label">PV</label>
                    <input
                        type="number"
                        name="pv"
                        value={formData.pv}
                        onChange={handleChange}
                        className="form__input"
                        required
                    />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form__label">Краткое описание</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form__textarea"
                        rows="2"
                        required
                    />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form__label">Полное описание</label>
                    <textarea
                        name="fullDescription"
                        value={formData.fullDescription}
                        onChange={handleChange}
                        className="form__textarea"
                        rows="4"
                    />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form__label">Свойства (Каждое с новой строки)</label>
                    <textarea
                        name="properties"
                        value={formData.properties}
                        onChange={handleChange}
                        className="form__textarea"
                        rows="4"
                        placeholder="Свойство 1&#10;Свойство 2&#10;Свойство 3"
                    />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form__label">Состав</label>
                    <textarea
                        name="composition"
                        value={formData.composition}
                        onChange={handleChange}
                        className="form__textarea"
                        rows="2"
                    />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form__label">Способ применения</label>
                    <textarea
                        name="usage"
                        value={formData.usage}
                        onChange={handleChange}
                        className="form__textarea"
                        rows="2"
                    />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form__label">Сертификаты</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                        <label className="btn btn--outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            {uploading ? 'Загрузка...' : 'Добавить сертификат'}
                            <input type="file" accept="image/*" onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setUploading(true);
                                const data = new FormData();
                                data.append('file', file);
                                try {
                                    const res = await fetch('/api/upload', { method: 'POST', body: data });
                                    if (res.ok) {
                                        const json = await res.json();
                                        const currentCerts = formData.certificates ? formData.certificates.split('\n').filter(Boolean) : [];
                                        setFormData(prev => ({ ...prev, certificates: [...currentCerts, json.url].join('\n') }));
                                    } else {
                                        alert('Ошибка загрузки');
                                    }
                                } catch (err) {
                                    console.error(err);
                                    alert('Ошибка загрузки');
                                } finally {
                                    setUploading(false);
                                }
                            }} style={{ display: 'none' }} disabled={uploading} />
                        </label>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {formData.certificates && formData.certificates.split('\n').filter(Boolean).map((cert, index) => (
                            <div key={index} style={{ position: 'relative', border: '1px solid #eee', padding: '5px', borderRadius: '4px' }}>
                                <img src={cert} alt={`Cert ${index}`} style={{ width: '80px', height: '100px', objectFit: 'cover' }} />
                                <button type="button" onClick={() => {
                                    const certs = formData.certificates.split('\n').filter(Boolean);
                                    certs.splice(index, 1);
                                    setFormData(prev => ({ ...prev, certificates: certs.join('\n') }));
                                }} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>×</button>
                            </div>
                        ))}
                    </div>
                    <textarea
                        name="certificates"
                        value={formData.certificates}
                        onChange={handleChange}
                        className="form__textarea"
                        rows="3"
                        placeholder="URL сертификатов (можно добавить вручную или загрузить)"
                        style={{ marginTop: '10px' }}
                    />
                </div>

            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn--primary" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить товар'}
                </button>
                <Link href="/admin" className="btn btn--outline" style={{ textAlign: 'center' }}>
                    Отмена
                </Link>
            </div>
        </form>
    );
}
