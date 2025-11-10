import { _mock } from './_mock';
import { PRODUCT } from './_cpproduct';

const generateDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10); // YYYY-MM-DD format
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

const PRESET_REQUESTS = [
  'No Pork Innards',
  'No Pig Trotter',
  'No Chicken/Fish',
  'No Chicken & Egg for first 1 or 2 weeks',
  'No Papaya Fish Soup',
  'No Salmon',
  'All White Rice',
  'All Brown Rice',
  'No Snow/Sweet Peas',
  'No Sugar in Red Dates Tea',
  'No Weekend Deliveries',
];

export const _orders = Array.from({ length: 20 }, (_, index) => {
  // Select a random package
  const packages = PRODUCT.filter(p => p.type === 'package');
  const packageItem = packages[Math.floor(Math.random() * packages.length)];

  // Optionally add a bundle
  const bundles = PRODUCT.filter(p => p.type === 'bundle');
  const bundleItem = Math.random() > 0.5 ? bundles[Math.floor(Math.random() * bundles.length)] : null;

  // Optionally add add-ons
  const addOns = PRODUCT.filter(p => p.type === 'addOn');
  const addonCount = Math.floor(Math.random() * 3); // 0-2 add-ons
  const addonItems = [];
  for (let i = 0; i < addonCount; i++) {
    addonItems.push(addOns[Math.floor(Math.random() * addOns.length)]);
  }

  // Build items array using actual products
  const items = [
    {
      id: `order_${index}_package`,
      name: packageItem.name,
      sku: `PKG${packageItem.product_id}`,
      quantity: 1,
      price: packageItem.price,
      coverUrl: packageItem.image,
    },
    ...(bundleItem
      ? [{
        id: `order_${index}_bundle`,
        name: bundleItem.name,
        sku: `BND${bundleItem.product_id}`,
        quantity: 1,
        price: bundleItem.price,
        coverUrl: bundleItem.image,
      }]
      : []),
    ...addonItems.map((addon, i) => ({
      id: `order_${index}_addon_${i}`,
      name: addon.name,
      sku: `ADDON${addon.product_id}`,
      quantity: 1,
      price: addon.price,
      coverUrl: addon.image,
    })),
  ];

  // Calculate subtotal from items
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Discount logic
  const totalDiscount = index % 5 === 0 ? 50.00 : 0;

  // Final amount (grand total, taxes already included)
  const finalAmount = subtotal - totalDiscount;

  // Taxes (GST 9% on subtotal minus discount) - for display only
  const taxableAmount = subtotal - totalDiscount;
  const taxes = taxableAmount > 0 ? Math.round(taxableAmount * 0.09 * 100) / 100 : 0;

  // Amount paid logic
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

  // Alternate start_type: even index is E.D.D, odd index alternates Lunch/Dinner
  const startTypeOptions = ['Lunch', 'Dinner'];
  const isEDD = index % 2 === 0;
  const startType = isEDD ? 'E.D.D' : startTypeOptions[(Math.floor(index / 2)) % startTypeOptions.length];
  const edd_date = isEDD ? generateDate(index + 5) : null;

  // Special requests (preset + custom)
  const special_requests = PRESET_REQUESTS.filter((_, i) => (index + i) % 4 === 0);
  const special_request_notes =
    index % 4 === 0
      ? 'Please deliver before noon. No ginger in any dish.'
      : index % 4 === 1
        ? 'Leave at doorstep if not home.'
        : index % 4 === 2
          ? 'Contact me before delivery.'
          : '';

  // Add-ons array for UI
  const addons = addonItems.map(addon => addon.name);

  return {
    order_id: `ORD${(1000 + index).toString()}`,
    customer_name: customer.name,
    email: customer.email,
    phone: customer.phone,
    total_amount: subtotal,
    total_discount_amount: totalDiscount,
    taxes,
    final_amount: finalAmount,
    order_status: orderStatus,
    payment_method: paymentMethod,
    payment_status: paymentStatus,
    amount_paid: Math.round(amountPaid * 100) / 100,
    order_date: orderDate,
    start_type: startType,
    start_date: isEDD ? null : orderDate,
    edd_date,
    additional_remarks: index % 3 === 0 ? 'Special handling required' : null,
    shipping_address_id: index + 1,
    balance_due: Math.round((finalAmount - amountPaid) * 100) / 100,
    items_count: items.length,
    customer: customer,
    orderNumber: `#${(60100 + index).toString()}`,
    created_at: orderDate,
    items,
    shippingAddress: {
      fullAddress: '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      phoneNumber: customer.phone,
    },
    special_requests,
    special_request_notes,
    addons,
  };
});