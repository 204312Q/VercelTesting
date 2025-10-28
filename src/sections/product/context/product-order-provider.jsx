'use client';

import { useLocalStorage } from 'minimal-shared/hooks';
import { useMemo, useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';

import { ProductOrderContext } from './product-order-context';

// ----------------------------------------------------------------------

const PRODUCT_ORDER_STORAGE_KEY = 'product-order';

const initialState = {
    order: null,
    timestamp: null,
};

// ----------------------------------------------------------------------

export function ProductOrderProvider({ children }) {
    const router = useRouter();

    const { state, setState, setField, resetState } = useLocalStorage(
        PRODUCT_ORDER_STORAGE_KEY,
        initialState,
        { initializeWithValue: false }
    );

    // Save order to local storage and redirect to home
    const onProceedToOrder = useCallback((finalOrder) => {
        try {
            // Validate delivery date
            if (!finalOrder.selectedDate) {
                alert('Please select a delivery date before proceeding with your order.');
                return;
            }

            // Validate delivery information
            if (!finalOrder.deliveryInfo) {
                alert('Please complete the delivery information before proceeding with your order.');
                return;
            }

            const { fullName, phone, email, address, postalCode } = finalOrder.deliveryInfo;
            if (!fullName?.trim() || !phone?.trim() || !email?.trim() || !address?.trim() || !postalCode?.trim()) {
                alert('Please fill in all required delivery fields before proceeding with your order.');
                return;
            }

            // Extract promo code information
            const promoCodeInfo = finalOrder.pricing?.appliedPromo ||
                finalOrder.appliedPromo ||
                (finalOrder.pricing?.promoDiscount > 0 ? { discountAmount: finalOrder.pricing.promoDiscount } : null);

            // Extract bundle information
            let bundleInfo = null;

            // Check for selectedBundles (main source of bundle data)
            if (finalOrder.selectedBundles?.length > 0) {
                bundleInfo = finalOrder.selectedBundles.map(bundle => ({
                    product_id: bundle.product_id,
                    name: bundle.name,
                    price: bundle.price || 0,
                    type: bundle.type || 'bundle'
                }));
            }

            // Add promo code and bundle directly to the order object
            const enhancedOrder = {
                ...finalOrder,
                // Remove selectedBundles to avoid duplication
                selectedBundles: undefined,
                promoCode: promoCodeInfo ? {
                    code: promoCodeInfo.promoCode?.code || promoCodeInfo.code || "Unknown",
                    discountAmount: promoCodeInfo.discountAmount || finalOrder.pricing?.promoDiscount || 0,
                    description: promoCodeInfo.description || `Discount applied: $${promoCodeInfo.discountAmount || finalOrder.pricing?.promoDiscount || 0}`
                } : null,
                bundle: bundleInfo,
                // Include delivery information
                deliveryInfo: finalOrder.deliveryInfo ? {
                    fullName: finalOrder.deliveryInfo.fullName,
                    phone: finalOrder.deliveryInfo.phone,
                    email: finalOrder.deliveryInfo.email,
                    address: finalOrder.deliveryInfo.address,
                    floor: finalOrder.deliveryInfo.floor,
                    unit: finalOrder.deliveryInfo.unit,
                    postalCode: finalOrder.deliveryInfo.postalCode
                } : null,
                // Include payment information
                paymentInfo: finalOrder.deliveryInfo ? {
                    paymentMethod: finalOrder.deliveryInfo.paymentMethod || 'full'
                } : null
            };

            // Save the complete order data to local storage
            const orderData = {
                order: enhancedOrder,
                timestamp: new Date().toISOString(),
            };

            setState(orderData);

            // Only redirect on client side to avoid SSR issues
            if (typeof window !== 'undefined') {
                router.push('');
            }

        } catch (error) {
            console.error('Error saving order to local storage:', error);
        }
    }, [setState, router]);

    // Get current order from local storage
    const getCurrentOrder = useCallback(() => {
        return state.order;
    }, [state.order]);

    // Get order timestamp
    const getOrderTimestamp = useCallback(() => {
        return state.timestamp;
    }, [state.timestamp]);

    // Check if there's a saved order
    const hasSavedOrder = useCallback(() => {
        return !!state.order;
    }, [state.order]);

    // Get applied promo code information
    const getAppliedPromoCode = useCallback(() => {
        return state.order?.promoCode || null;
    }, [state.order]);

    // Get selected bundle information
    const getSelectedBundle = useCallback(() => {
        return state.order?.bundle || null;
    }, [state.order]);

    // Check if promo code was used
    const hasPromoCode = useCallback(() => {
        return !!state.order?.promoCode;
    }, [state.order]);

    // Check if bundle was selected
    const hasBundle = useCallback(() => {
        return !!state.order?.bundle;
    }, [state.order]);

    // Clear saved order
    const clearOrder = useCallback(() => {
        resetState(initialState);
    }, [resetState]);

    // Update order (useful for partial updates)
    const updateOrder = useCallback((orderUpdates) => {
        if (state.order) {
            const updatedOrder = {
                ...state.order,
                ...orderUpdates,
            };

            const orderData = {
                order: updatedOrder,
                timestamp: new Date().toISOString(),
            };

            setState(orderData);
        }
    }, [state.order, setState]);

    const memoizedValue = useMemo(
        () => ({
            // State
            currentOrder: state.order,
            orderTimestamp: state.timestamp,
            hasSavedOrder: hasSavedOrder(),

            // Quick access to specific data
            appliedPromoCode: getAppliedPromoCode(),
            selectedBundle: getSelectedBundle(),
            hasPromoCode: hasPromoCode(),
            hasBundle: hasBundle(),

            // Actions
            onProceedToOrder,
            getCurrentOrder,
            getOrderTimestamp,
            getAppliedPromoCode,
            getSelectedBundle,
            clearOrder,
            updateOrder,
        }),
        [
            state.order,
            state.timestamp,
            hasSavedOrder,
            getAppliedPromoCode,
            getSelectedBundle,
            hasPromoCode,
            hasBundle,
            onProceedToOrder,
            getCurrentOrder,
            getOrderTimestamp,
            clearOrder,
            updateOrder,
        ]
    );

    return (
        <ProductOrderContext.Provider value={memoizedValue}>
            {children}
        </ProductOrderContext.Provider>
    );
}
