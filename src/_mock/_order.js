import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'unfulfilled', label: 'Unfulfilled' },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'partial', label: 'Partial' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'pending', label: 'Pending' },
];

export const ORDER_TYPES = [
  { value: 'confinement', label: 'Confinement' },
  { value: 'regular', label: 'Regular' },
];

// Confinement-specific items
const CONFINEMENT_ITEMS = [
  {
    id: 'conf_001',
    sku: 'CONF001',
    name: 'Traditional Confinement Package - Premium',
    category: 'confinement',
    type: 'bundle',
    coverUrl: _mock.image.product(0),
    basePrice: 2800.00,
    description: '28-day premium confinement meal package',
  },
  {
    id: 'conf_002', 
    sku: 'CONF002',
    name: 'Herbal Soup Add-on',
    category: 'confinement',
    type: 'addon',
    coverUrl: _mock.image.product(1),
    basePrice: 380.00,
    description: 'Traditional herbal soups for recovery',
  },
  {
    id: 'conf_003',
    sku: 'CONF003', 
    name: 'Red Date Tea (14 days)',
    category: 'confinement',
    type: 'addon',
    coverUrl: _mock.image.product(2),
    basePrice: 120.00,
    description: 'Nourishing red date tea for new mothers',
  },
];

export const _orders = Array.from({ length: 20 }, (_, index) => {
  const isConfinementOrder = index % 3 === 0;
  const isPartialPayment = isConfinementOrder && index % 2 === 0;
  
  // Base pricing
  const basePrice = isConfinementOrder ? 2800.00 : _mock.number.price(index);
  const bundlePrice = isConfinementOrder ? 2800.00 : 0;
  const addOnTotal = isConfinementOrder ? (index % 2 ? 500.00 : 0) : 0;
  const subtotal = basePrice + addOnTotal;
  
  // Discounts and taxes
  const promoDiscount = index % 4 === 0 ? 200.00 : 0;
  const totalDiscount = promoDiscount;
  const gstAmount = (subtotal - totalDiscount) * 0.08; // 8% GST
  const finalTotal = subtotal - totalDiscount + gstAmount;
  
  // Payment amounts for partial payments
  const depositAmount = isPartialPayment ? 1000.00 : finalTotal;
  const balanceRemaining = isPartialPayment ? finalTotal - depositAmount : 0;
  
  // Items based on order type
  const items = isConfinementOrder 
    ? [
        {
          ...CONFINEMENT_ITEMS[0],
          quantity: 1,
          price: CONFINEMENT_ITEMS[0].basePrice,
        },
        ...(index % 2 ? [{
          ...CONFINEMENT_ITEMS[1],
          quantity: 1, 
          price: CONFINEMENT_ITEMS[1].basePrice,
        }] : [])
      ]
    : [{
        id: _mock.id(index),
        sku: `REG${index.toString().padStart(3, '0')}`,
        name: _mock.productName(index),
        category: 'regular',
        type: 'product',
        coverUrl: _mock.image.product(index),
        price: basePrice,
        quantity: 1,
      }];

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const customer = {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
    phone: `+65 ${Math.floor(Math.random() * 90000000) + 10000000}`,
  };

  // Delivery information for confinement orders
  const deliveryInfo = isConfinementOrder ? {
    fullName: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: `Blk ${Math.floor(Math.random() * 999) + 1} Example Street`,
    floor: `#${Math.floor(Math.random() * 20) + 1}`,
    unit: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 20) + 1}`,
    postalCode: `${Math.floor(Math.random() * 900000) + 100000}`,
    paymentAmounts: {
      depositAmount,
      balancePayable: balanceRemaining,
    },
  } : null;

  // Order history/timeline
  const history = {
    orderTime: _mock.time(1),
    paymentTime: isPartialPayment ? _mock.time(2) : _mock.time(2),
    deliveryTime: _mock.time(3),
    completionTime: _mock.time(4),
    timeline: [
      ...(isPartialPayment && balanceRemaining > 0 ? [
        { title: 'Balance payment pending', time: _mock.time(0), status: 'pending' }
      ] : []),
      { title: isPartialPayment ? 'Deposit payment received' : 'Payment completed', time: _mock.time(1), status: 'completed' },
      { title: 'Order confirmed', time: _mock.time(2), status: 'completed' },
      { title: 'Preparing for delivery', time: _mock.time(3), status: 'in-progress' },
      { title: 'Order created', time: _mock.time(4), status: 'completed' },
    ],
  };

  // Determine statuses
  const paymentStatus = isPartialPayment ? 'partial' : 
                       (index % 4 === 3 ? 'refunded' : 'paid');
  
  const orderStatus = 
    (index % 2 && 'fulfilled') ||
    (index % 3 && 'unfulfilled') ||
    (index % 4 && 'cancelled') ||
    'pending';

  return {
    id: _mock.id(index),
    orderNumber: `#${(60100 + index).toString()}`,
    orderId: `order_${Date.now()}_${index}`,
    createdAt: _mock.time(index),
    
    // Order classification
    category: isConfinementOrder ? 'confinement' : 'regular',
    orderType: isConfinementOrder ? 'confinement' : 'regular',
    
    // Payment information
    paymentType: isPartialPayment ? 'partial' : 'full',
    paymentStatus,
    depositPaid: depositAmount,
    balanceRemaining,
    
    // Pricing breakdown
    pricing: {
      basePrice,
      bundlePrice,
      addOnTotal,
      subtotal,
      totalDiscount,
      promoDiscount,
      gstAmount,
      total: finalTotal,
      appliedPromo: promoDiscount > 0 ? {
        code: 'WELCOME200',
        description: 'New Customer Discount',
        discountAmount: promoDiscount,
      } : null,
    },
    
    // Items and delivery
    items,
    totalQuantity,
    deliveryInfo,
    
    // Delivery scheduling (for confinement)
    selectedDate: isConfinementOrder ? _mock.time(index + 5) : null,
    startWith: isConfinementOrder ? (index % 2 ? 'lunch' : 'dinner') : null,
    specialRequests: isConfinementOrder ? 'No pork, extra vegetables' : '',
    
    // Customer and shipping
    customer,
    shippingAddress: {
      fullAddress: deliveryInfo ? 
        `${deliveryInfo.address}, ${deliveryInfo.floor}-${deliveryInfo.unit}, Singapore ${deliveryInfo.postalCode}` :
        '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      phoneNumber: customer.phone,
    },
    
    // Payment method
    payment: { 
      cardType: 'visa', 
      cardNumber: '**** **** **** 1234',
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    
    // Status and tracking
    status: orderStatus,
    history,
    
    // Additional metadata
    metadata: {
      source: 'website',
      userAgent: 'Mozilla/5.0...',
      ipAddress: '192.168.1.100',
    },
  };
});

// Helper functions for filtering
export const getConfinementOrders = () => _orders.filter(order => order.category === 'confinement');
export const getPartialPaymentOrders = () => _orders.filter(order => order.paymentType === 'partial');
export const getPendingBalanceOrders = () => _orders.filter(order => order.balanceRemaining > 0);