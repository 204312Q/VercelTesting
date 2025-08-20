import { memo } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------
// CONSTANTS - Status color mappings for consistent styling
// ----------------------------------------------------------------------

/**
 * Payment status to color mapping for Label component
 * Backend should ensure payment_status values match these keys
 */
const PAYMENT_STATUS_COLORS = {
  'paid': 'success',
  'Partial': 'info',
  'Pending': 'warning',
  'Full Refund': 'default',
  'Partial Refund': 'default',
};

/**
 * Order status to color mapping for Label component
 * Backend should ensure order_status values match these keys
 */
const ORDER_STATUS_COLORS = {
  'fulfilled': 'success',
  'unfulfilled': 'warning',
  'cancelled': 'error',
};

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

/**
 * OrderTableRow Component
 * 
 * Renders a single order row in the orders table
 * Optimized with React.memo to prevent unnecessary re-renders
 * 
 * Props:
 * @param {Object} row - Order data object from API
 * @param {boolean} selected - Whether this row is selected
 * @param {Function} onSelectRow - Callback when checkbox is clicked
 * @param {string} detailsHref - URL for order details page
 * 
 * Expected row object structure (from API):
 * {
 *   order_id: string,           // Unique order identifier
 *   orderNumber: string,        // Display order number (e.g., "#60115")
 *   customer_name: string,      // Customer full name
 *   email: string,              // Customer email address
 *   payment_status: string,     // One of: 'paid', 'Partial', 'Pending', 'Full Refund', 'Partial Refund'
 *   order_date: string,         // ISO date string
 *   start_type: string,         // Order type (e.g., 'Lunch', 'Dinner')
 *   items_count: number,        // Number of items in order
 *   final_amount: number,       // Total order amount
 *   order_status: string        // One of: 'fulfilled', 'unfulfilled', 'cancelled'
 * }
 */
function OrderTableRowComponent({ row, selected, onSelectRow, detailsHref }) {
  /**
   * Get color for payment status label
   * Falls back to 'default' if status not found in mapping
   */
  const getPaymentStatusColor = () =>
    PAYMENT_STATUS_COLORS[row.payment_status] || 'default';

  /**
   * Get color for order status label
   * Falls back to 'default' if status not found in mapping
   */
  const getOrderStatusColor = () =>
    ORDER_STATUS_COLORS[row.order_status] || 'default';

  return (
    <TableRow hover selected={selected}>
      {/* Selection Checkbox - Fixed width for consistent alignment */}
      <TableCell padding="checkbox" sx={{ width: 48 }}>
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{
            id: `${row.order_id}-checkbox`,
            'aria-label': `${row.order_id} checkbox`,
          }}
        />
      </TableCell>

      {/* Order ID Column - Clickable link to order details */}
      <TableCell sx={{ width: 120 }}>
        <Link
          component={RouterLink}
          href={detailsHref}
          color="inherit"
          underline="always"
          sx={{ fontWeight: 500 }}
        >
          {row.orderNumber}
        </Link>
      </TableCell>

      {/* Customer Information Column - Name and email with text overflow handling */}
      <TableCell sx={{ width: 280 }}>
        <Stack sx={{ typography: 'body2', alignItems: 'flex-start' }}>
          {/* Customer Name */}
          <Box
            component="span"
            sx={{
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}
            title={row.customer_name} // Tooltip for full name on hover
          >
            {row.customer_name}
          </Box>
          {/* Customer Email */}
          <Box
            component="span"
            sx={{
              color: 'text.disabled',
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}
            title={row.email} // Tooltip for full email on hover
          >
            {row.email}
          </Box>
        </Stack>
      </TableCell>

      {/* Payment Status Column - Colored label indicating payment state */}
      <TableCell sx={{ width: 140 }}>
        <Label
          variant="soft"
          color={getPaymentStatusColor()}
        >
          {row.payment_status}
        </Label>
      </TableCell>

      {/* Order Date Column - Date and meal type */}
      <TableCell sx={{ width: 140 }}>
        <ListItemText
          primary={fDate(row.order_date)}
          secondary={row.start_type || 'Lunch'} // Default to 'Lunch' if not provided
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
            color: 'text.secondary'
          }}
        />
      </TableCell>

      {/* Items Count Column - Center aligned number */}
      <TableCell align="center" sx={{ width: 80 }}>
        <Box sx={{ fontWeight: 500 }}>
          {row.items_count}
        </Box>
      </TableCell>

      {/* Total Amount Column - Formatted currency */}
      <TableCell sx={{ width: 120 }}>
        <Box sx={{ fontWeight: 500 }}>
          {fCurrency(row.final_amount)}
        </Box>
      </TableCell>

      {/* Order Status Column - Colored label indicating fulfillment state */}
      <TableCell sx={{ width: 120 }}>
        <Label
          variant="soft"
          color={getOrderStatusColor()}
        >
          {row.order_status}
        </Label>
      </TableCell>

      {/* Actions Column - Reserved for future actions (edit, delete, etc.) */}
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', width: 88 }}>
        {/* TODO: Add action buttons here (edit, delete, view details) */}
        {/* Example:
        <IconButton size="small" onClick={() => onEdit(row.order_id)}>
          <Iconify icon="eva:edit-fill" />
        </IconButton>
        */}
      </TableCell>
    </TableRow>
  );
}

/**
 * Memoized component to prevent unnecessary re-renders
 * Will only re-render if props actually change
 * This is especially important in large tables with many rows
 */
export const OrderTableRow = memo(OrderTableRowComponent);