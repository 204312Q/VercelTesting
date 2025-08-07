'use client';

import { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { validatePromoCode } from 'src/utils/product-promotion';

export function ProductOrderSummary({
    selectedCategory,
    orderData,
    selectedAddOns = [],
    specialRequests = '',
    deliveryData = {},
    isDeliveryValid = false,
    onProceedToOrder
}) {
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');

    // Memoize expensive calculations
    const pricingData = useMemo(() => {
        const basePrice = orderData?.selectedProduct?.price || 0;
        const bundlePrice = orderData?.bundlePrice || 0;
        const addOnTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
        const packagePrice = basePrice; // Always use base price for package
        const subtotal = packagePrice + bundlePrice + addOnTotal; // Add bundle price separately

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
            appliedPromo: appliedPromo // Include the applied promo information
        }
    }), [selectedCategory, orderData, selectedAddOns, specialRequests, deliveryData, pricingData, appliedPromo]);

    // Validation for form completion
    const isFormValid = useMemo(() => {
        const hasPackage = !!orderData?.selectedProduct;
        const hasDate = !!orderData?.selectedDate;

        // Use the proper validation from the delivery form
        return hasPackage && hasDate && isDeliveryValid;
    }, [orderData?.selectedProduct, orderData?.selectedDate, isDeliveryValid]);

    // Optimized event handlers
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

    const handleProceedClick = useCallback(() => {

        if (onProceedToOrder) {
            onProceedToOrder(finalOrder);
        }
    }, [finalOrder, onProceedToOrder]);

    // Memoize component sections to prevent unnecessary re-renders
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

    return (
        <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Order Summary
                </Typography>

                {/* Package Selection */}
                {packageSection}

                {/* Order Details */}
                {orderData && (
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

                        {/* Bundle Section */}
                        {bundleSection}
                    </Box>
                )}

                {/* Add-Ons */}
                {addOnsSection}

                {/* Special Requests */}
                {specialRequestsSection}

                <Divider sx={{ my: 2 }} />

                {/* Pricing Breakdown */}
                <Box sx={{ mb: 3 }}>
                    {pricingData.packagePrice > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">
                                Package
                            </Typography>
                            <Typography variant="body2">
                                ${pricingData.packagePrice}
                            </Typography>
                        </Box>
                    )}

                    {pricingData.bundlePrice > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">
                                Bundle
                            </Typography>
                            <Typography variant="body2">
                                ${pricingData.bundlePrice}
                            </Typography>
                        </Box>
                    )}

                    {pricingData.addOnTotal > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Add-Ons</Typography>
                            <Typography variant="body2">${pricingData.addOnTotal}</Typography>
                        </Box>
                    )}

                    {/* Subtotal */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pt: 1, borderTop: 1, borderColor: 'grey.300' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Subtotal</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>${pricingData.subtotal}</Typography>
                    </Box>

                    {/* Discount */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Discount</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {pricingData.promoDiscount > 0 ? `-$${pricingData.promoDiscount}` : '$--'}
                        </Typography>
                    </Box>

                    {/* Promo Code Section */}
                    <PromoCodeSection
                        appliedPromo={appliedPromo}
                        promoCode={promoCode}
                        promoError={promoError}
                        onPromoCodeChange={handlePromoCodeChange}
                        onApplyPromoCode={handleApplyPromoCode}
                        onRemovePromoCode={handleRemovePromoCode}
                    />

                    {/* Bundle Discount */}
                    {pricingData.bundleDiscount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">Bundle Discount</Typography>
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                                -${pricingData.bundleDiscount}
                            </Typography>
                        </Box>
                    )}

                    {/* GST Breakdown */}
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
                            Total
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            ${pricingData.total}
                        </Typography>
                    </Box>
                </Box>

                {/* Proceed Button */}
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                    disabled={!isFormValid}
                    onClick={handleProceedClick}
                >
                    Proceed to Order
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

// Separate component for promo code section to prevent unnecessary re-renders
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