'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { validatePromoCode } from 'src/utils/product-promotion';

export function ProductOrderSummary({
    selectedCategory,
    orderData,
    selectedAddOns = [],
    specialRequests = '',
    deliveryData = {},
    isDeliveryValid = false,
    onPricingChange,
}) {
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');

    // Memoize expensive calculations
    const pricingData = useMemo(() => {
        const basePrice = orderData?.selectedProduct?.price || 0;
        const bundlePrice = orderData?.bundlePrice || 0;
        const addOnTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
        const packagePrice = basePrice;
        const subtotal = packagePrice + bundlePrice + addOnTotal;

        const bundleDiscount = orderData?.bundleWithMassage ? 0 : 0;
        const promoDiscount = appliedPromo?.discountAmount || 0;
        const totalDiscount = bundleDiscount + promoDiscount;
        const subtotalAfterDiscount = subtotal - totalDiscount;

        // GST is 9% inclusive - calculate GST amount from the final total
        const gstAmount = subtotalAfterDiscount * 9 / 109;
        const total = Math.max(0, subtotalAfterDiscount);

        return {
            basePrice,
            bundlePrice,
            addOnTotal,
            packagePrice,
            subtotal,
            bundleDiscount,
            promoDiscount,
            totalDiscount,
            gstAmount,
            total
        };
    }, [orderData, selectedAddOns, appliedPromo]);

    // Notify parent component of pricing changes
    useEffect(() => {
        if (onPricingChange) {
            onPricingChange(pricingData);
        }
    }, [pricingData, onPricingChange]);

    // Memoize final order object
    const finalOrder = useMemo(() => ({
        category: selectedCategory?.name,
        product: orderData?.selectedProduct,
        addOns: selectedAddOns,
        selectedBundles: orderData?.selectedBundles || [],
        specialRequests: specialRequests,
        dateType: orderData?.dateType,
        selectedDate: orderData?.selectedDate,
        startWith: orderData?.startWith,
        deliveryInfo: deliveryData,
        pricing: {
            ...pricingData,
            appliedPromo: appliedPromo
        }
    }), [selectedCategory, orderData, selectedAddOns, specialRequests, deliveryData, pricingData, appliedPromo]);

    // Validation for form completion
    const isFormValid = useMemo(() => {
        const hasPackage = !!orderData?.selectedProduct;
        const hasDate = !!orderData?.selectedDate;
        return hasPackage && hasDate && isDeliveryValid;
    }, [orderData?.selectedProduct, orderData?.selectedDate, isDeliveryValid]);

    // Event handlers
    const handlePromoCodeChange = useCallback((e) => {
        setPromoCode(e.target.value.toUpperCase());
        setPromoError('');
    }, []);

    const handleApplyPromoCode = useCallback(() => {
        if (!promoCode.trim()) {
            setPromoError('Please enter a promo code');
            return;
        }

        const validation = validatePromoCode(promoCode, orderData, selectedAddOns);

        if (validation.valid) {
            setAppliedPromo(validation);
            setPromoError('');
        } else {
            setAppliedPromo(null);
            setPromoError(validation.error);
        }
    }, [promoCode, orderData, selectedAddOns]);

    const handleRemovePromoCode = useCallback(() => {
        setAppliedPromo(null);
        setPromoCode('');
        setPromoError('');
    }, []);

    const handleProceedClick = useCallback(async () => {
        if (!isFormValid) {
            console.log('Form is not valid, cannot proceed');
            return;
        }

        setIsProcessingCheckout(true);
        setCheckoutError('');

        try {
            // Determine the amount to charge based on payment method
            const amountToCharge = deliveryData?.paymentMethod === 'partial'
                ? deliveryData.paymentAmounts?.depositAmount || 100
                : pricingData.total;

            // Prepare products for Stripe
            const stripeProducts = [];

            if (deliveryData?.paymentMethod === 'partial') {
                stripeProducts.push({
                    name: `Deposit Payment - ${finalOrder.category}`,
                    price: amountToCharge,
                    quantity: 1,
                });
            } else {
                if (finalOrder.product) {
                    stripeProducts.push({
                        name: `${finalOrder.product.duration} Days - ${finalOrder.category}`,
                        price: finalOrder.product.price,
                        quantity: 1,
                    });
                }

                if (finalOrder.selectedBundles?.length > 0) {
                    finalOrder.selectedBundles.forEach(bundle => {
                        stripeProducts.push({
                            name: bundle.name,
                            price: bundle.price,
                            quantity: 1,
                        });
                    });
                }

                if (finalOrder.addOns?.length > 0) {
                    finalOrder.addOns.forEach(addon => {
                        stripeProducts.push({
                            name: addon.name,
                            price: addon.price,
                            quantity: 1,
                        });
                    });
                }
            }

            // Call Stripe checkout API
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: stripeProducts,
                    orderDetails: finalOrder,
                    paymentType: deliveryData?.paymentMethod || 'full',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { url, error } = await response.json();

            if (error) {
                throw new Error(error);
            }

            if (url) {
                setTimeout(() => {
                    window.location.href = url;
                }, 500);
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error) {
            console.error('Error proceeding to checkout:', error);
            setCheckoutError(error.message || 'Failed to proceed to checkout. Please try again.');
            setIsProcessingCheckout(false);
        }
    }, [finalOrder, isFormValid, deliveryData, pricingData]);

    // Memoized sections
    const packageSection = useMemo(() => {
        if (!selectedCategory) return null;

        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                    Package Selected:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedCategory.name}
                </Typography>

                {orderData?.selectedProduct && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {orderData.selectedProduct.duration} Days • {orderData.selectedProduct.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${orderData.selectedProduct.price}
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    }, [selectedCategory, orderData?.selectedProduct]);

    const bundleSection = useMemo(() => {
        if (!orderData?.selectedBundles?.length) return null;

        return (
            <Box sx={{ mt: 1, p: 1, backgroundColor: '#FFF5F7', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ color: '#F27C96', fontWeight: 'bold', mb: 0.5 }}>
                    Bundle Selected:
                </Typography>
                {orderData.selectedBundles.map((bundle) => (
                    <Chip
                        key={bundle.product_id}
                        label={`${bundle.name} +$${bundle.price}`}
                        size="small"
                        sx={{
                            backgroundColor: '#F27C96',
                            color: 'white',
                            mr: 0.5,
                            mb: 0.5
                        }}
                    />
                ))}
            </Box>
        );
    }, [orderData?.selectedBundles]);

    const addOnsSection = useMemo(() => {
        if (!selectedAddOns.length) return null;

        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Add-Ons ({selectedAddOns.length}):
                </Typography>
                {selectedAddOns.map((addOn) => (
                    <Box key={addOn.product_id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {addOn.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${addOn.price}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    }, [selectedAddOns]);

    const specialRequestsSection = useMemo(() => {
        if (!specialRequests) return null;

        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Special Requests:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                    fontStyle: 'italic',
                    backgroundColor: 'grey.50',
                    p: 1,
                    borderRadius: 1,
                    fontSize: '0.875rem'
                }}>
                    "{specialRequests}"
                </Typography>
            </Box>
        );
    }, [specialRequests]);

    const orderDetailsSection = useMemo(() => {
        if (!orderData) return null;

        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Order Details:
                </Typography>

                {orderData.selectedDate && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        <strong>{orderData.dateType === 'confirmed' ? 'Start Date:' : 'E.D.D:'}</strong> {orderData.selectedDate}
                    </Typography>
                )}

                {orderData.startWith && orderData.dateType === 'confirmed' && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        <strong>Start with:</strong> {orderData.startWith.charAt(0).toUpperCase() + orderData.startWith.slice(1)}
                    </Typography>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <strong>Includes:</strong> Longan Tea with Red Dates
                </Typography>

                {bundleSection}
            </Box>
        );
    }, [orderData, bundleSection]);

    const pricingBreakdownSection = useMemo(() => (
        <Box sx={{ mb: 3 }}>
            {pricingData.packagePrice > 0 && (
                <PricingRow label="Package" amount={pricingData.packagePrice} />
            )}

            {pricingData.bundlePrice > 0 && (
                <PricingRow label="Bundle" amount={pricingData.bundlePrice} />
            )}

            {pricingData.addOnTotal > 0 && (
                <PricingRow label="Add-Ons" amount={pricingData.addOnTotal} />
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pt: 1, borderTop: 1, borderColor: 'grey.300' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Subtotal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>${pricingData.subtotal}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Discount</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {pricingData.promoDiscount > 0 ? `-$${pricingData.promoDiscount}` : '$--'}
                </Typography>
            </Box>

            <PromoCodeSection
                appliedPromo={appliedPromo}
                promoCode={promoCode}
                promoError={promoError}
                onPromoCodeChange={handlePromoCodeChange}
                onApplyPromoCode={handleApplyPromoCode}
                onRemovePromoCode={handleRemovePromoCode}
            />

            {pricingData.bundleDiscount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Bundle Discount</Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                        -${pricingData.bundleDiscount}
                    </Typography>
                </Box>
            )}

            {pricingData.gstAmount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">GST (9% inclusive)</Typography>
                    <Typography variant="body2" color="text.secondary">
                        ${pricingData.gstAmount.toFixed(2)}
                    </Typography>
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 1, borderTop: 1, borderColor: 'grey.300' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Grand Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    $ {pricingData.total.toFixed(2)}
                </Typography>
            </Box>

            {/* Payment Breakdown */}
            {deliveryData?.paymentMethod === 'partial' && deliveryData?.paymentAmounts && (
                <PaymentBreakdownSection paymentAmounts={deliveryData.paymentAmounts} />
            )}
        </Box>
    ), [
        pricingData,
        appliedPromo,
        promoCode,
        promoError,
        handlePromoCodeChange,
        handleApplyPromoCode,
        handleRemovePromoCode,
        deliveryData?.paymentMethod,
        deliveryData?.paymentAmounts
    ]);

    return (
        <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Order Summary
                </Typography>

                {packageSection}
                {orderDetailsSection}
                {addOnsSection}
                {specialRequestsSection}

                <Divider sx={{ my: 2 }} />

                {pricingBreakdownSection}

                {checkoutError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {checkoutError}
                    </Alert>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                    disabled={!isFormValid || isProcessingCheckout}
                    onClick={handleProceedClick}
                    startIcon={isProcessingCheckout ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isProcessingCheckout ? 'Proceeding for Payment...' : 'Proceed to Order'}
                </Button>

                {!isFormValid && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                        {!orderData?.selectedProduct && 'Please select a package'}
                        {orderData?.selectedProduct && !orderData?.selectedDate && 'Please select a delivery date'}
                        {orderData?.selectedProduct && orderData?.selectedDate && !isDeliveryValid && 'Please complete the delivery information'}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

// Helper components for better organization and reusability
const PricingRow = ({ label, amount }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">${amount}</Typography>
    </Box>
);

const PaymentBreakdownSection = ({ paymentAmounts }) => (
    <Box sx={{
        mt: 2,
        pt: 2,
        borderTop: '2px solid #F27C96',
        backgroundColor: '#FFF5F7',
        borderRadius: 1,
        p: 2
    }}>
        <Typography variant="subtitle2" sx={{
            fontWeight: 600,
            color: '#F27C96',
            mb: 1
        }}>
            Payment Breakdown
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Required Deposit (Payment)
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                $ {paymentAmounts.depositAmount.toFixed(2)}
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Balance Payable
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                $ {paymentAmounts.balancePayable.toFixed(2)}
            </Typography>
        </Box>
    </Box>
);

const PromoCodeSection = ({
    appliedPromo,
    promoCode,
    promoError,
    onPromoCodeChange,
    onApplyPromoCode,
    onRemovePromoCode
}) => (
    <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        {!appliedPromo ? (
            <>
                <TextField
                    placeholder="DISCOUNT5"
                    size="small"
                    value={promoCode}
                    onChange={onPromoCodeChange}
                    fullWidth
                    error={!!promoError}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{
                                        color: 'success.main',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        minWidth: 'auto',
                                        px: 1
                                    }}
                                    onClick={onApplyPromoCode}
                                >
                                    Apply
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& fieldset': {
                                borderColor: 'grey.300',
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                />
                {promoError && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {promoError}
                    </Typography>
                )}
            </>
        ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {appliedPromo.promoCode.code} Applied!
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {appliedPromo.description} (-${appliedPromo.discountAmount})
                    </Typography>
                </Box>
                <Button
                    size="small"
                    color="error"
                    onClick={onRemovePromoCode}
                    sx={{ textTransform: 'none' }}
                >
                    Remove
                </Button>
            </Box>
        )}
    </Box>
);