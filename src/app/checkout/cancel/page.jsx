'use client'

// import { useEffect } from 'react';
// import { useCheckoutContext } from 'src/sections/checkout/context';
import { CheckoutOrderCancelled } from 'src/sections/checkout/checkout-order-cancelled';

export default function CheckoutCancelPage() {
    // const { onResetCart } = useCheckoutContext();

    // useEffect(() => {
    //     // Clean up cart when user lands on cancel page
    //     if (onResetCart) {
    //         onResetCart();
    //     }
    // }, [onResetCart]);

    return (
        <CheckoutOrderCancelled
            open // ensures the Dialog is visible
        />
    );
}

// Force dynamic rendering to avoid serialization issues
export const dynamic = 'force-dynamic';