import { NextResponse } from "next/server";
const stripe = require('stripe')(process.env.NEXT_STRIPE_SECRET_KEY);

export const POST = async (request) => {
  try {
    // Parse body - get the order details directly
    const { products, orderDetails, paymentType } = await request.json();

    // Create new session with provided data
    return await createNewSession(products, orderDetails, paymentType, request);

  } catch (error) {
    console.error("Error in /api/checkout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// Helper function to create a new session
async function createNewSession(products, orderDetails, paymentType, request) {
  // Check if this is a partial payment
  const isPartialPayment = paymentType === 'partial';
  const depositAmount = orderDetails?.deliveryInfo?.paymentAmounts?.depositAmount || 100;
  const totalAmount = orderDetails?.pricing?.total || 0;
  const balancePayable = orderDetails?.deliveryInfo?.paymentAmounts?.balancePayable || 0;

  // Calculate discount amount for full orders
  const discountAmount = orderDetails?.pricing?.totalDiscount ||
    orderDetails?.pricing?.promoDiscount ||
    (orderDetails?.pricing?.appliedPromo?.discountAmount) || 0;

  let stripeProducts = [];

  if (isPartialPayment) {
    // For partial payment, create a single line item for the deposit only
    stripeProducts.push({
      price_data: {
        currency: 'sgd',
        product_data: {
          name: `Deposit Payment - ${orderDetails?.category || 'Order'}`,
          description: `Deposit payment for order (Balance: $${balancePayable.toFixed(2)} to be paid later)`,
        },
        unit_amount: Math.round(depositAmount * 100), // Convert to cents
      },
      quantity: 1,
    });
  } else {
    // Full payment logic
    if (discountAmount > 0) {
      // Apply discount proportionally to each product using price_data
      const originalTotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const discountRatio = discountAmount / originalTotal;

      for (const product of products) {
        const productDiscount = product.price * discountRatio;
        const discountedPrice = Math.max(0, product.price - productDiscount);

        stripeProducts.push({
          price_data: {
            currency: 'sgd',
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(discountedPrice * 100), // Convert to cents
          },
          quantity: product.quantity,
        });
      }

      // Add a line item showing the discount applied
      if (orderDetails?.pricing?.appliedPromo) {
        const promoCode = orderDetails.pricing.appliedPromo.promoCode?.code ||
          orderDetails.pricing.appliedPromo.code ||
          'DISCOUNT';

        stripeProducts.push({
          price_data: {
            currency: 'sgd',
            product_data: {
              name: `${orderDetails.pricing.appliedPromo.description || 'Discount Applied'} (${promoCode})`,
              description: `Saved $${discountAmount.toFixed(2)}`,
            },
            unit_amount: 0, // $0 line item just to show the discount info
          },
          quantity: 1,
        });
      }
    } else {
      // No discount, use price_data for consistency
      for (const product of products) {
        stripeProducts.push({
          price_data: {
            currency: 'sgd',
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: product.quantity,
        });
      }
    }
  }

  // Create checkout session with metadata
  const origin = request.headers.get('origin') ||
    request.headers.get('host') && `https://${request.headers.get('host')}` ||
    'http://localhost:3032'; // fallback for development

  // Split order data into chunks of 450 characters (leaving room for safety)
  const orderDataString = JSON.stringify({ products, orderDetails, paymentType });
  const chunks = [];
  const chunkSize = 450;

  for (let i = 0; i < orderDataString.length; i += chunkSize) {
    chunks.push(orderDataString.slice(i, i + chunkSize));
  }

  // Build metadata object with split data
  const metadata = {
    paymentType: paymentType,
    customerEmail: orderDetails?.deliveryInfo?.email || '',
    totalAmount: totalAmount.toString(),
    orderData1: chunks[0] || '',
  };

  // Add additional chunks if needed
  if (chunks[1]) metadata.orderData2 = chunks[1];
  if (chunks[2]) metadata.orderData3 = chunks[2];
  // Stripe allows up to 50 metadata keys, so we can add more if needed

  const session = await stripe.checkout.sessions.create({
    line_items: stripeProducts,
    mode: 'payment',
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/product`,
    customer_email: orderDetails?.deliveryInfo?.email,
    metadata: metadata
  });

  return NextResponse.json({ url: session.url });
}