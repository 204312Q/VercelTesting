'use client';

import React, { lazy, Suspense, useRef, useState, useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// import { preventContextMenu } from '@fullcalendar/core/internal';

// Lazy imports
const ProductOrderForm = lazy(() =>
  import('./product-order-form').then((m) => ({ default: m.ProductOrderForm })),
);
const ProductAddOnForm = lazy(() =>
  import('./product-addon-form').then((m) => ({ default: m.ProductAddOnForm })),
);
const ProductSpecialRequestForm = lazy(() =>
  import('./product-special-request-form').then((m) => ({ default: m.ProductSpecialRequestForm })),
);
const ProductOrderSummary = lazy(() =>
  import('./product-order-summary').then((m) => ({ default: m.ProductOrderSummary })),
);
const ProductNotes = lazy(() =>
  import('./product-notes').then((m) => ({ default: m.ProductNotes })),
);
const ProductDeliveryForm = lazy(() =>
  import('./product-delivery-form').then((m) => ({ default: m.ProductDeliveryForm })),
);

// Move loading component outside to prevent recreation
const LoadingComponent = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
    <CircularProgress size={24} />
  </Box>
);

export function ProductList({ packages = [], addons = [], loading, sx, ...other }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [specialRequests, setSpecialRequests] = useState({
    requests: [], // [{ specialRequestId: number|string, value: true }]
    note: '',
    riceOption: 'NO_PREF',
  });
  const [specialRequestOptions, setSpecialRequestOptions] = useState([]); // [{id, value, label}]
  const [deliveryData, setDeliveryData] = useState({});
  const [isDeliveryValid, setIsDeliveryValid] = useState(false);
  const [pricingData, setPricingData] = useState({ subtotal: 0, total: 0, promoDiscount: 0 });
  const orderFormRef = useRef(null);

  // Optimized handlers
  const handleCategoryClick = useCallback(
    (category) => {
      if (selectedCategory?.id !== category.id) {
        setSelectedAddOns([]);
        setOrderData(null);
        setSpecialRequests({ requests: [], note: '', riceOption: 'NO_PREF' });
        setDeliveryData({});
        setIsDeliveryValid(false);
        setPricingData({ subtotal: 0, total: 0, promoDiscount: 0 });
      }
      setSelectedCategory(category);
    },
    [selectedCategory?.id],
  );

  const handleAddOnChange = useCallback((addOns) => setSelectedAddOns(addOns), []);
  const handleOrderChange = useCallback((data) => setOrderData(data), []);
  const handleDeliveryDataChange = useCallback((data) => setDeliveryData(data), []);
  const handleDeliveryValidationChange = useCallback((isValid) => setIsDeliveryValid(isValid), []);
  const handlePricingChange = useCallback((pricing) => setPricingData(pricing), []);

  const handleSpecialRequestChange = useCallback((next) => {
    setSpecialRequests((prev) => {
      // Note only
      if (typeof next === 'string') {
        // note-only change
        return { ...prev, note: next };
      }

      // Array of ids
      if (Array.isArray(next)) {
        // array of ids => build requests[]
        return {
          ...prev,
          requests: next.map((id) => ({ specialRequestId: id, value: true })),
        };
      }

      // Object payload from ProductSepcialRequestForm
      if (next && typeof next === 'object') {
        const requests = Array.isArray(next.requests)
          ? next.requests
              .filter((r) => r?.value === true)
              .map((r) => ({
                specialRequestId: r.specialRequestId ?? r.id ?? r.value,
                value: true,
              }))
          : prev.requests;

        const note = typeof next.note === 'string' ? next.note : prev.note;
        const riceOption = typeof next.riceOption === 'string' ? next.riceOption : prev.riceOption;

        return { requests, note, riceOption };
      }
      return prev;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedCategory(null);
    setSelectedAddOns([]);
    setOrderData(null);
    setSpecialRequests({ requests: [], note: '', riceOption: 'NO_PREF' });
    setDeliveryData({});
    setIsDeliveryValid(false);
    setPricingData({ subtotal: 0, total: 0, promoDiscount: 0 });
  }, []);

  // Auto-scroll when category is selected
  useEffect(() => {
    // if (selectedCategory && orderFormRef.current) {
    //   const timer = setTimeout(() => {
    //     orderFormRef.current.scrollIntoView({
    //       behavior: 'smooth',
    //       block: 'start',
    //     });
    //   }, 100);
    //   return () => clearTimeout(timer);
    // }
    let timer;
    if (selectedCategory && orderFormRef.current) {
      timer = setTimeout(() => {
        orderFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [selectedCategory]);

  const categories = useMemo(
    () =>
      packages.map((p) => {
        const starting = p?.options?.length
          ? Math.min(...p.options.map((o) => Number(o.price ?? 0)))
          : Number(p.price ?? 0);

        return {
          id: p.product_id,
          name: p.name, // "Dual Meal", "Single Meal", "Trial Meal"
          description: p.description ?? '',
          image: p.imageUrl ?? null,
          startingPrice: starting,
        };
      }),
    [packages],
  );

  // Duration options for the selected base package
  const filteredProducts = useMemo(() => {
    if (!selectedCategory?.id) return [];
    const pkg = packages.find((p) => p.product_id === selectedCategory.id);
    if (!pkg) return [];
    return (pkg.options ?? []).map((o) => ({
      product_id: o.id, // radio value (unique per option)
      duration: o.value, // days
      price: Number(o.price || 0),
    }));
  }, [packages, selectedCategory?.id]);

  const categoryCards = useMemo(
    () => (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            justifyItems: 'center',
            width: '100%',
            maxWidth: { xs: '320px', sm: '100%' },
          }}
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory?.id === category.id}
              onClick={handleCategoryClick}
            />
          ))}
        </Box>
      </Box>
    ), 
    [categories, selectedCategory?.id, handleCategoryClick]
  );

  // Memoize configuration section
  const configurationSection = useMemo(() => {
    if (!selectedCategory) {
      return null;
    }
    return (
      <Box ref={orderFormRef} sx={{ mt: 4 }}>
        <Suspense fallback={<LoadingComponent />}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h4" sx={{ color: 'primary.main' }}>
              Configure Your Order
            </Typography>
            <Button onClick={handleClearSelection} variant="outlined" size="small">
              Clear Selection
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              width: '100%',
            }}
          >
            {/* Left Column - All Forms */}
            <Box
              sx={{
                flex: { xs: 1, md: 2 },
                width: '100%',
              }}
            >
              <ProductOrderForm
                key={`order-${selectedCategory.id}`}
                category={selectedCategory}
                products={filteredProducts}
                onOrderChange={handleOrderChange}
              />

              {selectedCategory?.id !== 3 && (
                <ProductAddOnForm
                  key={`addon-${selectedCategory.id}`}
                  addOnItems={addons}
                  onAddOnChange={handleAddOnChange}
                />
              )}

              <ProductSpecialRequestForm
                key={`request-${selectedCategory.id}`}
                onRequestChange={handleSpecialRequestChange}
                onOptionsChange={setSpecialRequestOptions}
                value={specialRequests}
              />

              <ProductDeliveryForm
                onDeliveryDataChange={handleDeliveryDataChange}
                onValidationChange={handleDeliveryValidationChange}
                orderTotal={pricingData.subtotal}
                discountAmount={pricingData.promoDiscount}
                basePrice={orderData?.selectedProduct?.price || 0}
              />
            </Box>

            {/* Right Column */}
            <Box
              sx={{
                flex: { xs: 1, md: 1 },
                width: '100%',
              }}
            >
              <ProductOrderSummary
                selectedCategory={selectedCategory}
                orderData={orderData}
                selectedAddOns={selectedAddOns}
                specialRequests={specialRequests}
                specialRequestOptions={specialRequestOptions}
                deliveryData={deliveryData}
                isDeliveryValid={isDeliveryValid}
                onPricingChange={handlePricingChange}
              />
            </Box>
          </Box>

          <ProductNotes
            selectedCategory={selectedCategory}
            selectedBundle={orderData?.selectedBundles}
          />
        </Suspense>
      </Box>
    );
  }, [
    selectedCategory,
    orderData,
    selectedAddOns,
    specialRequests,
    deliveryData,
    isDeliveryValid,
    pricingData.subtotal,
    pricingData.promoDiscount,
    filteredProducts,
    addons,
    specialRequestOptions,
    handleClearSelection,
    handleOrderChange,
    handleAddOnChange,
    handleSpecialRequestChange,
    handleDeliveryDataChange,
    handleDeliveryValidationChange,
    handlePricingChange,
  ]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={[
        {
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 },
          mx: 'auto',
          maxWidth: '1200px',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {categoryCards}
      {configurationSection}
    </Box>
  );
}

// Memoized CategoryCard component to prevent unnecessary re-renders
const CategoryCard = ({ category, isSelected, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(category);
  }, [onClick, category]);

  return (
    <Card
      sx={{
        pt: 1,
        cursor: 'pointer',
        border: isSelected ? 2 : 0,
        borderColor: 'primary.main',
        borderRadius: 3,
        overflow: 'hidden',
        width: '100%',
        maxWidth: { xs: 320, sm: 'none' },
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
        },
      }}
      onClick={handleClick}
    >
      {/* Image Container */}
      <Box sx={{ px: 1 }}>
        <Box
          sx={{
            aspectRatio: '1/1',
            backgroundColor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: category.image ? `url(${category.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 2,
          }}
        >
          {!category.image && (
            <Typography variant="h6" color="text.secondary">
              {category.name}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Content Container */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          {category.description}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, mb: 0.5, textAlign: 'center' }}>
          {category.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary' }}>
          from ${category.startingPrice}
        </Typography>
      </Box>
    </Card>
  );
};
