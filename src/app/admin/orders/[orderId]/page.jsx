// app/admin/orders/[orderId]/page.jsx
export const revalidate = 0;

import { prisma } from 'src/server/db';
import { canonicalize } from 'src/lib/canonical.js';
import { centsKeysToDollars } from 'src/lib/money.js';

export default async function OrderDetails({ params }) {
  const { orderId } = await params; 
  const id = Number(orderId);
  if (!Number.isFinite(id)) {
    return <div className="p-6 text-red-600">Invalid order id</div>;
  }

  const row = await prisma.orderConfirmation.findUnique({
    where: { order_id: id }, // <-- Int, not string
    select: {
      order_id: true,
      payload: true,
      export_status: true,
      updated_at: true,
    },
  });

  if (!row) {
    return <div className="p-6">Order #{id} not found</div>;
  }

  const raw = typeof row?.payload === 'string' ? JSON.parse(row.payload) : row?.payload;
  const canonical = raw ? canonicalize(raw) : null;
  const prettyObj = canonical ? centsKeysToDollars(canonical, { showSymbol: false }) : null;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Order #{row.order_id}</h1>

      <div className="text-sm text-gray-600">
        Export status: <b>{row.export_status}</b> · Updated: {new Date(row.updated_at).toLocaleString()}
      </div>

      <section className="space-y-2">
        <h2 className="font-medium">Snapshot (read model)</h2>
        <pre className="text-xs bg-gray-50 p-3 border rounded overflow-auto">
          {JSON.stringify(prettyObj, null, 2) }
        </pre>
      </section>
    </main>
  );
}
