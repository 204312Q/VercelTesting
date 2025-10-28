//  app/admin/orders/page.jsx
// Admin List page — show both statuses, filter by export status

export const dynamic = 'force-dynamic';

import { prisma } from 'src/server/db';

export default async function Page({ searchParams }) {
  const sp = await searchParams; 
  const exportStatus = sp?.exportStatus || undefined;
  const where = exportStatus ? { export_status: exportStatus } : {};

  const rows = await prisma.orderConfirmation.findMany({
    where,
    orderBy: { updated_at: 'desc' },
    include: {
      order: { 
        select: {
          id: true, 
          status: true, 
          created_at: true, 
          customer: { select: { name: true } },
        },
      },
    },
  });

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Order Confirmations</h1>

      <form className="flex gap-2">
        <label className="text-sm pt-1">Export Status</label>
        <select name="exportStatus" defaultValue={exportStatus ?? '' } className="border px-2 py-1">
          <option value="">All</option>
          <option value="PENDING">PENDING</option>
          <option value="SENT">SENT</option>
          <option value="FAILED">FAILED</option>
        </select>
        <button className="border px-3 py-1">Filter</button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Order</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Order Status</th>
            <th className="p-2">Export Status</th>
            <th className="p-2">Updated</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={6} className="p-4 text-center text-gray-500">No records</td></tr>
          )}

          {rows.map((row) => {
            const o = row.order || {};
            return (
              <tr key={row.order_id} className="border-t">
                <td className="p-2">
                  <a className="text-blue-600 underline" href={`/admin/orders/${row.order_id}`}>
                    #{o.id}
                  </a>
                  <div className="text-gray-500 text-xs">
                    {o.created_at ? new Date(o.created_at).toLocaleString() : '-'}
                  </div>
                </td>
                <td className="p-2">{o.customer?.name ?? '-'}</td>
                <td className="p-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-gray-100">{o.status}</span>
                </td>
                <td className="p-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded ${
                      row.export_status === 'SENT'
                        ? 'bg-green-100'
                        : row.export_status === 'FAILED'
                        ? 'bg-red-100'
                        : 'bg-yellow-100'
                    }`}
                  >
                    {row.export_status}
                  </span>
                </td>
                <td className="p-2">
                  {row.updated_at ? new Date(row.updated_at).toLocaleString() : '-'}
                </td>
                <td className="p-2">
                  <form action={`/api/admin/order-confirmations/${row.order_id}/export`} method="post">
                    <button className="border px-2 py-1">Export to D365</button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
