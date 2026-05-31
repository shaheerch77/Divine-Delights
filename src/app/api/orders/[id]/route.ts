import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params; // Await the params promise
    const client = await clientPromise;
    const db = client.db('divine-delights');
    
    const order = await db
      .collection('orders')
      .findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params; // Await the params promise
    const updateData = await request.json();
    const client = await clientPromise;
    const db = client.db('divine-delights');

    const result = await db
      .collection('orders')
      .updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}