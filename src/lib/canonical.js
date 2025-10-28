// src/lib/canonical.js

// path -> desired key order
const ORDER = {
  '': ['order', 'version'], 
  'order': ['id','createdAt','inputType','serviceDate','portion','session','status','paymentPlan','lineItems','requests','note','payments','pricing','promotions','delivery','customer'],
  'order.payments[]': ['id','kind','purpose','method','status','amount','createdAt','paidAt','stripe'],
  'order.payments[].stripe': ['paymentIntentId','checkoutSessionId'],
  'order.pricing': ['currency','subtotal','paid','total','remaining','discounts','gstAmount'],
  'order.pricing.discounts[]': ['code','type','value','amount'],
  'order.promotions[]': ['code','type','value','amount'],
  'order.lineItems[]': ['id','productId','productName','kind','quantity','option','lineTotal','unitPrice'],
  'order.lineItems[].option': ['label','value'],
  'order.requests[]': ['id','code','label','value','specialRequestId'],
  'order.delivery': ['unit','email','floor','phone','fullName','postalCode','addressLine'],
  'order.customer': ['id','name','email','phone'],
};

export function canonicalize(obj, path = '') {
  if (Array.isArray(obj)) {
    const next = path + '[]';
    return obj.map((v) => canonicalize(v, next));
  }
  if (obj && typeof obj === 'object') {
    const desired = ORDER[path];
    const keys = Object.keys(obj);
    const ordered = desired ? [...desired, ...keys.filter((k) => !desired.includes(k))] : keys.sort();
    const out = {};
    for (const k of ordered) {
      if (k in obj) out[k] = canonicalize(obj[k], path ? `${path}.${k}` : k);
    }
    return out;
  }
  return obj;
}