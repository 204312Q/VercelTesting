'use client'

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckoutOrderCancelled } from 'src/sections/checkout/checkout-order-cancelled';

export default function CheckoutCancelPage() {
    const searchParams = useSearchParams();

    // Get order_id from URL parameters
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        // TODO: Implement database integration
        // const fetchOrder = async () => {
        //     if (!orderId) return;
        //     
        //     try {
        //         const response = await fetch(`/api/orders/${orderId}`);
        //         const order = await response.json();
        //         setOrderData(order);
        //     } catch (error) {
        //         console.error('Failed to fetch order:', error);
        //     }
        // };

        // fetchOrder();
    }, [orderId]);

    return (
        <CheckoutOrderCancelled
            open // ensures the Dialog is visible
        // TODO: Enable onTryAgain when database integration is ready
        // onTryAgain={orderData ? handleTryAgain : null}
        />
    );
}

// Force dynamic rendering to avoid serialization issues
export const dynamic = 'force-dynamic';