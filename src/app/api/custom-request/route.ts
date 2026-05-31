import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      cakeType, 
      flavor, 
      size, 
      occasion, 
      designDescription, 
      deliveryDate, 
      budget,
      specialInstructions 
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !cakeType || !flavor || !size || !occasion || !designDescription || !deliveryDate) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('divine-delights');
    
    const result = await db.collection('custom-requests').insertOne({
      name,
      email,
      phone,
      cakeType,
      flavor,
      size,
      occasion,
      designDescription,
      deliveryDate,
      budget: parseFloat(budget) || 0,
      specialInstructions,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Send confirmation email (in production, you would integrate with email service)
    console.log('Custom cake request saved:', {
      id: result.insertedId,
      name,
      email,
      cakeType
    });

    return NextResponse.json({ 
      success: true, 
      message: "Request received! We will contact you within 24 hours.",
      requestId: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving custom request:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}