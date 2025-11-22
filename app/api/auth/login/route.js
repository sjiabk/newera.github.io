import { NextResponse } from 'next/server';
import { getAdminSettings } from '@/lib/db';

// Force rebuild
export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const settings = await getAdminSettings();

        // Check both username and password
        // Note: In a real app, use bcrypt for password hashing
        if (username === settings.username && password === settings.password) {
            const response = NextResponse.json(
                { success: true },
                { status: 200 }
            );

            // Set a cookie for the session
            response.cookies.set('admin_session', 'true', {
                path: '/',
                maxAge: 60 * 60 * 24, // 1 day
                httpOnly: true,
                sameSite: 'strict',
            });

            return response;
        } else {
            return NextResponse.json(
                { error: 'Неверное имя пользователя или пароль' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}
