import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('divine-delights');
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let query = {};
    if (category && category !== 'all') {
      query = { category, isAvailable: true };
    } else {
      query = { isAvailable: true };
    }

    const products = await db
      .collection('products')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}