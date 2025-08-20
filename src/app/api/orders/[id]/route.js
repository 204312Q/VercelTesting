import { NextResponse } from 'next/server';
import { _orders } from 'src/_mock';

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

/**
 * Validate order ID parameter
 * @param {string} id - Order ID to validate
 * @returns {Object} Validation result
 */
const validateOrderId = (id) => {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: 'Order ID is required' };
  }

  if (id.trim().length === 0) {
    return { valid: false, error: 'Order ID cannot be empty' };
  }

  return { valid: true };
};

/**
 * Find order by ID in the mock data
 * @param {string} orderId - Order ID to find
 * @returns {Object|null} Found order or null
 */
const findOrderById = (orderId) => {
  return _orders.find(order => order.order_id === orderId);
};

// ----------------------------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------------------------

/**
 * GET /api/orders/[id]
 * 
 * Retrieve a single order by ID
 * Used for order details page
 * 
 * Path Parameters:
 * @param {string} id - Order ID
 * 
 * Response Format:
 * {
 *   success: boolean,
 *   data: Order          // Complete order object
 * }
 * 
 * Error Response:
 * {
 *   success: false,
 *   error: string,
 *   message?: string     // Only in development
 * }
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validate order ID
    const validation = validateOrderId(id);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Find order in mock data
    const order = findOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Log access in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Order ${id} retrieved successfully`);
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order',
        ...(process.env.NODE_ENV === 'development' && {
          message: error.message
        })
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/orders/[id]
 * 
 * Update a single order
 * Used for editing order details
 * 
 * Path Parameters:
 * @param {string} id - Order ID
 * 
 * Request Body:
 * {
 *   order_status?: string,
 *   payment_status?: string,
 *   final_amount?: number,
 *   customer_name?: string,
 *   email?: string,
 *   items_count?: number
 * }
 * 
 * Response: Same as GET
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    // Validate order ID
    const validation = validateOrderId(id);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = findOrderById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const updates = await request.json();

    // Simulate update delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Log update in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Order ${id} updated:`, updates);
    }

    // In real implementation, you would update the database here
    const updatedOrder = { ...order, ...updates };

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update order',
        ...(process.env.NODE_ENV === 'development' && {
          message: error.message
        })
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/orders/[id]
 * 
 * Delete a single order by ID
 * Used for individual order deletion
 * 
 * Path Parameters:
 * @param {string} id - Order ID to delete
 * 
 * Response Format:
 * {
 *   success: boolean,
 *   message: string,
 *   deletedId: string
 * }
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Validate order ID
    const validation = validateOrderId(id);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Simulate deletion delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if order exists
    const orderExists = findOrderById(id);

    if (!orderExists) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Log deletion in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Order ${id} deleted successfully`);
    }

    // In real implementation, you would delete from database here
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
      deletedId: id
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete order',
        ...(process.env.NODE_ENV === 'development' && {
          message: error.message
        })
      },
      { status: 500 }
    );
  }
}