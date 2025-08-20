'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { OrderTableRow } from '../order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';

// ----------------------------------------------------------------------
// CONSTANTS
// ----------------------------------------------------------------------

const ORDER_STATUS_OPTIONS = [
  { value: 'unfulfilled', label: 'Unfulfilled' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: '', label: 'All Payments' },
  { value: 'paid', label: 'Paid' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Partial', label: 'Partial' },
  { value: 'Full Refund', label: 'Full Refund' },
  { value: 'Partial Refund', label: 'Partial Refund' },
];

const TABLE_HEAD = [
  { id: 'order_id', label: 'Order', width: 120 },
  { id: 'customer', label: 'Customer', width: 280 },
  { id: 'payment_status', label: 'Payment Status', width: 140 },
  { id: 'order_date', label: 'Start Date', width: 140 },
  { id: 'items_count', label: 'Items', width: 80, align: 'center' },
  { id: 'final_amount', label: 'Total Amount', width: 120 },
  { id: 'order_status', label: 'Order Status', width: 120 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export function OrderListView() {
  const table = useTable({
    defaultOrderBy: 'order_id',
    defaultOrder: 'desc'
  });

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [globalStats, setGlobalStats] = useState({
    total: 0,
    unfulfilled: 0,
    pendingPayments: 0,
  });

  // --- FILTER STATE ---
  const filters = useSetState({
    name: '',
    orderStatus: 'unfulfilled',
    paymentStatus: '',
    startDate: null, // <-- dayjs object or null
  });
  const { state: currentFilters } = filters;

  // --- API FUNCTIONS ---

  const fetchGlobalStats = useCallback(async () => {
    try {
      const response = await fetch('/api/orders/stats');
      if (!response.ok) throw new Error(`Failed to fetch global stats: ${response.status}`);
      const result = await response.json();
      if (result.success) setGlobalStats(result.stats);
      else throw new Error(result.error || 'Failed to fetch global stats');
    } catch (error) {
      setGlobalStats({ total: 0, unfulfilled: 0, pendingPayments: 0 });
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        page: table.page.toString(),
        limit: table.rowsPerPage.toString(),
        status: currentFilters.orderStatus,
        paymentStatus: currentFilters.paymentStatus,
        sortBy: table.orderBy,
        sortOrder: table.order,
        ...(currentFilters.name && { search: currentFilters.name }),
        ...(currentFilters.startDateString && { startDateString: currentFilters.startDateString }),
      });

      const response = await fetch(`/api/orders?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const result = await response.json();
      if (result.success) {
        setTableData(result.data);
        setTotalCount(result.pagination.total);
      } else {
        throw new Error(result.error || 'Failed to fetch orders');
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [table.page, table.rowsPerPage, table.orderBy, table.order, currentFilters]);

  // --- EFFECTS ---

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    table.onResetPage();
  }, [
    currentFilters.orderStatus,
    currentFilters.paymentStatus,
    currentFilters.name,
    currentFilters.startDateString // <-- Use startDateString
  ]);

  // --- MEMOIZED VALUES ---

  const displayStats = useMemo(() => ({
    total: globalStats.total || 0,
    unfulfilled: globalStats.unfulfilled || 0,
    pendingPayments: globalStats.pendingPayments || 0,
  }), [globalStats]);

  const canReset = useMemo(() =>
    !!currentFilters.name ||
    currentFilters.orderStatus !== 'unfulfilled' ||
    !!currentFilters.paymentStatus ||
    !!currentFilters.startDateString,
    [currentFilters]
  );

  const notFound = useMemo(() => !loading && !tableData.length, [loading, tableData.length]);

  // --- LOADING STATE ---

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  // --- MAIN RENDER ---

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Orders"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Order', href: paths.dashboard.order.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.root}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add New Order
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Box sx={{ p: 3, pb: 0 }}>
            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Box>
                <Box sx={{ typography: 'h4' }}>{displayStats.total}</Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>Total Orders</Box>
              </Box>
              <Box>
                <Box sx={{ typography: 'h4', color: 'warning.main' }}>{displayStats.unfulfilled}</Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>Unfulfilled</Box>
              </Box>
              <Box>
                <Box sx={{ typography: 'h4', color: 'info.main' }}>{displayStats.pendingPayments}</Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>Pending Payments</Box>
              </Box>
            </Box>
          </Box>

          <OrderTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            paymentOptions={PAYMENT_STATUS_OPTIONS}
            orderStatusOptions={ORDER_STATUS_OPTIONS}
          />

          <Box sx={{ position: 'relative', width: '100%' }}>
            <Scrollbar sx={{
              minHeight: 444,
              maxHeight: 444,
              height: 444,
            }}>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{
                  width: '100%',
                  minWidth: 1200,
                  tableLayout: 'fixed',
                  '& .MuiTableCell-root': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }
                }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.order_id)
                    )
                  }
                />

                <TableBody>
                  {tableData.map((row) => (
                    <OrderTableRow
                      key={row.order_id}
                      row={row}
                      selected={table.selected.includes(row.order_id)}
                      onSelectRow={() => table.onSelectRow(row.order_id)}
                      detailsHref={paths.dashboard.order.details(row.order_id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={totalCount}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider'
            }}
          />
        </Card>
      </DashboardContent>
    </>
  );
}