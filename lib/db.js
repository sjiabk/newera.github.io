import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

export async function getProducts() {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveProducts(products) {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

export async function getProductById(id) {
    const products = await getProducts();
    return products.find(p => p.id === id);
}

export async function getAdminSettings() {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Fallback default
        return { username: 'admin', password: 'admin1' };
    }
}

export async function saveAdminSettings(settings) {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

const HOME_FILE = path.join(DATA_DIR, 'home.json');

export async function getHomePageData() {
    try {
        const data = await fs.readFile(HOME_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

export async function saveHomePageData(data) {
    await fs.writeFile(HOME_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
