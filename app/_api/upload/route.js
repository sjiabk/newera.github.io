import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '_' + file.name.replace(/\s/g, '_');

        // Ensure uploads directory exists (you might need to create it manually first or add logic here)
        // For now, assuming public/uploads exists or will be created
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Create directory if it doesn't exist
        try {
            await require('fs').promises.mkdir(uploadDir, { recursive: true });
        } catch (e) {
            console.error('Error creating directory', e);
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
