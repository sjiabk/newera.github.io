import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/db';

export async function GET() {
    const products = await getProducts();
    return NextResponse.json(products);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const products = await getProducts();

        // Generate a new ID (simplified)
        const newId = body.id || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Check if ID exists
        if (products.find(p => p.id === newId)) {
            return NextResponse.json({ error: 'Product ID already exists' }, { status: 400 });
        }

        const newProduct = {
            ...body,
            id: newId,
        };

        products.push(newProduct);
        await saveProducts(products);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
