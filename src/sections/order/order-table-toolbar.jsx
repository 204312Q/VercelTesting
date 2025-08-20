import { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

/**
 * OrderTableToolbar Component
 * 
 * Provides filtering, searching, and reset controls for the orders table
 * Handles all user interactions for data filtering
 * 
 * Props:
 * @param {Object} filters - Filter state object from useSetState hook
 * @param {Function} onResetPage - Callback to reset pagination to first page
 * @param {boolean} dateError - Whether date picker has validation error
 * @param {Array} paymentOptions - Payment status filter options
 * @param {Array} orderStatusOptions - Order status filter options
 * 
 * Expected filter state structure:
 * {
 *   name: string,           // Search term for order ID, customer, email
 *   orderStatus: string,    // Current order status filter
 *   paymentStatus: string,  // Current payment status filter  
 *   startDate: Date|null    // Date filter for orders after this date
 * }
 * 
 * Expected option array structure:
 * [
 *   { value: string, label: string },
 *   ...
 * ]
 */
export function OrderTableToolbar({
  filters,
  onResetPage,
  dateError,
  paymentOptions = [],
  orderStatusOptions = []
}) {
  // ----------------------------------------------------------------------
  // HOOKS
  // ----------------------------------------------------------------------

  /**
   * Destructure filter state and actions from useSetState hook
   */
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  // ----------------------------------------------------------------------
  // FILTER HANDLERS - Each resets pagination and updates specific filter
  // ----------------------------------------------------------------------

  /**
   * Handle search input changes
   * Searches across order ID, order number, customer name, and email
   */
  const handleFilterName = useCallback(
    (event) => {
      onResetPage(); // Reset to first page when search changes
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  /**
   * Handle date filter changes
   * Stores ISO string for API filtering
   */
  const handleFilterStartDate = useCallback(
    (newValue) => {
      onResetPage(); // Reset to first page when date changes

      if (newValue) {
        // Use YYYY-MM-DD string for API filtering (removes time zone issues)
        const dateString = dayjs(newValue).format('YYYY-MM-DD');
        updateFilters({
          startDate: newValue,
          startDateString: dateString,
        });
      } else {
        updateFilters({
          startDate: null,
          startDateString: null,
        });
      }
    },
    [onResetPage, updateFilters]
  );

  /**
   * Handle payment status filter changes
   * Filters orders by payment status (paid, pending, refund, etc.)
   */
  const handleFilterPaymentStatus = useCallback(
    (event) => {
      onResetPage(); // Reset to first page when filter changes
      updateFilters({ paymentStatus: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  /**
   * Handle order status filter changes  
   * Filters orders by fulfillment status (fulfilled, unfulfilled, cancelled)
   */
  const handleFilterOrderStatus = useCallback(
    (event) => {
      onResetPage(); // Reset to first page when filter changes
      updateFilters({ orderStatus: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  /**
   * Reset all filters to default state
   * Returns to showing unfulfilled orders with no other filters
   */
  const handleReset = useCallback(() => {
    onResetPage(); // Reset to first page
    resetFilters(); // Clear all filters
  }, [onResetPage, resetFilters]);

  // ----------------------------------------------------------------------
  // COMPUTED VALUES - Memoized for performance
  // ----------------------------------------------------------------------

  /**
   * Check if any non-default filters are active
   * Determines whether to show the reset button
   * Memoized to prevent unnecessary recalculations
   */
  const hasFilters = useMemo(() =>
    !!currentFilters.name ||
    currentFilters.orderStatus !== 'unfulfilled' ||
    !!currentFilters.paymentStatus ||
    !!currentFilters.startDateString  // Check the string version
    , [currentFilters]);

  // ----------------------------------------------------------------------
  // MAIN RENDER
  // ----------------------------------------------------------------------

  return (
    <Box
      sx={{
        p: 2.5,
        gap: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-end', md: 'center' },
      }}
    >
      {/* Date Filter - Filters orders created on or after selected date */}
      <DatePicker
        label="Start date"
        value={currentFilters.startDate}
        onChange={handleFilterStartDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: dateError,
          }
        }}
        sx={{ maxWidth: { md: 200 } }}
      />

      {/* Payment Status Filter - Dropdown with all payment status options */}
      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel>Payment Status</InputLabel>
        <Select
          value={currentFilters.paymentStatus}
          label="Payment Status"
          onChange={handleFilterPaymentStatus}
        >
          {paymentOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Order Status Filter - Dropdown with fulfillment status options */}
      <FormControl sx={{ minWidth: 140 }}>
        <InputLabel>Order Status</InputLabel>
        <Select
          value={currentFilters.orderStatus}
          label="Order Status"
          onChange={handleFilterOrderStatus}
        >
          {orderStatusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Search and Reset Section - Flexible layout with proper spacing */}
      <Box
        sx={{
          gap: 2,
          width: 1,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          pr: { xs: 0, md: 2.5 }, // Add proper right padding for desktop
        }}
      >
        {/* Search Input - Searches across multiple fields */}
        <TextField
          fullWidth
          value={currentFilters.name}
          onChange={handleFilterName}
          placeholder="Search by order ID, order number, customer name, email..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Reset Button - Only shown when filters are active */}
        {hasFilters && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleReset}
            startIcon={<Iconify icon="eva:refresh-fill" />}
            sx={{ minWidth: 120, flexShrink: 0 }}
          >
            Reset
          </Button>
        )}
      </Box>
    </Box>
  );
}