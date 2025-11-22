import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, phone, message } = body;

        // Validate input
        if (!name || !phone) {
            return NextResponse.json(
                { error: 'Name and phone are required' },
                { status: 400 }
            );
        }

        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;

        if (telegramBotToken && telegramChatId) {
            const text = `
📩 *Новая заявка с сайта*

👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
📝 *Сообщение:*
${message || 'Без сообщения'}
      `;

            const response = await fetch(
                `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: telegramChatId,
                        text: text,
                        parse_mode: 'Markdown',
                    }),
                }
            );

            if (!response.ok) {
                console.error('Telegram API Error:', await response.text());
                // We don't fail the request to the user if Telegram fails, but we log it.
            }
        } else {
            console.log('Telegram credentials not found. Skipping notification.');
            console.log('Form Data:', { name, phone, message });
        }

        return NextResponse.json(
            { message: 'Form submitted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
