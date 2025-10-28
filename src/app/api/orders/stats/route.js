import { NextResponse } from 'next/server';
import { _orders } from 'src/_mock';

// ----------------------------------------------------------------------
// CONSTANTS - Status mappings and configurations
// ----------------------------------------------------------------------

/**
 * Payment status variations that should be treated as "pending"
 * Different case variations to handle inconsistent data
 */
const PENDING_PAYMENT_STATUSES = ['pending', 'Pending', 'unpaid', 'Unpaid'];

/**
 * Payment status variations that should be treated as "paid"
 * Different case variations to handle inconsistent data
 */
const PAID_PAYMENT_STATUSES = ['paid', 'Paid'];

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

/**
 * Calculate comprehensive order statistics from the full orders dataset
 * Always calculates from unfiltered data for global dashboard display
 * @param {Array} orders - Complete orders array
 * @returns {Object} Statistics object with all metrics
 */
const calculateGlobalStatistics = (orders) => {
    const stats = {
        // Order Status Metrics - Core business indicators
        total: orders.length,
        unfulfilled: orders.filter(order => order.order_status === 'unfulfilled').length,
        fulfilled: orders.filter(order => order.order_status === 'fulfilled').length,
        cancelled: orders.filter(order => order.order_status === 'cancelled').length,

        // Payment Status Metrics - Financial indicators
        pendingPayments: orders.filter(order =>
            PENDING_PAYMENT_STATUSES.includes(order.payment_status)
        ).length,

        paid: orders.filter(order =>
            PAID_PAYMENT_STATUSES.includes(order.payment_status)
        ).length,

        partialPayments: orders.filter(order =>
            order.payment_status === 'Partial'
        ).length,

        fullRefunds: orders.filter(order =>
            order.payment_status === 'Full Refund'
        ).length,

        partialRefunds: orders.filter(order =>
            order.payment_status === 'Partial Refund'
        ).length,

        // Additional Metrics - Can be extended for more insights
        averageOrderValue: orders.length > 0
            ? orders.reduce((sum, order) => sum + (parseFloat(order.final_amount) || 0), 0) / orders.length
            : 0,

        totalRevenue: orders
            .filter(order => PAID_PAYMENT_STATUSES.includes(order.payment_status))
            .reduce((sum, order) => sum + (parseFloat(order.final_amount) || 0), 0),
    };

    return stats;
};

/**
 * Validate that orders data is available and properly formatted
 * @param {Array} orders - Orders array to validate
 * @returns {boolean} Whether data is valid
 */
const validateOrdersData = (orders) => {
    if (!Array.isArray(orders)) {
        console.error('Orders data is not an array');
        return false;
    }

    if (orders.length === 0) {
        console.warn('Orders array is empty');
        return true; // Empty is valid, just return zero stats
    }

    return true;
};

// ----------------------------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------------------------

/**
 * GET /api/orders/stats
 * 
 * Retrieve global order statistics (unfiltered)
 * Used for dashboard summary cards and overview metrics
 * Always returns statistics from the complete dataset regardless of any filters
 * 
 * No Query Parameters Required - Always returns global stats
 * 
 * Response Format:
 * {
 *   success: boolean,
 *   stats: {
 *     // Order Status Metrics
 *     total: number,              // Total orders in system
 *     unfulfilled: number,        // Orders pending fulfillment
 *     fulfilled: number,          // Completed orders
 *     cancelled: number,          // Cancelled orders
 *     
 *     // Payment Status Metrics  
 *     pendingPayments: number,    // Orders awaiting payment
 *     paid: number,               // Fully paid orders
 *     partialPayments: number,    // Partially paid orders
 *     fullRefunds: number,        // Orders with full refunds
 *     partialRefunds: number,     // Orders with partial refunds
 *     
 *     // Financial Metrics
 *     averageOrderValue: number,  // Average order amount
 *     totalRevenue: number        // Total paid revenue
 *   }
 * }
 * 
 * Error Response:
 * {
 *   success: false,
 *   error: string,
 *   message?: string            // Only in development
 * }
 */
export async function GET(request) {
    try {
        // Simulate realistic API delay for better UX
        await new Promise(resolve => setTimeout(resolve, 200));

        // Validate orders data availability
        if (!validateOrdersData(_orders)) {
            throw new Error('Invalid orders data structure');
        }

        // Calculate comprehensive global statistics
        const stats = calculateGlobalStatistics(_orders);

        // Log statistics in development for debugging
        if (process.env.NODE_ENV === 'development') {
            console.log('Global Stats (from /api/orders/stats):', {
                total: stats.total,
                unfulfilled: stats.unfulfilled,
                pendingPayments: stats.pendingPayments,
                totalRevenue: stats.totalRevenue
            });
        }

        // Build successful response
        const response = {
            success: true,
            stats
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error fetching global stats:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch global stats',
                // Include detailed error message in development only
                ...(process.env.NODE_ENV === 'development' && {
                    message: error.message
                })
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/orders/stats
 * 
 * Calculate filtered statistics based on provided criteria
 * Useful for getting stats that match current filter state
 * 
 * Request Body:
 * {
 *   filters: {
 *     orderStatus?: string,
 *     paymentStatus?: string,
 *     startDate?: string,
 *     endDate?: string,
 *     search?: string
 *   }
 * }
 * 
 * Response: Same format as GET but with filtered data
 */
export async function POST(request) {
    try {
        // TODO: Implement filtered statistics calculation
        // This would apply the same filters as the main orders endpoint
        // and return statistics for the filtered dataset

        return NextResponse.json(
            {
                success: false,
                error: 'Filtered statistics not yet implemented',
                message: 'Use GET /api/orders/stats for global statistics'
            },
            { status: 501 }
        );

    } catch (error) {
        console.error('Error in POST /api/orders/stats:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to calculate filtered stats',
                ...(process.env.NODE_ENV === 'development' && {
                    message: error.message
                })
            },
            { status: 500 }
        );
    }
}