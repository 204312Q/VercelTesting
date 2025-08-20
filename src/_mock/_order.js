import { _mock } from './_mock';

// Helper function to generate proper dates
const generateDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const ORDER_STATUS_OPTIONS = [
  { value: 'unfulfilled', label: 'Unfulfilled' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: '', label: 'All Payments' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'partial', label: 'Partial' },
];

// Generate orders matching your ERD schema
export const _orders = Array.from({ length: 20 }, (_, index) => {
  const basePrice = 50 + (index * 25) + Math.random() * 200;
  const totalDiscount = index % 5 === 0 ? 50.00 : 0;
  const finalAmount = basePrice - totalDiscount;
  const amountPaid = index % 4 === 0 ? finalAmount * 0.5 : finalAmount;

  // Customer information
  const customer = {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
    phone: `+65 ${Math.floor(Math.random() * 90000000) + 10000000}`,
  };

  // Generate proper order date
  const orderDate = generateDate(index + 1);

  // Correct status options - only 3 values
  const statusOptions = ['unfulfilled', 'fulfilled', 'cancelled'];
  const orderStatus = statusOptions[index % statusOptions.length];

  // Updated payment status options with refund types
  const paymentStatusOptions = ['paid', 'Pending', 'Partial', 'Full Refund', 'Partial Refund'];
  const paymentStatus = paymentStatusOptions[index % paymentStatusOptions.length];

  // Payment methods
  const paymentMethods = ['credit_card', 'bank_transfer', 'cash', 'digital_wallet'];
  const paymentMethod = paymentMethods[index % paymentMethods.length];

  // START TYPE OPTIONS
  const startTypeOptions = ['Lunch', 'Dinner', 'E.D.D'];
  const startType = startTypeOptions[index % startTypeOptions.length];

  return {
    // Primary fields matching ERD
    order_id: `ORD${(1000 + index).toString()}`,
    customer_name: customer.name,
    email: customer.email,
    phone: customer.phone,
    total_amount: Math.round(basePrice * 100) / 100,
    total_discount_amount: Math.round(totalDiscount * 100) / 100,
    final_amount: Math.round(finalAmount * 100) / 100,
    order_status: orderStatus, // 'unfulfilled', 'fulfilled', 'cancelled'
    payment_method: paymentMethod,
    payment_status: paymentStatus, // 'paid', 'Pending', 'Partial', 'Full Refund', 'Partial Refund'
    amount_paid: Math.round(amountPaid * 100) / 100,
    order_date: orderDate,
    start_type: startType, // CHANGED FROM delivery_time TO start_type
    additional_remarks: index % 3 === 0 ? 'Special handling required' : null,
    shipping_address_id: index + 1,

    // Calculated fields
    balance_due: Math.round((finalAmount - amountPaid) * 100) / 100,
    items_count: Math.floor(Math.random() * 5) + 1,

    // UI compatibility fields
    customer: customer,
    orderNumber: `#${(60100 + index).toString()}`,
    created_at: orderDate,

    // Mock order items
    items: [
      {
        id: `item_${index}_1`,
        name: _mock.productName(index),
        sku: `SKU${index.toString().padStart(3, '0')}`,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.round((basePrice / 2) * 100) / 100,
        coverUrl: _mock.image.product(index),
      }
    ],

    // Shipping address
    shippingAddress: {
      fullAddress: '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      phoneNumber: customer.phone,
    },
  };
});