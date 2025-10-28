// src/lib/transformers/dynamics.js

/**
 * VERY basic mapper from read model -> Dynamics Sales Order-like shape.
 * Adjust fields to match your actual D365 entity & required lookups.
 * @param {object} read
 */
export function toDynamicsSalesOrder(read) {
  const o = read?.order ?? {};
  const lines = (o.lineItems || []).map((li, idx) => ({
    // Example custom fields. Replace with your D365 schema attributes.
    cp_name: li.productName,
    cp_description: li.option?.label || null,
    cp_quantity: li.quantity,
    cp_unitprice: (li.unitPriceCents ?? 0) / 100,
    cp_linetotal: (li.lineTotalCents ?? 0) / 100,
    cp_lineno: idx + 1,
  }));

  return {
    // Header fields — replace with your org’s attributes
    cp_orderexternalid: String(o.id),            // external reference
    name: `Order ${o.id}`,                       // subject/name
    customeremailaddress: o.customer?.email || '',
    cp_customername: o.customer?.name || '',
    cp_portion: o.portion || null,
    cp_session: o.session || null,
    cp_servicedate: o.serviceDate || null,
    transactioncurrencyid: 'SGD',                // or GUID of currency in D365
    totalamount: (o.pricing?.totalCents ?? 0) / 100,
    cp_totalpaid: (o.pricing?.paidCents ?? 0) / 100,
    cp_totalremaining: (o.pricing?.remainingCents ?? 0) / 100,

    // Lines (associate to header when posting)
    lines,
  };
}
