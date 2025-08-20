import { NextResponse } from 'next/server';
import { _orders } from 'src/_mock';

// ----------------------------------------------------------------------
// CONSTANTS - Configuration and validation
// ----------------------------------------------------------------------

const MAX_LIMIT = 100;
const DEFAULT_PAGE = 0;
const DEFAULT_LIMIT = 10;

const VALID_SORT_FIELDS = [
  'order_id',
  'customer',
  'customer_name',
  'payment_status',
  'order_date',
  'created_at',
  'final_amount',
  'order_status'
];

const VALID_SORT_ORDERS = ['asc', 'desc'];

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

const validatePagination = (pageParam, limitParam) => {
  const page = Math.max(0, parseInt(pageParam || DEFAULT_PAGE));
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limitParam || DEFAULT_LIMIT)));
  return { page, limit };
};

const validateSorting = (sortBy, sortOrder) => {
  const validSortBy = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : 'order_id';
  const validSortOrder = VALID_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';
  return { sortBy: validSortBy, sortOrder: validSortOrder };
};

const applyStatusFilter = (orders, status) => {
  if (!status || status === 'all') return orders;
  return orders.filter(order => order.order_status === status);
};

const applyPaymentStatusFilter = (orders, paymentStatus) => {
  if (!paymentStatus || paymentStatus === 'all' || paymentStatus === '') {
    return orders;
  }
  return orders.filter(order => order.payment_status === paymentStatus);
};

/**
 * Apply date filter to orders array
 * @param {Array} orders - Orders array to filter
 * @param {string} startDate - ISO date string to filter by (exact date match)
 * @returns {Array} Filtered orders array
 */
const applyDateFilter = (orders, startDate) => {
  if (!startDate) return orders;
  try {
    const filterDateStr = startDate.length > 10 ? startDate.slice(0, 10) : startDate;
    return orders.filter(order => {
      const orderDateStr = order.order_date.length > 10 ? order.order_date.slice(0, 10) : order.order_date;
      // Debug log
      if (process.env.NODE_ENV === 'development') {
        console.log('Comparing:', { orderDateStr, filterDateStr });
      }
      return orderDateStr === filterDateStr;
    });
  } catch (error) {
    return orders;
  }
};

const applySearchFilter = (orders, search) => {
  if (!search) return orders;
  const searchTerm = search.toLowerCase().trim();
  if (!searchTerm) return orders;

  return orders.filter(order => {
    const searchableFields = [
      order.order_id,
      order.orderNumber,
      order.orderNumber?.replace('#', ''),
      order.customer_name,
      order.email,
      order.phone
    ];
    return searchableFields.some(field =>
      field?.toString().toLowerCase().includes(searchTerm)
    );
  });
};

const applySorting = (orders, sortBy, sortOrder) => {
  return [...orders].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'order_id':
        aValue = parseInt(a.order_id.replace(/\D/g, '')) || 0;
        bValue = parseInt(b.order_id.replace(/\D/g, '')) || 0;
        break;
      case 'customer':
      case 'customer_name':
        aValue = a.customer_name?.toLowerCase() || '';
        bValue = b.customer_name?.toLowerCase() || '';
        break;
      case 'payment_status':
        aValue = a.payment_status?.toLowerCase() || '';
        bValue = b.payment_status?.toLowerCase() || '';
        break;
      case 'order_date':
      case 'created_at':
        aValue = new Date(a.order_date || a.created_at);
        bValue = new Date(b.order_date || b.created_at);
        break;
      case 'final_amount':
        aValue = parseFloat(a.final_amount) || 0;
        bValue = parseFloat(b.final_amount) || 0;
        break;
      case 'order_status':
        aValue = a.order_status?.toLowerCase() || '';
        bValue = b.order_status?.toLowerCase() || '';
        break;
      default:
        aValue = parseInt(a.order_id.replace(/\D/g, '')) || 0;
        bValue = parseInt(b.order_id.replace(/\D/g, '')) || 0;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    } else {
      aValue = String(aValue);
      bValue = String(bValue);
      return sortOrder === 'desc'
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    }
  });
};

const calculateGlobalStats = (orders) => ({
  total: orders.length,
  unfulfilled: orders.filter(order => order.order_status === 'unfulfilled').length,
  fulfilled: orders.filter(order => order.order_status === 'fulfilled').length,
  cancelled: orders.filter(order => order.order_status === 'cancelled').length,
  pendingPayments: orders.filter(order => order.payment_status === 'Pending').length,
  paid: orders.filter(order => order.payment_status === 'paid').length,
  partialPayments: orders.filter(order => order.payment_status === 'Partial').length,
  fullRefunds: orders.filter(order => order.payment_status === 'Full Refund').length,
  partialRefunds: orders.filter(order => order.payment_status === 'Partial Refund').length,
});

// ----------------------------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------------------------

export async function GET(request) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const { searchParams } = new URL(request.url);
    const { page, limit } = validatePagination(
      searchParams.get('page'),
      searchParams.get('limit')
    );
    const { sortBy, sortOrder } = validateSorting(
      searchParams.get('sortBy'),
      searchParams.get('sortOrder')
    );

    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const orderType = searchParams.get('orderType');
    const search = searchParams.get('search');
    // Use startDateString if present, otherwise startDate
    const startDate = searchParams.get('startDateString') || searchParams.get('startDate');

    if (process.env.NODE_ENV === 'development') {
      console.log('API called with:', {
        page, limit, status, paymentStatus, orderType, search, startDate, sortBy, sortOrder
      });
    }

    let filteredOrders = [..._orders];

    filteredOrders = applyStatusFilter(filteredOrders, status);
    filteredOrders = applyPaymentStatusFilter(filteredOrders, paymentStatus);
    filteredOrders = applyDateFilter(filteredOrders, startDate);
    filteredOrders = applySearchFilter(filteredOrders, search);

    if (orderType && orderType !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.order_type === orderType);
    }

    filteredOrders = applySorting(filteredOrders, sortBy, sortOrder);

    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    const stats = calculateGlobalStats(_orders);

    const response = {
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit),
      },
      stats
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(`Returning ${paginatedOrders.length} orders (${filteredOrders.length} total filtered)`);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json(
        { success: false, error: 'No order IDs provided' },
        { status: 400 }
      );
    }

    const ids = idsParam.split(',').filter(id => id.trim());

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid order IDs provided' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    if (process.env.NODE_ENV === 'development') {
      console.log(`Deleting orders: ${ids.join(', ')}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${ids.length} order${ids.length === 1 ? '' : 's'}`,
      deletedIds: ids
    });

  } catch (error) {
    console.error('Error in DELETE /api/orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete orders',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
};