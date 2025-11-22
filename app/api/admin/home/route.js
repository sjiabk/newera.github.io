import { getHomePageData, saveHomePageData } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getHomePageData();
    return NextResponse.json(data || {});
}

export async function POST(request) {
    try {
        const data = await request.json();
        await saveHomePageData(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
