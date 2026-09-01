import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amountInPaise, receipt } = body as { amountInPaise: number; receipt: string };

    if (!amountInPaise || amountInPaise <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: { source: 'diamond-car-wash' },
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}



