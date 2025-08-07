"use client";

import { useState, useRef, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { _packageCategories } from 'src/_mock/_others';

// Lazy imports
const ProductOrderForm = lazy(() => import('./product-order-form').then(m => ({ default: m.ProductOrderForm })));
const ProductAddOnForm = lazy(() => import('./product-addon-form').then(m => ({ default: m.ProductAddOnForm })));
const ProductSpecialRequestForm = lazy(() => import('./product-special-request-form').then(m => ({ default: m.ProductSpecialRequestForm })));
const ProductOrderSummary = lazy(() => import('./product-order-summary').then(m => ({ default: m.ProductOrderSummary })));
const ProductNotes = lazy(() => import('./product-notes').then(m => ({ default: m.ProductNotes })));
const ProductDeliveryForm = lazy(() => import('./product-delivery-form').then(m => ({ default: m.ProductDeliveryForm })));

// Move loading component outside to prevent recreation
const LoadingComponent = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
    <CircularProgress size={24} />
  </Box>
);

export function ProductList({ packages = [], addons = [], onProceedToOrder, loading, sx, ...other }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [deliveryData, setDeliveryData] = useState({});
  const [isDeliveryValid, setIsDeliveryValid] = useState(false);
  const orderFormRef = useRef(null);

  // Optimized handlers
  const handleCategoryClick = useCallback((category) => {
    if (selectedCategory?.id !== category.id) {
      setSelectedAddOns([]);
      setOrderData(null);
      setSpecialRequests('');
    }
    setSelectedCategory(category);
  }, [selectedCategory?.id]);

  const handleAddOnChange = useCallback((addOns) => {
    setSelectedAddOns(addOns);
  }, []);

  const handleOrderChange = useCallback((data) => {
    setOrderData(data);
  }, []);

  const handleSpecialRequestChange = useCallback((requests) => {
    setSpecialRequests(requests);
  }, []);

  const handleDeliveryDataChange = useCallback((data) => {
    setDeliveryData(data);
  }, []);

  const handleDeliveryValidationChange = useCallback((isValid) => {
    setIsDeliveryValid(isValid);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedCategory(null);
    setSelectedAddOns([]);
    setOrderData(null);
    setSpecialRequests('');
    setDeliveryData({});
  }, []);

  // Handle proceed to order - directly pass the final order to context
  const handleProceedToOrder = useCallback((finalOrder) => {
    if (!onProceedToOrder) return;

    console.log('Processing order:', finalOrder);

    // Directly pass the final order to the context
    onProceedToOrder(finalOrder);
  }, [onProceedToOrder]);

  // Auto-scroll when category is selected
  useEffect(() => {
    if (selectedCategory && orderFormRef.current) {
      setTimeout(() => {
        orderFormRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [selectedCategory]);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];

    const categoryName = selectedCategory.name;
    if (categoryName === "Dual Meal") {
      return packages.filter(p => p.name.includes("Dual Meal"));
    }
    if (categoryName === "Single Meal") {
      return packages.filter(p => p.name.includes("Single Meal"));
    }
    if (categoryName === "Trial Meal") {
      return packages.filter(p => p.name.includes("Trial"));
    }
    return [];
  }, [packages, selectedCategory?.name]);

  // Memoize category cards rendering
  const categoryCards = useMemo(() => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      px: { xs: 2, sm: 3 },
    }}>
      <Box sx={{
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
      }}>
        {_packageCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory?.id === category.id}
            onClick={handleCategoryClick}
          />
        ))}
      </Box>
    </Box>
  ), [selectedCategory?.id, handleCategoryClick]);

  // Memoize configuration section
  const configurationSection = useMemo(() => {
    if (!selectedCategory) return null;

    return (
      <Box ref={orderFormRef} sx={{ mt: 4 }}>
        <Suspense fallback={<LoadingComponent />}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h4" sx={{ color: 'primary.main' }}>
              Configure Your Order
            </Typography>
            <Button onClick={handleClearSelection} variant="outlined" size="small">
              Clear Selection
            </Button>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            width: '100%'
          }}>
            {/* Left Column - All Forms */}
            <Box sx={{
              flex: { xs: 1, md: 2 },
              width: '100%'
            }}>

              <ProductOrderForm
                key={`order-${selectedCategory.id}`}
                category={selectedCategory}
                products={filteredProducts}
                onOrderChange={handleOrderChange}
              />

              {selectedCategory?.name !== "Trial Meal" && (
                <ProductAddOnForm
                  key={`addon-${selectedCategory.id}`}
                  addOnItems={addons}
                  onAddOnChange={handleAddOnChange}
                />
              )}

              <ProductSpecialRequestForm
                key={`request-${selectedCategory.id}`}
                onRequestChange={handleSpecialRequestChange}
              />

              <ProductDeliveryForm
                orderTotal={orderData?.totalPrice || 0}
                onDeliveryDataChange={handleDeliveryDataChange}
                onValidationChange={handleDeliveryValidationChange}
              />
            </Box>


            {/* Right Column */}
            <Box sx={{
              flex: { xs: 1, md: 1 },
              width: '100%'
            }}>
              <ProductOrderSummary
                selectedCategory={selectedCategory}
                orderData={orderData}
                selectedAddOns={selectedAddOns}
                specialRequests={specialRequests}
                deliveryData={deliveryData}
                isDeliveryValid={isDeliveryValid}
                onProceedToOrder={handleProceedToOrder}
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
  }, [selectedCategory, orderData, selectedAddOns, specialRequests, deliveryData, isDeliveryValid, filteredProducts, handleClearSelection, handleOrderChange, handleAddOnChange, handleSpecialRequestChange, handleDeliveryDataChange, handleDeliveryValidationChange]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={[
      {
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        mx: 'auto',
        maxWidth: '1200px',
      },
      ...(Array.isArray(sx) ? sx : [sx])
    ]} {...other}>
      {categoryCards}
      {configurationSection}
    </Box>
  );
}

// Separate CategoryCard component to prevent unnecessary re-renders
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
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease'
        }
      }}
      onClick={handleClick}
    >
      {/* Image Container */}
      <Box sx={{ px: 1 }}>
        <Box sx={{
          aspectRatio: '1/1',
          backgroundColor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: category.image ? `url(${category.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
        }}>
          {!category.image && (
            <Typography variant="h6" color="text.secondary">
              {category.name}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Content Container */}
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
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