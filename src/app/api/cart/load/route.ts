// src/app/api/cart/load/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    const client = await clientPromise;
    const db = client.db('divine-delights');
    
    const cart = await db.collection('carts').findOne({ sessionId });
    
    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load cart' }, { status: 500 });
  }
}