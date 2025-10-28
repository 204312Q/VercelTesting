'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

export function ProductDeliveryForm({ onDeliveryDataChange, onValidationChange, orderTotal = 0, discountAmount = 0 }) {
    const [deliveryData, setDeliveryData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        floor: '',
        unit: '',
        postalCode: '',
        paymentMethod: 'full',
    });

    const [errors, setErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});

    // Validation rules
    const validationRules = useMemo(() => ({
        fullName: (value) => !value.trim() ? 'Full name is required' : null,
        email: (value) => {
            if (!value.trim()) return 'Email is required';
            if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
            return null;
        },
        phone: (value) => !value.trim() ? 'Phone number is required' : null,
        address: (value) => !value.trim() ? 'Address is required' : null,
        postalCode: (value) => {
            if (!value.trim()) return 'Postal code is required';
            if (!/^\d{6}$/.test(value)) return 'Postal code must be 6 digits';
            return null;
        }
    }), []);

    // Handle input changes
    const handleInputChange = useCallback((field) => (e) => {
        const value = e.target.value;

        setDeliveryData(prev => ({ ...prev, [field]: value }));
        setTouchedFields(prev => ({ ...prev, [field]: true }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [errors]);

    // Handle payment method change
    const handlePaymentMethodChange = useCallback((method) => {
        setDeliveryData(prev => ({ ...prev, paymentMethod: method }));
    }, []);

    // Validation function
    const validateForm = useCallback(() => {
        const newErrors = {};

        // Only show errors for touched fields
        Object.keys(validationRules).forEach(field => {
            if (touchedFields[field]) {
                const error = validationRules[field](deliveryData[field]);
                if (error) newErrors[field] = error;
            }
        });

        setErrors(newErrors);

        // Check if all required fields are valid (regardless of touched state)
        const isFormValid = Object.keys(validationRules).every(field =>
            !validationRules[field](deliveryData[field])
        );

        if (onValidationChange) {
            onValidationChange(isFormValid);
        }

        return isFormValid;
    }, [deliveryData, touchedFields, validationRules, onValidationChange]);

    // Payment calculation
    const paymentAmounts = useMemo(() => {
        const finalTotal = Math.max(0, orderTotal - discountAmount);

        if (deliveryData.paymentMethod === 'partial') {
            const depositAmount = 100;
            const balancePayable = Math.max(0, finalTotal - depositAmount);

            return {
                depositAmount,
                balancePayable,
                totalAmount: finalTotal
            };
        }

        return {
            depositAmount: 0,
            balancePayable: 0,
            totalAmount: finalTotal
        };
    }, [deliveryData.paymentMethod, orderTotal, discountAmount]);

    // Notify parent of delivery data changes
    useEffect(() => {
        if (onDeliveryDataChange) {
            onDeliveryDataChange({
                ...deliveryData,
                paymentAmounts
            });
        }
    }, [deliveryData, paymentAmounts, onDeliveryDataChange]);

    // Run validation when form data changes
    useEffect(() => {
        validateForm();
    }, [validateForm]);

    // Check if partial payment is available
    const isPartialPaymentAvailable = orderTotal >= 728;

    // Form fields configuration
    const formFields = useMemo(() => [
        {
            name: 'fullName',
            label: 'Full name',
            required: true,
            placeholder: ''
        },
        {
            name: 'phone',
            label: 'Phone number',
            required: true,
            placeholder: 'e.g., 91234567'
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: ''
        },
        {
            name: 'address',
            label: 'Address',
            required: true,
            multiline: true,
            rows: 2,
            placeholder: 'Block, Street Name'
        },
        {
            name: 'floor',
            label: 'Floor',
            required: false,
            placeholder: 'e.g., 12',
            width: 6
        },
        {
            name: 'unit',
            label: 'Unit',
            required: false,
            placeholder: 'e.g., 34',
            width: 6
        },
        {
            name: 'postalCode',
            label: 'Postal Code',
            required: true,
            placeholder: 'e.g., 123456'
        }
    ], []);

    return (
        <Card sx={{
            mt: 2,
            borderTop: '5px solid #F27C96',
            borderRadius: '4px 4px 0 0',
        }}>
            <Box sx={{
                gap: 5,
                p: { xs: 3, md: 3 },
                display: 'grid',
                borderRadius: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}>
                {/* Delivery Address Section */}
                <DeliveryAddressSection
                    formFields={formFields}
                    deliveryData={deliveryData}
                    errors={errors}
                    onInputChange={handleInputChange}
                />

                {/* Payment Method Section */}
                <PaymentMethodSection
                    paymentMethod={deliveryData.paymentMethod}
                    paymentAmounts={paymentAmounts}
                    isPartialPaymentAvailable={isPartialPaymentAvailable}
                    onPaymentMethodChange={handlePaymentMethodChange}
                />
            </Box>
        </Card>
    );
}

// Delivery Address Section Component
const DeliveryAddressSection = ({ formFields, deliveryData, errors, onInputChange }) => (
    <div>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Delivery Address*
        </Typography>

        <Grid container spacing={0}>
            {formFields.map((field) => (
                <Grid
                    key={field.name}
                    item
                    xs={field.width || 12}
                    sx={{ padding: '0 !important', margin: '0 !important' }}
                >
                    <TextField
                        fullWidth
                        label={field.label}
                        type={field.type || 'text'}
                        required={field.required}
                        multiline={field.multiline}
                        rows={field.rows}
                        value={deliveryData[field.name]}
                        onChange={onInputChange(field.name)}
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                        placeholder={field.placeholder}
                        size="medium"
                        sx={{
                            margin: '4px 0',
                            ...(field.width === 6 && field.name === 'floor' && { marginRight: '4px' }),
                            ...(field.width === 6 && field.name === 'unit' && { marginLeft: '4px' }),
                            '& .MuiOutlinedInput-root': {
                                paddingLeft: '0 !important',
                            },
                            '& .MuiInputBase-input': {
                                paddingLeft: '14px !important',
                            }
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    </div>
);

// Payment Method Section Component
const PaymentMethodSection = ({
    paymentMethod,
    paymentAmounts,
    isPartialPaymentAvailable,
    onPaymentMethodChange
}) => (
    <div>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Payment method
        </Typography>

        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            {/* Full Payment Option */}
            <PaymentOption
                isSelected={paymentMethod === 'full'}
                onClick={() => onPaymentMethodChange('full')}
                title="Full"
                description=""
            />

            {/* Partial Payment Option */}
            {isPartialPaymentAvailable && (
                <PaymentOption
                    isSelected={paymentMethod === 'partial'}
                    onClick={() => onPaymentMethodChange('partial')}
                    title="Partial (Deposit)"
                    description={`Pay $${paymentAmounts.depositAmount} now, balance $${paymentAmounts.balancePayable.toFixed(2)} pay later`}
                />
            )}
        </Box>
    </div>
);

// Payment Option Component
const PaymentOption = ({ isSelected, onClick, title, description }) => (
    <Box
        sx={[
            (theme) => ({
                borderRadius: 1.5,
                border: `solid 1px ${isSelected ? theme.vars.palette.primary.main : theme.vars.palette.grey[300]}`,
                transition: theme.transitions.create(['box-shadow'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.shortest,
                }),
                cursor: 'pointer',
                ...(isSelected && {
                    boxShadow: `0 0 0 2px ${theme.vars.palette.primary.main}`
                }),
            }),
        ]}
        onClick={onClick}
    >
        <Box sx={{
            px: 2,
            gap: 2,
            height: 80,
            display: 'flex',
            alignItems: 'center',
        }}>
            <Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: isSelected ? 'primary.main' : 'grey.400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {isSelected && (
                    <Box sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                    }} />
                )}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                <Box component="span" sx={{
                    typography: 'subtitle1',
                    display: 'block'
                }}>
                    {title}
                </Box>
                {description && (
                    <Box component="span" sx={{
                        typography: 'caption',
                        color: 'text.secondary'
                    }}>
                        {description}
                    </Box>
                )}
            </Box>
        </Box>
    </Box>
);