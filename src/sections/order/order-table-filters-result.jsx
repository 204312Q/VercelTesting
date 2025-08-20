import { useCallback, useMemo } from 'react';

import Chip from '@mui/material/Chip';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

/**
 * OrderTableFiltersResult Component
 * 
 * Displays active filters as removable chips above the orders table
 * Shows current filter state and allows users to remove individual filters
 * Only displays when filters are active (non-default values)
 * 
 * Props:
 * @param {Object} filters - Filter state object from useSetState hook
 * @param {number} totalResults - Total number of filtered results
 * @param {Function} onResetPage - Callback to reset pagination to first page
 * @param {Object} sx - Additional styling props
 * 
 * Expected filter state structure:
 * {
 *   name: string,           // Search keyword (order ID, customer, email)
 *   orderStatus: string,    // Current order status filter ('unfulfilled' is default)
 *   paymentStatus: string,  // Current payment status filter ('' is default)
 *   startDate: Date|null,   // Start date for date range filter
 *   endDate: Date|null      // End date for date range filter (currently unused)
 * }
 */
export function OrderTableFiltersResult({ filters, totalResults, onResetPage, sx }) {
  // ----------------------------------------------------------------------
  // HOOKS
  // ----------------------------------------------------------------------

  /**
   * Destructure filter state and actions from useSetState hook
   */
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  // ----------------------------------------------------------------------
  // INDIVIDUAL FILTER REMOVAL HANDLERS
  // Each handler resets pagination and removes a specific filter
  // ----------------------------------------------------------------------

  /**
   * Remove search keyword filter
   * Clears the search input and shows all orders (with other filters still active)
   */
  const handleRemoveKeyword = useCallback(() => {
    onResetPage(); // Reset to first page when filter changes
    updateFilters({ name: '' });
  }, [onResetPage, updateFilters]);

  /**
   * Remove order status filter
   * Resets to default 'unfulfilled' status (not 'all' to maintain business logic)
   */
  const handleRemoveOrderStatus = useCallback(() => {
    onResetPage(); // Reset to first page when filter changes
    updateFilters({ orderStatus: 'unfulfilled' }); // Reset to default, not 'all'
  }, [onResetPage, updateFilters]);

  /**
   * Remove payment status filter
   * Resets to empty string which shows all payment statuses
   */
  const handleRemovePaymentStatus = useCallback(() => {
    onResetPage(); // Reset to first page when filter changes
    updateFilters({ paymentStatus: '' }); // Reset to "All Payments"
  }, [onResetPage, updateFilters]);

  /**
   * Remove date range filter
   * Clears both start and end dates (currently only startDate is used)
   */
  const handleRemoveDate = useCallback(() => {
    onResetPage(); // Reset to first page when filter changes
    updateFilters({ startDate: null, endDate: null });
  }, [onResetPage, updateFilters]);

  /**
   * Reset all filters to default state
   * Returns to showing unfulfilled orders with no other filters
   */
  const handleReset = useCallback(() => {
    onResetPage(); // Reset to first page
    resetFilters(); // Clear all filters to default state
  }, [onResetPage, resetFilters]);

  // ----------------------------------------------------------------------
  // COMPUTED VALUES - Memoized for performance
  // ----------------------------------------------------------------------

  /**
   * Check if date range filter is active
   * Currently only checks startDate since endDate is not implemented
   * Memoized to prevent unnecessary recalculations
   */
  const hasDateFilter = useMemo(() =>
    Boolean(currentFilters.startDate)
    , [currentFilters.startDate]);

  /**
   * Format date range label for display
   * Currently shows single date since endDate is not implemented
   * TODO: Update when date range is fully implemented
   */
  const dateRangeLabel = useMemo(() => {
    if (currentFilters.startDate) {
      // For now, just show start date since endDate is not used
      return currentFilters.startDate.toLocaleDateString();
    }
    return '';
  }, [currentFilters.startDate]);

  // ----------------------------------------------------------------------
  // MAIN RENDER
  // ----------------------------------------------------------------------

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      {/* Order Status Filter Chip - Only show if not default 'unfulfilled' */}
      <FiltersBlock
        label="Order Status:"
        isShow={currentFilters.orderStatus !== 'unfulfilled'}
      >
        <Chip
          {...chipProps}
          label={currentFilters.orderStatus}
          onDelete={handleRemoveOrderStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      {/* Payment Status Filter Chip - Only show if not default (empty) */}
      <FiltersBlock
        label="Payment Status:"
        isShow={!!currentFilters.paymentStatus}
      >
        <Chip
          {...chipProps}
          label={currentFilters.paymentStatus || 'All Payments'}
          onDelete={handleRemovePaymentStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      {/* Date Range Filter Chip - Only show if date is selected */}
      <FiltersBlock
        label="Date:"
        isShow={hasDateFilter}
      >
        <Chip
          {...chipProps}
          label={dateRangeLabel}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      {/* Search Keyword Filter Chip - Only show if search term exists */}
      <FiltersBlock
        label="Keyword:"
        isShow={!!currentFilters.name}
      >
        <Chip
          {...chipProps}
          label={currentFilters.name}
          onDelete={handleRemoveKeyword}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}