'use client';

import dayjs from 'dayjs';
import { useMemo, useEffect, useCallback, useState } from 'react';

import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
  shouldDisableDate,
  validateSelectedDate,
  // getMinimumSelectableDate,
} from 'src/utils/date-validation';

import { getBundlesForProduct } from 'src/actions/product-ssr';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import InputLabel from '@mui/material/InputLabel';
// import CircularProgress from '@mui/material/CircularProgress';


export function ProductOrderForm({ category, products, onOrderChange }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedBundles, setSelectedBundles] = useState([]);
  const [dateType, setDateType] = useState('confirmed');
  const [selectedDate, setSelectedDate] = useState(null);
  const [startWith, setStartWith] = useState('lunch');
  const [dateError, setDateError] = useState('');
  const [bundleCache, setBundleCache] = useState({});
  // const [availableBundles, setAvailableBundles] = useState([]);
  // const [bundleLoading, setBundleLoading] = useState(false);


  // Memoized values
  const isTrialMeal = useMemo(() => category?.name === 'Trial Meal', [category?.name]);
  // const minSelectableDate = useMemo(() => getMinimumSelectableDate(), []);

  // 1) Which product option (duration) is selected?
  const selectedProductData = useMemo(
    () => products.find((p) => p.product_id.toString() === selectedProduct),
    [products, selectedProduct]);

  // 2) Build cache key for current selection
  const currentKey = useMemo(() => {
    if (!selectedProduct || !category?.id || !selectedProductData?.duration) return null;
    return `${category.id}:${selectedProductData.duration}`;
  }, [selectedProduct, category?.id, selectedProductData?.duration]);

  // 3) Derive bundles from cache (prevents flicker)
  const availableBundles = useMemo(() => {
    if (!currentKey) return [];
    return bundleCache[currentKey] || [];
  }, [bundleCache, currentKey]);


  const { selectedBundleData, bundlePrice } = useMemo(() => {
    const bundles = availableBundles.filter((bundle) =>
      selectedBundles.includes(bundle.product_id),
    );
    const price = bundles.reduce((sum, bundle) => sum + bundle.price, 0);

    return { selectedBundleData: bundles, bundlePrice: price };
  }, [availableBundles, selectedBundles]);

  const orderData = useMemo(() => {
    if (!selectedProductData) return null;

    const basePrice = selectedProductData.price;
    const totalPrice = basePrice + bundlePrice;

    // Validate the selected date
    const dateValidation = validateSelectedDate(selectedDate);
    const isValidOrder = !!(selectedProductData && selectedDate && dateValidation.isValid);

    return {
      selectedProduct: selectedProductData,
      selectedBundles: selectedBundleData,
      bundlePrice,
      totalPrice,
      dateType,
      selectedDate,
      startWith: dateType === 'confirmed' ? startWith : null, // Only include startWith for confirmed dates
      category: category?.name,
      isValidOrder,
      dateValidation,
    };
  }, [
    selectedProductData,
    selectedBundleData,
    bundlePrice,
    dateType,
    selectedDate,
    startWith,
    category?.name,
  ]);

  const prefetchBundles = useCallback(
    async (baseId, durations = []) => {
      const tasks = durations.map(async (d) => {
        const key = `${baseId}:${d}`;
        if (bundleCache[key] !== undefined) return; // already cached (array or [])
        try {
          const data = await getBundlesForProduct(baseId, d);
          setBundleCache((prev) => ({ ...prev, [key]: Array.isArray(data) ? data : [] }));
        } catch {
          setBundleCache((prev) => ({ ...prev, [key]: [] }));
        }
      });
      await Promise.all(tasks);
    },
    [bundleCache],
  );

  // Effects
  useEffect(() => {
    if (!category?.id || !products?.length) return;
    // prefetch bundles for all durations of the selected package
    const durations = products.map((p) => p.duration).filter(Boolean);
    prefetchBundles(category.id, durations);
  }, [category?.id, products, prefetchBundles]);

  useEffect(() => {
    if (!availableBundles?.length) {
      if (selectedBundles.length) setSelectedBundles([]);
      return;
    }
    const validIds = new Set(availableBundles.map((b) => b.product_id));
    setSelectedBundles((prev) => prev.filter((id) => validIds.has(id)));
  }, [availableBundles, selectedBundles.length]);

  useEffect(() => {
    if (orderData && onOrderChange) {
      onOrderChange(orderData);
    }
  }, [orderData, onOrderChange]);

  // Optimized event handlers
  const handleProductChange = useCallback((e) => {
    setSelectedProduct(e.target.value);
    setSelectedBundles([]);
  }, []);

  const handleBundleChange = useCallback((bundleId, checked) => {
    setSelectedBundles((prev) =>
      checked ? [...prev, bundleId] : prev.filter((id) => id !== bundleId),
    );
  }, []);

  const handleDateTypeChange = useCallback((e) => {
    setDateType(e.target.value);
  }, []);

  const handleDateChange = useCallback((newValue) => {
    if (newValue) {
      const dateString = newValue.format('YYYY-MM-DD');
      setSelectedDate(dateString);

      // Validate the selected date
      const validation = validateSelectedDate(dateString);
      setDateError(validation.isValid ? '' : validation.message);
    } else {
      setSelectedDate(null);
      setDateError('');
    }
  }, []);

  const handleStartWithChange = useCallback((e) => {
    setStartWith(e.target.value);
  }, []);

  return (
    <Card
      sx={{
        borderTop: '5px solid #F27C96',
        borderRadius: '4px 4px 0 0',
        mb: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Package Selected: {category?.name}
        </Typography>

        {/* Product Selection */}
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Select Days:</FormLabel>
          <RadioGroup value={selectedProduct} onChange={handleProductChange}>
            {products.map((product) => (
              <FormControlLabel
                key={product.product_id}
                value={product.product_id.toString()}
                control={<Radio />}
                label={`${product.duration} Days - $${product.price}`}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Bundle Section with Loading */}
        {availableBundles.length > 0 && (
          <Box
            sx={{
              mt: 3,
              border: '2px solid #F27C96',
              borderRadius: '8px',
              padding: 2,
              backgroundColor: '#FFF5F7',
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: '#F27C96', fontWeight: 'bold' }}
            >
              Bundle with (optional):
            </Typography>

            {availableBundles.map((bundle) => (
              <Box key={bundle.product_id} sx={{ mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedBundles.includes(bundle.product_id)}
                      onChange={(e) => handleBundleChange(bundle.product_id, e.target.checked)}
                      sx={{ color: '#F27C96', '&.Mui-checked': { color: '#F27C96' } }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {bundle.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#F27C96', fontWeight: 'bold', ml: 2 }}
                      >
                        +${bundle.price}
                      </Typography>
                    </Box>
                  }
                  sx={{ display: 'flex', width: '100%', m: 0 }}
                />

                {/bmb\s+massage/i.test(bundle.name) && (
                  <Box sx={{ mt: 1, ml: 4 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#F27C96', fontWeight: 'bold', mb: 1 }}
                    >
                      Postnatal Massage Benefits:
                    </Typography>
                    <Box
                      component="ul"
                      sx={{
                        m: 0,
                        pl: 2,
                        listStyleType: 'disc',
                        listStylePosition: 'outside',
                        '& li': {
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          mb: 0.5,
                          display: 'list-item',
                          ml: 1,
                        },
                      }}
                    >
                      <li>Relieve neck and shoulder pain from carrying and breastfeeding baby</li>
                      <li>Help to restore the uterus to its original state</li>
                      <li>Help to eliminate excess body fluids and reduces fluid retention</li>
                      <li>Help in weight loss</li>
                      <li>Increase blood circulation</li>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Date Selection */}
        <Box sx={{ mt: 3 }}>
          <FormLabel
            component="legend"
            sx={{
              mb: 2,
              display: 'block',
              color: 'text.primary',
              fontSize: '1rem',
              fontWeight: 'medium',
            }}
          >
            Select Date{' '}
            <Typography component="span" sx={{ color: 'error.main' }}>
              *
            </Typography>
          </FormLabel>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <FormLabel component="legend">Date Type</FormLabel>
            <RadioGroup value={dateType} onChange={handleDateTypeChange}>
              <FormControlLabel
                value="confirmed"
                control={<Radio />}
                label="Confirmed Start Date"
              />
              {!isTrialMeal && <FormControlLabel value="edd" control={<Radio />} label="E.D.D" />}
            </RadioGroup>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={`${dateType === 'confirmed' ? 'Confirmed Date' : 'E.D.D Date'} *`}
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={handleDateChange}
              shouldDisableDate={shouldDisableDate}
              slotProps={{
                textField: {
                  sx: {
                    width: { xs: '100%', md: '50%' },
                    mt: 2,
                  },
                  error: !!dateError,
                  helperText: dateError,
                },
                day: {
                  sx: {
                    // Disable all transitions and animations
                    transition: 'none !important',
                    animation: 'none !important',
                    // Selected date: primary color background, no transitions
                    '&.Mui-selected': {
                      backgroundColor: '#F27C96 !important',
                      color: 'white !important',
                      transition: 'none !important',
                      animation: 'none !important',
                    },
                    // No hover effects on selected
                    '&.Mui-selected:hover': {
                      backgroundColor: '#F27C96 !important',
                      transition: 'none !important',
                    },
                    // No focus effects on selected
                    '&.Mui-selected:focus': {
                      backgroundColor: '#F27C96 !important',
                      transition: 'none !important',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* Start With Options - Only show for confirmed dates */}
        {dateType === 'confirmed' && (
          <FormControl component="fieldset" sx={{ mt: 3 }}>
            <FormLabel component="legend">Start With:</FormLabel>
            <RadioGroup value={startWith} onChange={handleStartWithChange}>
              <FormControlLabel value="lunch" control={<Radio />} label="Lunch" />
              <FormControlLabel value="dinner" control={<Radio />} label="Dinner" />
            </RadioGroup>
          </FormControl>
        )}
      </CardContent>
    </Card>
  );
}
