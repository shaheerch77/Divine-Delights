// src/app/api/cart/save/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const cart = await request.json();
    const client = await clientPromise;
    const db = client.db('divine-delights');
    
    await db.collection('carts').updateOne(
      { sessionId: cart.sessionId },
      { $set: { ...cart, updatedAt: new Date() } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 });
  }
}