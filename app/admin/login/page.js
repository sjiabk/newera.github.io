'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh(); // Refresh to update middleware state
            } else {
                const data = await res.json();
                setError(data.error || 'Ошибка входа');
            }
        } catch (err) {
            setError('Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9f9f7'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e3d2f' }}>Вход в Админку</h1>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form__group">
                        <label className="form__label">Имя пользователя</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form__input"
                            required
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form__input"
                            required
                        />
                    </div>
                    {error && <p className="error-message" style={{ marginBottom: '1rem' }}>{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn--primary"
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
}
