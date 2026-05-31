import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateOrderNumber, calculateOrderTotals } from '@/lib/orderUtils';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('divine-delights');
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let query = {};
    if (userId) query = { ...query, userId };
    if (status) query = { ...query, status };

    const orders = await db
      .collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const client = await clientPromise;
    const db = client.db('divine-delights');

    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // Calculate totals
    const totals = calculateOrderTotals(orderData.items || []);
    
    // Create order document
    const order = {
      ...orderData,
      orderNumber,
      ...totals,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderId: result.insertedId,
      orderNumber
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}