import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/db';

export async function GET(request, { params }) {
    const { id } = await params;
    const products = await getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const products = await getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Update product
        products[index] = { ...products[index], ...body };
        await saveProducts(products);

        return NextResponse.json(products[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const products = await getProducts();
        const newProducts = products.filter(p => p.id !== id);

        if (products.length === newProducts.length) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        await saveProducts(newProducts);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
