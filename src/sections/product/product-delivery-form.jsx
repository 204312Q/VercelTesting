'use client';

import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

export function ProductDeliveryForm({ onDeliveryDataChange, onValidationChange, orderTotal = 0 }) {
    const [deliveryData, setDeliveryData] = useState({
        // Personal Information
        fullName: '',
        phone: '',
        email: '',

        // Address Information
        address: '',
        floor: '',
        unit: '',
        postalCode: '',

        // Payment method
        paymentMethod: 'full', // full, partial
    });

    const [errors, setErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});

    // Notify parent component when delivery data changes
    useEffect(() => {
        if (onDeliveryDataChange) {
            onDeliveryDataChange(deliveryData);
        }
    }, [deliveryData, onDeliveryDataChange]);

    // Handle input changes
    const handleInputChange = useCallback((field) => (e) => {
        const value = e.target.value;
        setDeliveryData(prev => {
            const newData = { ...prev, [field]: value };
            return newData;
        });

        // Mark field as touched
        setTouchedFields(prev => ({ ...prev, [field]: true }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [errors]);

    // Validation
    const validateForm = useCallback(() => {
        const newErrors = {};

        // Only show errors for fields that have been touched
        if (touchedFields.fullName && !deliveryData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        if (touchedFields.email) {
            if (!deliveryData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(deliveryData.email)) {
                newErrors.email = 'Email is invalid';
            }
        }
        if (touchedFields.phone && !deliveryData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }
        if (touchedFields.address && !deliveryData.address.trim()) {
            newErrors.address = 'Address is required';
        }
        if (touchedFields.postalCode) {
            if (!deliveryData.postalCode.trim()) {
                newErrors.postalCode = 'Postal code is required';
            } else if (!/^\d{6}$/.test(deliveryData.postalCode)) {
                newErrors.postalCode = 'Postal code must be 6 digits';
            }
        }

        setErrors(newErrors);

        // For validation status, check all required fields regardless of touched state
        const allFieldsValid = !!(
            deliveryData.fullName.trim() &&
            deliveryData.email.trim() &&
            /\S+@\S+\.\S+/.test(deliveryData.email) &&
            deliveryData.phone.trim() &&
            deliveryData.address.trim() &&
            deliveryData.postalCode.trim() &&
            /^\d{6}$/.test(deliveryData.postalCode)
        );

        // Notify parent component about validation status
        if (onValidationChange) {
            onValidationChange(allFieldsValid);
        }

        return allFieldsValid;
    }, [deliveryData, touchedFields, onValidationChange]);

    // Run validation whenever delivery data changes
    useEffect(() => {
        validateForm();
    }, [validateForm]);

    return (
        <Card sx={{
            mt: 2,
            borderTop: '5px solid #F27C96',
            borderRadius: '4px 4px 0 0',
        }}>
            <Box
                sx={[
                    () => ({
                        gap: 5,
                        p: { xs: 3, md: 3 },
                        display: 'grid',
                        borderRadius: 2,
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                    }),
                ]}
            >
                {/* Delivery Address Component */}
                <div>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                        Delivery Address*
                    </Typography>

                    <Grid container spacing={0}>
                        <Grid item xs={12} sx={{ padding: '0 !important', margin: '0 !important' }}>
                            <TextField
                                fullWidth
                                label="Full name"
                                required
                                value={deliveryData.fullName}
                                onChange={handleInputChange('fullName')}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                                size="medium"
                                sx={{
                                    margin: '4px 0',
                                    '& .MuiOutlinedInput-root': {
                                        paddingLeft: '0 !important',
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingLeft: '14px !important',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ padding: '0 !important', margin: '0 !important' }}>
                            <TextField
                                fullWidth
                                label="Phone number"
                                required
                                value={deliveryData.phone}
                                onChange={handleInputChange('phone')}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                size="medium"
                                placeholder="e.g., 91234567"
                                sx={{
                                    margin: '4px 0',
                                    '& .MuiOutlinedInput-root': {
                                        paddingLeft: '0 !important',
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingLeft: '14px !important',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ padding: '0 !important', margin: '0 !important' }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                required
                                value={deliveryData.email}
                                onChange={handleInputChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
                                size="medium"
                                sx={{
                                    margin: '4px 0',
                                    '& .MuiOutlinedInput-root': {
                                        paddingLeft: '0 !important',
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingLeft: '14px !important',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ padding: '0 !important', margin: '0 !important' }}>
                            <TextField
                                fullWidth
                                label="Address"
                                required
                                multiline
                                rows={2}
                                value={deliveryData.address}
                                onChange={handleInputChange('address')}
                                error={!!errors.address}
                                helperText={errors.address}
                                size="medium"
                                placeholder="Block, Street Name"
                                sx={{
                                    margin: '4px 0',
                                    '& .MuiOutlinedInput-root': {
                                        paddingLeft: '0 !important',
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingLeft: '14px !important',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ padding: '0 !important', margin: '0 !important' }}>
                            <TextField
                                fullWidth
                                label="Floor"
                                value={deliveryData.floor}
                                onChange={handleInputChange('floor')}
                                size="medium"
                                placeholder="e.g., 12"
                                sx={{
                                    margin: '4px 0',
                                    marginRight: '4px',
                                    '& .MuiOutlinedInput-root': {
                                        paddingLeft: '0 !important',
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingLeft: '14px !important',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ padding: '0 !important', margin: '0 !important' }}>
                            <TextField
                                fullWidth
                                label="Unit"
                                value={deliveryData.unit}
                                onChange={handleInputChange('unit')}
                                size="medium"
                                placeholder="e.g., 34"
                                sx={{
                                    margin: '4px 0',
                                    marginLeft: '4px',
                                    '& .MuiOutlinedInput-root': {
                                        paddingLeft: '0 !important',
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingLeft: '14px !important',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ padding: '0 !important', margin: '0 !important' }}>
                            <TextField
                                fullWidth
                                label="Postal Code"
                                required
                                value={deliveryData.postalCode}
                                onChange={handleInputChange('postalCode')}
                                error={!!errors.postalCode}
                                helperText={errors.postalCode}
                                size="medium"
                                placeholder="e.g., 123456"
                                sx={{
                                    margin: '4px 0',
                                    '& .MuiOutlinedInput-root': {
                                        paddingLeft: '0 !important',
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingLeft: '14px !important',
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>

                {/* Payment Method Component */}
                <div>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                        Payment method
                    </Typography>

                    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
                        {/* Full Payment Option */}
                        <Box
                            sx={[
                                (theme) => ({
                                    borderRadius: 1.5,
                                    border: `solid 1px ${deliveryData.paymentMethod === 'full' ? theme.vars.palette.primary.main : theme.vars.palette.grey[300]}`,
                                    transition: theme.transitions.create(['box-shadow'], {
                                        easing: theme.transitions.easing.sharp,
                                        duration: theme.transitions.duration.shortest,
                                    }),
                                    ...(deliveryData.paymentMethod === 'full' && {
                                        boxShadow: `0 0 0 2px ${theme.vars.palette.primary.main}`
                                    }),
                                }),
                            ]}
                            onClick={() => setDeliveryData(prev => ({ ...prev, paymentMethod: 'full' }))}
                        >
                            <Box
                                sx={{
                                    px: 2,
                                    gap: 2,
                                    height: 80,
                                    display: 'flex',
                                    cursor: 'pointer',
                                    alignItems: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        border: '2px solid',
                                        borderColor: deliveryData.paymentMethod === 'full' ? 'primary.main' : 'grey.400',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {deliveryData.paymentMethod === 'full' && (
                                        <Box
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                backgroundColor: 'primary.main',
                                            }}
                                        />
                                    )}
                                </Box>

                                <Box component="span" sx={{ typography: 'subtitle1', flexGrow: 1 }}>
                                    Full
                                </Box>
                            </Box>
                        </Box>

                        {/* Partial Payment Option - Show only if order total is more than $1000 */}
                        {orderTotal > 1000 && (
                            <Box
                                sx={[
                                    (theme) => ({
                                        borderRadius: 1.5,
                                        border: `solid 1px ${deliveryData.paymentMethod === 'partial' ? theme.vars.palette.primary.main : theme.vars.palette.grey[300]}`,
                                        transition: theme.transitions.create(['box-shadow'], {
                                            easing: theme.transitions.easing.sharp,
                                            duration: theme.transitions.duration.shortest,
                                        }),
                                        ...(deliveryData.paymentMethod === 'partial' && {
                                            boxShadow: `0 0 0 2px ${theme.vars.palette.primary.main}`
                                        }),
                                    }),
                                ]}
                                onClick={() => setDeliveryData(prev => ({ ...prev, paymentMethod: 'partial' }))}
                            >
                                <Box
                                    sx={{
                                        px: 2,
                                        gap: 2,
                                        height: 80,
                                        display: 'flex',
                                        cursor: 'pointer',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            border: '2px solid',
                                            borderColor: deliveryData.paymentMethod === 'partial' ? 'primary.main' : 'grey.400',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {deliveryData.paymentMethod === 'partial' && (
                                            <Box
                                                sx={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'primary.main',
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Box component="span" sx={{ typography: 'subtitle1', flexGrow: 1 }}>
                                        Partial (Deposit)
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </div>
            </Box>
        </Card>
    );
}
