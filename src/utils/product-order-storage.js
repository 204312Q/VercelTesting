/**
 * Utility functions for working with product order data in local storage
 */

const PRODUCT_ORDER_STORAGE_KEY = 'product-order';

/**
 * Get the saved order from local storage
 * @returns {Object|null} The saved order object or null if no order exists
 */
export function getSavedOrder() {
  try {
    if (typeof window === 'undefined') return null;
    
    const saved = localStorage.getItem(PRODUCT_ORDER_STORAGE_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    return data?.order || null;
  } catch (error) {
    console.error('Error getting saved order:', error);
    return null;
  }
}

/**
 * Get the order timestamp from local storage
 * @returns {string|null} The timestamp string or null if no order exists
 */
export function getOrderTimestamp() {
  try {
    if (typeof window === 'undefined') return null;
    
    const saved = localStorage.getItem(PRODUCT_ORDER_STORAGE_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    return data?.timestamp || null;
  } catch (error) {
    console.error('Error getting order timestamp:', error);
    return null;
  }
}

/**
 * Check if there's a saved order
 * @returns {boolean} True if there's a saved order, false otherwise
 */
export function hasSavedOrder() {
  return getSavedOrder() !== null;
}

/**
 * Clear the saved order from local storage
 */
export function clearSavedOrder() {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(PRODUCT_ORDER_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing saved order:', error);
  }
}

/**
 * Get order summary for display purposes
 * @returns {Object|null} Formatted order summary or null if no order exists
 */
export function getOrderSummary() {
  const order = getSavedOrder();
  if (!order) return null;

  return {
    category: order.category,
    productName: order.product?.name,
    total: order.pricing?.total,
    selectedDate: order.selectedDate,
    dateType: order.dateType,
    startWith: order.startWith,
    addOnsCount: order.addOns?.length || 0,
    hasSpecialRequests: !!order.specialRequests,
    timestamp: getOrderTimestamp()
  };
}

/**
 * Get applied promo code information
 * @returns {Object|null} Promo code details or null if none applied
 */
export function getAppliedPromoCode() {
  try {
    if (typeof window === 'undefined') return null;
    
    const saved = localStorage.getItem(PRODUCT_ORDER_STORAGE_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    return data?.order?.promoCode || null;
  } catch (error) {
    console.error('Error getting promo code:', error);
    return null;
  }
}

/**
 * Get selected bundle information
 * @returns {Object|null} Bundle details or null if none selected
 */
export function getSelectedBundle() {
  try {
    if (typeof window === 'undefined') return null;
    
    const saved = localStorage.getItem(PRODUCT_ORDER_STORAGE_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    return data?.metadata?.bundle || null;
  } catch (error) {
    console.error('Error getting bundle info:', error);
    return null;
  }
}

/**
 * Get order metadata
 * @returns {Object|null} Complete metadata or null if no order exists
 */
export function getOrderMetadata() {
  try {
    if (typeof window === 'undefined') return null;
    
    const saved = localStorage.getItem(PRODUCT_ORDER_STORAGE_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    return data?.metadata || null;
  } catch (error) {
    console.error('Error getting order metadata:', error);
    return null;
  }
}

/**
 * Check if a promo code was used
 * @returns {boolean} True if promo code was applied, false otherwise
 */
export function hasPromoCode() {
  const promoCode = getAppliedPromoCode();
  return promoCode !== null;
}

/**
 * Check if a bundle was selected
 * @returns {boolean} True if bundle was selected, false otherwise
 */
export function hasBundle() {
  const bundle = getSelectedBundle();
  return bundle !== null;
}
