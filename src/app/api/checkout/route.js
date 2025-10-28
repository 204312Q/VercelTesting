import { NextResponse } from "next/server";
const stripe = require('stripe')(process.env.NEXT_STRIPE_SECRET_KEY);

export const POST = async (request) => {
  try {
    // 1. Parse body - now includes full order details
    const { products, orderDetails, paymentType } = await request.json();

    // 2. Check if this is a partial payment
    const isPartialPayment = paymentType === 'partial';
    const depositAmount = orderDetails?.deliveryInfo?.paymentAmounts?.depositAmount || 100;
    const totalAmount = orderDetails?.pricing?.total || 0;
    const balancePayable = orderDetails?.deliveryInfo?.paymentAmounts?.balancePayable || 0;

    // 3. Calculate discount amount for full orders
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
      // Full payment logic (your existing code)
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

    // 4. Create checkout session with COMPLETE order metadata
    const origin = request.headers.get('origin') || 
                   request.headers.get('host') && `https://${request.headers.get('host')}` ||
                   'http://localhost:3032'; // fallback for development
    
    const session = await stripe.checkout.sessions.create({
      line_items: stripeProducts,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      // Store COMPLETE order details regardless of payment type
      metadata: {
        orderId: `order_${Date.now()}`,
        paymentType: isPartialPayment ? 'partial' : 'full',
        
        // Payment information
        depositPaid: isPartialPayment ? depositAmount.toString() : '0',
        balanceRemaining: isPartialPayment ? balancePayable.toString() : '0',
        orderTotal: totalAmount.toString(),
        
        // Customer information
        customerName: orderDetails?.deliveryInfo?.fullName || '',
        customerEmail: orderDetails?.deliveryInfo?.email || '',
        customerPhone: orderDetails?.deliveryInfo?.phone || '',
        
        // Delivery information
        deliveryAddress: JSON.stringify({
          address: orderDetails?.deliveryInfo?.address || '',
          floor: orderDetails?.deliveryInfo?.floor || '',
          unit: orderDetails?.deliveryInfo?.unit || '',
          postalCode: orderDetails?.deliveryInfo?.postalCode || '',
        }),
        deliveryDate: orderDetails?.selectedDate || '',
        startWith: orderDetails?.startWith || '',
        specialRequests: orderDetails?.specialRequests || '',
        
        // COMPLETE product information (stored regardless of payment type)
        selectedBundles: JSON.stringify(orderDetails?.selectedBundles || []),
        products: JSON.stringify(products || []),
        addOns: JSON.stringify(orderDetails?.addOns || []),
        
        // COMPLETE pricing breakdown (stored regardless of payment type)
        basePrice: orderDetails?.pricing?.basePrice?.toString() || '0',
        bundlePrice: orderDetails?.pricing?.bundlePrice?.toString() || '0',
        addOnTotal: orderDetails?.pricing?.addOnTotal?.toString() || '0',
        subtotal: orderDetails?.pricing?.subtotal?.toString() || '0',
        totalDiscount: orderDetails?.pricing?.totalDiscount?.toString() || '0',
        gstAmount: orderDetails?.pricing?.gstAmount?.toString() || '0',
        finalTotal: orderDetails?.pricing?.total?.toString() || '0',
        
        // Promo information
        promoCode: orderDetails?.pricing?.appliedPromo?.promoCode?.code || '',
        promoDescription: orderDetails?.pricing?.appliedPromo?.description || '',
        promoDiscount: orderDetails?.pricing?.appliedPromo?.discountAmount?.toString() || '0',
        
        // Order configuration
        category: orderDetails?.category || '',
        dateType: orderDetails?.dateType || '',
      },
      customer_email: orderDetails?.deliveryInfo?.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error in /api/checkout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};