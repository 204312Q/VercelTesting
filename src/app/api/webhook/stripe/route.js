import { NextResponse } from "next/server";
import { headers } from "next/headers";

const stripe = require('stripe')(process.env.NEXT_STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Test endpoint to verify webhook is accessible
export async function GET(request) {
  console.log('🧪 TEST: Webhook endpoint is accessible!');
  return NextResponse.json({ status: 'Webhook endpoint is working!' }, { status: 200 });
}

export async function POST(request) {
  console.log('🚀 WEBHOOK RECEIVED - Starting processing...');
  
  try {
    const body = await request.text();
    console.log('📝 Body received, length:', body.length);
    
    const headersList = headers();
    const sig = headersList.get('stripe-signature');
    console.log('🔐 Signature present:', !!sig);

    let event;

    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      console.log('✅ Signature verified successfully');
    } catch (err) {
      console.error(`❌ Webhook signature verification failed:`, err.message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    console.log(`🎣 Received webhook event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('🎯 Processing checkout.session.completed');
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        console.log('💰 Processing payment_intent.succeeded');
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      default:
        console.log(`⚠️ Unhandled event type ${event.type}`);
    }

    console.log('🎉 Webhook processed successfully');
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session) {
  try {
    console.log('🎉 PAYMENT SUCCESSFUL! Processing checkout session:', session.id);
    
    // Extract ALL order data from optimized metadata
    const orderData = {
      // Stripe Information
      stripeSessionId: session.id,
      stripePaymentStatus: session.payment_status,
      totalAmountPaid: session.amount_total / 100, // Convert from cents
      currency: session.currency,
      
      // Order Information
      orderId: session.metadata.orderId,
      paymentStatus: 'completed',
      
      // Customer Information
      customerName: session.metadata.customerName,
      customerEmail: session.metadata.customerEmail || session.customer_email,
      customerPhone: session.metadata.customerPhone,
      
      // Delivery Information
      deliveryAddress: JSON.parse(session.metadata.deliveryAddress || '{}'),
      deliveryDate: session.metadata.deliveryDate,
      startWith: session.metadata.startWith,
      specialRequests: session.metadata.specialRequests,
      
      // Product Information
      products: JSON.parse(session.metadata.products || '[]'),
      addOns: JSON.parse(session.metadata.addOns || '[]'),
      selectedBundles: JSON.parse(session.metadata.selectedBundles || '[]'),
      
      // Pricing Information (reconstructed from individual fields)
      pricing: {
        basePrice: parseFloat(session.metadata.basePrice || '0'),
        addOnTotal: parseFloat(session.metadata.addOnTotal || '0'),
        subtotal: parseFloat(session.metadata.subtotal || '0'),
        totalDiscount: parseFloat(session.metadata.totalDiscount || '0'),
        gstAmount: parseFloat(session.metadata.gstAmount || '0'),
        total: parseFloat(session.metadata.finalTotal || '0'),
        appliedPromo: session.metadata.promoCode ? {
          code: session.metadata.promoCode,
          description: session.metadata.promoDescription,
          discountAmount: parseFloat(session.metadata.promoDiscount || '0')
        } : null
      },
      
      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('📦 COMPLETE ORDER DATA:');
    console.log('=====================================');
    console.log(JSON.stringify(orderData, null, 2));
    console.log('=====================================');
    
    console.log('✅ Order data captured successfully!');
    console.log('🎯 Backend developer: Use this data to save to your database/system');

  } catch (error) {
    console.error('❌ Error processing checkout session:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    console.log('💰 Payment succeeded:', paymentIntent.id);
    // Backend developer can add additional payment processing here if needed
  } catch (error) {
    console.error('❌ Error processing payment intent:', error);
    throw error;
  }
}
