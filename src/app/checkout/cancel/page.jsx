'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckoutOrderCancelled } from 'src/sections/checkout/checkout-order-cancelled';

export default function CheckoutCancelPage() {
    const [orderData, setOrderData] = useState(null);
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

    const handleTryAgain = async () => {
        if (!orderData) return;

        try {
            // TODO: Implement retry checkout with order data
            // Re-create the checkout session using the order data
            // const response = await fetch('/api/stripe/checkout', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         orderId: orderData.id, // Use the order ID
            //         // Or reconstruct the order data
            //         products: orderData.products,
            //         orderDetails: orderData.orderDetails,
            //         paymentType: orderData.paymentType
            //     }),
            // });

            // const data = await response.json();
            // if (data.url) {
            //     window.location.href = data.url;
            // }
        } catch (error) {
            console.error('Retry checkout error:', error);
        }
    };

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