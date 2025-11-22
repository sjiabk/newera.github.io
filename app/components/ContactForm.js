'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ContactForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

    const onSubmit = async (data) => {
        setSubmitStatus(null);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSubmitStatus('success');
                reset();
                // Optional: Open WhatsApp as fallback or additional action
                // const text = `Здравствуйте! Меня зовут ${data.name}. Мой телефон: ${data.phone}. Сообщение: ${data.message}`;
                // window.open(`https://wa.me/79990000000?text=${encodeURIComponent(text)}`, '_blank');
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form__group">
                <label htmlFor="name" className="form__label">Ваше имя</label>
                <input
                    type="text"
                    id="name"
                    className={`form__input ${errors.name ? 'input-error' : ''}`}
                    {...register('name', { required: 'Пожалуйста, введите ваше имя' })}
                />
                {errors.name && <span className="error-message" style={{ color: 'red', fontSize: '0.875rem' }}>{errors.name.message}</span>}
            </div>

            <div className="form__group">
                <label htmlFor="phone" className="form__label">Телефон</label>
                <input
                    type="tel"
                    id="phone"
                    className={`form__input ${errors.phone ? 'input-error' : ''}`}
                    {...register('phone', {
                        required: 'Пожалуйста, введите ваш телефон',
                        pattern: {
                            value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,
                            message: 'Введите корректный номер телефона',
                        },
                    })}
                />
                {errors.phone && <span className="error-message" style={{ color: 'red', fontSize: '0.875rem' }}>{errors.phone.message}</span>}
            </div>

            <div className="form__group">
                <label htmlFor="message" className="form__label">Сообщение</label>
                <textarea
                    id="message"
                    className="form__textarea"
                    rows="4"
                    {...register('message')}
                ></textarea>
            </div>

            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                {isSubmitting ? 'Отправка...' : 'Отправить'}
            </button>

            {submitStatus === 'success' && (
                <p style={{ marginTop: '1rem', color: 'green' }}>Спасибо! Ваша заявка отправлена.</p>
            )}
            {submitStatus === 'error' && (
                <p style={{ marginTop: '1rem', color: 'red' }}>Произошла ошибка. Пожалуйста, попробуйте позже.</p>
            )}
        </form>
    );
}
