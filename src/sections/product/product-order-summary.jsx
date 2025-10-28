'use client';

import { useMemo, useEffect, useCallback, useState } from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

// ----------------------------------------------------------------------------

// helper to POST JSON and throw on non-2xx
async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export function ProductOrderSummary({
  selectedCategory,
  orderData,
  selectedAddOns = [],
  specialRequests = '',
  specialRequestOptions = [],
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
    const gstAmount = (subtotalAfterDiscount * 9) / 109;
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
      total,
    };
  }, [orderData, selectedAddOns, appliedPromo]);

  const srById = useMemo(() => {
    const map = {};
    (specialRequestOptions || []).forEach((o) => {
      const key = String(o.id ?? o.specialRequestId ?? o.value);
      map[key] = o; // expect { id, value, label }
    });
    return map;
  }, [specialRequestOptions]);

  useEffect(() => {
    console.log('[Summary] options:', specialRequestOptions);
    console.log('[Summary] srById keys:', Object.keys(srById));
    console.log('[Summary] specialRequests:', specialRequests);
  }, [specialRequestOptions, srById, specialRequests]);

  // Notify parent component of pricing changes
  useEffect(() => {
    if (onPricingChange) {
      onPricingChange(pricingData);
    }
  }, [pricingData, onPricingChange]);

  useEffect(() => {
    let cancelled = false;
    const code = appliedPromo?.promoCode?.code;
    if (!code) {
      // Always return a cleanup to satisfy consistent-return
      return () => {};
    }

    (async () => {
      try {
        const res = await fetch('/api/promotions/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            subtotal: pricingData.subtotal, // current subtotal
          }),
        });
        const data = await res.json();
        if (!cancelled && res.ok && data.valid) {
          setAppliedPromo(
            (prev) =>
              prev && {
                ...prev,
                discountAmount: Number(data.discountAmount) || 0,
                description:
                  data.promo.type === 'PERCENT'
                    ? `Get ${data.promo.value}% off`
                    : `Get $${data.promo.value} off`,
              },
          );
        }
      } catch {
        /* ignore revalidation errors */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pricingData.subtotal, appliedPromo?.promoCode?.code]);

  // Memoize final order object
  // const finalOrder = useMemo(
  //   () => ({
  //     category: selectedCategory?.name,
  //     product: orderData?.selectedProduct,
  //     addOns: selectedAddOns,
  //     selectedBundles: orderData?.selectedBundles || [],
  //     specialRequests: specialRequests,
  //     dateType: orderData?.dateType,
  //     selectedDate: orderData?.selectedDate,
  //     startWith: orderData?.startWith,
  //     deliveryInfo: deliveryData,
  //     pricing: {
  //       ...pricingData,
  //       appliedPromo: appliedPromo,
  //     },
  //   }),
  //   [
  //     selectedCategory,
  //     orderData,
  //     selectedAddOns,
  //     specialRequests,
  //     deliveryData,
  //     pricingData,
  //     appliedPromo,
  //   ],
  // );

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

  const handleApplyPromoCode = useCallback(async () => {
    setPromoError('');

    // ⛔ block promos when a bundle is selected
    if ((orderData?.selectedBundles?.length ?? 0) > 0) {
      setAppliedPromo(null);
      setPromoError('Promo code is not applicable with a bundle.');
      return;
    }

    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }
    try {
      const res = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: pricingData.subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setAppliedPromo(null);
        setPromoError(data?.error || 'Invalid promo code');
        return;
      }

      setAppliedPromo({
        promoCode: { id: data.promo.id, code: data.promo.code },
        description:
          data.promo.type === 'PERCENT'
            ? `Get ${data.promo.value}% off`
            : `Get $${data.promo.value} off`,
        discountAmount: data.discountAmount,
      });
    } catch (e) {
      console.error(e);
      setAppliedPromo(null);
      setPromoError('Failed to validate promo code');
    }
  }, [promoCode, pricingData.subtotal, orderData?.selectedBundles?.length]);

  const handleRemovePromoCode = useCallback(() => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  }, []);

  const handleProceedClick = useCallback(async () => {
    if (!isFormValid) return;

    setIsProcessingCheckout(true);
    setCheckoutError('');

    try {
      // 1) Map UI → API
      const portion = /trial/i.test(selectedCategory?.name ?? '')
        ? 'TRIAL'
        : /single/i.test(selectedCategory?.name ?? '')
          ? 'SINGLE'
          : 'DUAL';

      const input_type = orderData?.dateType === 'confirmed' ? 'CONFIRMED_DATE' : 'EDD';
      const session =
        input_type === 'CONFIRMED_DATE'
          ? (orderData?.startWith ?? 'lunch').toUpperCase() // LUNCH / DINNER
          : null;

      const productId = selectedCategory?.id; // base package product_id
      const productOptionId = orderData?.selectedProduct?.product_id; // PACKAGE_DURATION option id
      const bundleOptionId = orderData?.selectedBundles?.[0]?.product_id ?? null; // optional

      // 2) Create draft order
      const draft = await postJSON('/api/orders', {
        productId,
        productOptionId,
        bundleOptionId, // null if not chosen
        portion,
        session, // null when EDD
        input_type, // CONFIRMED_DATE | EDD
        input_date: orderData?.selectedDate, // YYYY-MM-DD
      });
      const orderId = draft.id;

      // 3) Add-ons
      if (selectedAddOns?.length) {
        await Promise.all(
          selectedAddOns.map((a) =>
            postJSON(`/api/orders/${orderId}/items`, {
              productId: a.parentProductId ?? a.product_id, // parent ADDON product id
              optionId: a.product_id, // ADDON option id
              quantity: 1,
            }),
          ),
        );
      }

      // 4) Special requests + note
      const srPayload =
        typeof specialRequests === 'string'
          ? { requests: [], note: specialRequests || null }
          : Array.isArray(specialRequests)
            ? {
                requests: specialRequests.map((id) => ({ specialRequestId: id, value: true })),
                note: null,
              }
            : specialRequests || { requests: [], note: null };

      if (srPayload.note || (srPayload.requests?.length ?? 0) > 0) {
        await postJSON(`/api/orders/${orderId}/requests`, srPayload);
      }

      // 4.1) Rice option (enum) - save on the Order
      const riceOption =
        specialRequests &&
        typeof specialRequests === 'object' &&
        typeof specialRequests.riceOption === 'string'
          ? specialRequests.riceOption
          : 'NO_PREF';

      if (riceOption !== 'NO_PREF') {
        await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ riceOption }),
        });
      }

      // 5) Delivery snapshot (map camelCase → API shape)
      await postJSON(`/api/orders/${orderId}/delivery`, {
        full_name: deliveryData?.fullName,
        phone: deliveryData?.phone,
        email: deliveryData?.email,
        address_line: deliveryData?.address,
        floor: deliveryData?.floor ?? null,
        unit: deliveryData?.unit ?? null,
        postal_code: deliveryData?.postalCode,
        paymentPlan: deliveryData?.paymentMethod === 'partial' ? 'PARTIAL' : 'FULL',
      });

      // 6) Optional promo
      if (appliedPromo?.promoCode?.code) {
        const promoRes = await fetch(`/api/orders/${orderId}/promotions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: appliedPromo.promoCode.code }),
        });
        if (!promoRes.ok) {
          const msg = await promoRes.text();
          throw new Error(msg || 'Failed to apply promo to order');
        }
      }

      // 7) Open Stripe – now we only need the orderId
      const { url } = await postJSON('/api/checkout', {
        orderId,
        paymentType: deliveryData?.paymentMethod || 'full',
      });

      window.location.href = url;
    } catch (e) {
      console.error(e);
      setCheckoutError(e.message || 'Failed to proceed to checkout.');
      setIsProcessingCheckout(false);
    }
  }, [
    isFormValid,
    selectedCategory?.name,
    selectedCategory?.id,
    orderData?.dateType,
    orderData?.startWith,
    orderData?.selectedDate,
    orderData?.selectedProduct?.product_id,
    orderData?.selectedBundles,
    selectedAddOns,
    specialRequests,
    deliveryData,
    appliedPromo?.promoCode?.code,
  ]);

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
              mb: 0.5,
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
          <Box
            key={addOn.product_id}
            sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              {/* {(addOn.duration && addOn.duration > 1 ? `${addOn.duration}× ` : '') + addOn.name} */}
              {(Number(addOn.duration) ? `${addOn.duration}× ` : '') + addOn.name}
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
    // Normalize into { selectedIds[], note }
    let note = null;
    let selectedIds = [];

    let rice = orderData?.riceOption ?? 'NO_PREF';

    if (typeof specialRequests === 'string') {
      note = specialRequests.trim() || null;
    } else if (Array.isArray(specialRequests)) {
      selectedIds = specialRequests; // [id, id, ...]
    } else if (specialRequests && typeof specialRequests === 'object') {
      note = specialRequests.note || null;
      if (Array.isArray(specialRequests.requests)) {
        // keep only items explicitly checked (value === true)
        selectedIds = specialRequests.requests
          .filter((r) => r?.value === true)
          .map((r) => r.specialRequestId ?? r.id ?? r.value);
      }
      if (typeof specialRequests.riceOption === 'string') {
        rice = specialRequests.riceOption;
      }
    }

    // Map ids -> VALUE string (slug). Fallback to label or id if needed.
    const selectedValues = (selectedIds || [])
      .map((id) => {
        const opt = srById[String(id)];
        return opt?.value ?? opt?.label ?? String(id);
      })
      .filter(Boolean);

    console.log(selectedValues);

    if (selectedValues.length === 0 && !note && (!rice || rice === 'NO_PREF')) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Special Requests:
        </Typography>

        {selectedValues.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: note ? 1 : 0 }}>
            {selectedValues.map((v) => (
              <Chip
                key={String(v)}
                label={String(v)} // e.g. "no-pig-trotter"
                size="small"
                variant="outlined"
                sx={{ fontFamily: 'monospace' }} // make slugs look neat
              />
            ))}
          </Box>
        )}

        {rice && rice !== 'NO_PREF' && (
          <Box sx={{ mb: 1 }}>
            <Chip
              size="small"
              label={
                rice === 'WHITE'
                  ? 'All White Rice'
                  : rice === 'BROWN'
                    ? 'All Brown Rice'
                    : 'No Preference'
              }
              color="primary"
              variant="outlined"
              sx={{ mr: 0.5 }}
            />
          </Box>
        )}

        {note && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontStyle: 'italic',
              backgroundColor: 'grey.50',
              p: 1,
              borderRadius: 1,
              fontSize: '0.875rem',
            }}
          >
            &ldquo;{note}&rdquo;
          </Typography>
        )}
      </Box>
    );
  }, [specialRequests, srById, orderData?.riceOption]);

  const orderDetailsSection = useMemo(() => {
    if (!orderData) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Order Details:
        </Typography>

        {orderData.selectedDate && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            <strong>{orderData.dateType === 'confirmed' ? 'Start Date:' : 'E.D.D:'}</strong>{' '}
            {orderData.selectedDate}
          </Typography>
        )}

        {orderData.startWith && orderData.dateType === 'confirmed' && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            <strong>Start with:</strong>{' '}
            {orderData.startWith.charAt(0).toUpperCase() + orderData.startWith.slice(1)}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <strong>Includes:</strong> Longan Tea with Red Dates
        </Typography>

        {bundleSection}
      </Box>
    );
  }, [orderData, bundleSection]);

  // Gst
  const svrGstAmount = Number(orderData?.gst_amount ?? 0);
  const displayGstAmount = svrGstAmount > 0 ? svrGstAmount : pricingData.gstAmount;

  const pricingBreakdownSection = useMemo(
    () => (
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

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
            pt: 1,
            borderTop: 1,
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Subtotal
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            ${pricingData.subtotal}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Discount
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {/* {pricingData.promoDiscount > 0 ? `-$${pricingData.promoDiscount}` : '$--'} */}
            {appliedPromo ? `-$${Number(pricingData.promoDiscount || 0).toFixed(2)}` : '$--'}
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
            <Typography variant="body2" color="text.secondary">
              Bundle Discount
            </Typography>
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
              -${pricingData.bundleDiscount}
            </Typography>
          </Box>
        )}

        {displayGstAmount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              GST (9% inclusive)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${Number(displayGstAmount).toFixed(2)}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
            pt: 1,
            borderTop: 1,
            borderColor: 'grey.300',
          }}
        >
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
    ),
    [
      pricingData,
      appliedPromo,
      promoCode,
      promoError,
      handlePromoCodeChange,
      handleApplyPromoCode,
      handleRemovePromoCode,
      deliveryData?.paymentMethod,
      deliveryData?.paymentAmounts,
      displayGstAmount,
    ],
  );

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
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 1 }}
          >
            {!orderData?.selectedProduct && 'Please select a package'}
            {orderData?.selectedProduct &&
              !orderData?.selectedDate &&
              'Please select a delivery date'}
            {orderData?.selectedProduct &&
              orderData?.selectedDate &&
              !isDeliveryValid &&
              'Please complete the delivery information'}
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
  <Box
    sx={{
      mt: 2,
      pt: 2,
      borderTop: '2px solid #F27C96',
      backgroundColor: '#FFF5F7',
      borderRadius: 1,
      p: 2,
    }}
  >
    <Typography
      variant="subtitle2"
      sx={{
        fontWeight: 600,
        color: '#F27C96',
        mb: 1,
      }}
    >
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
  onRemovePromoCode,
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
                    px: 1,
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
