const logoUrl = 'https://minimal-vercel-testing.vercel.app/logo/logo-single.png';

// Full Payment Confirmation Template
export function fullPaymentConfirmationTemplate(orderPayload) {
  const {
    order = {},
    items = [],
    requests = [],
    notes,
    pricing = {},
    delivery = {},
    customer = {},
    product = {},
    productOption = {}
  } = orderPayload;

  const {
    id: confirmationNo,
    created_at: createdAt,
    input_date: serviceDate,
    input_type: inputType,
    session
  } = order;

  // Format date
  const orderDate = new Date(createdAt).toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Build items array from webhook items structure
  const emailItems = items.map(item => ({
    quantity: item.quantity,
    name: `${item.product?.name || product.name || 'Product'}${item.option?.value ? ` - ${item.option.value}` : ''}`,
    dateSelected: serviceDate || 'TBD',
    gst: `$${(item.price * 0.09 / 1.09).toFixed(2)}`, // 9% GST inclusive
    price: item.price.toFixed(2)
  }));

  // Add base product if no items
  if (emailItems.length === 0 && product.name) {
    emailItems.push({
      quantity: 1,
      name: `${product.name}${productOption.label ? ` - ${productOption.label}` : ''}`,
      dateSelected: serviceDate || 'TBD',
      gst: `$${(productOption.price * 0.09 / 1.09).toFixed(2)}`,
      price: productOption.price.toFixed(2)
    });
  }

  // Format special requests
  const specialRequests = [];
  if (requests?.length > 0) {
    specialRequests.push(...requests.map(req => req.label || req.code || req.value));
  }
  if (notes?.trim()) {
    specialRequests.push(notes.trim());
  }

  // Build delivery address
  const deliveryAddress = `${delivery.address_line || ''}${delivery.floor ? `, #${delivery.floor}` : ''}${delivery.unit ? `-${delivery.unit}` : ''}, Singapore ${delivery.postal_code || ''}`.trim();

  return `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 700px; margin: auto; margin-bottom: 24px; margin-top: 24px;">
    <hr />
    <img src="${logoUrl}" 
           alt="Chilli Padi Confinement Logo" 
           style="height: 80px; width: auto; margin-bottom: 16px; display: block;"
           width="160" 
           height="80" />  
    <div style="margin-bottom: 8px;">
        <div>
          Blk 3015 Bedok North Street 5 #04-19 <br/>
          Shimei East Kitchen <br/>
          Singapore 486350
        </div>
        <div style="float: right; text-align: right;">
          <div>Order Created on ${orderDate}</div>
          <div>Order ID : ${confirmationNo}</div>
          <div>UEN: 200301089E</div>
        </div>
        <div style="clear: both;"></div>
      </div>
      
      <hr />

      <h3 style="margin-bottom: 4px;">Delivery Details</h3>
      <div><strong>Name:</strong> ${delivery.full_name || customer.name || ''}</div>
      <div><strong>Contact:</strong> ${delivery.phone || customer.phone || ''}</div>
      <div><strong>Email:</strong> ${delivery.email || customer.email || ''}</div>
      <div><strong>Address:</strong> ${deliveryAddress}</div>

      <h3 style="margin-top: 24px; margin-bottom: 4px;">Order Details</h3>
      <table width="100%" style="border-collapse: collapse; margin-bottom: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid #222;">
            <th align="left">Quantity</th>
            <th align="left">Item</th>
            <th align="left">GST (Inclusive)</th>
            <th align="left">Price</th>
          </tr>
        </thead>
        <tbody>
          ${emailItems.map(item => `
            <tr>
              <td>${item.quantity} x</td>
              <td>
                <strong>${item.name}</strong> <br/>
                <span style="font-size: 13px;">Date Selected: ${item.dateSelected}</span>
              </td>
              <td>${item.gst}</td>
              <td>$${item.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-bottom: 12px;">
        <strong>Service Type:</strong> ${inputType === 'EDD' ? 'Expected Delivery Date' : 'Confirmed Start Date'}<br/>
        <strong>Session:</strong> ${session ? session.charAt(0).toUpperCase() + session.slice(1).toLowerCase() : 'All Day'}
        ${specialRequests.length > 0 ? `<br/><strong>Special Requests:</strong> ${specialRequests.join('; ')}` : ''}
      </div>

      <h3 style="margin-bottom: 4px;">Payment Details</h3>
      <table width="100%" style="border-collapse: collapse;">
        <tbody>
          <tr>
            <td>Subtotal price:</td>
            <td align="right">$${(pricing.subtotal || 0).toFixed(2)}</td>
          </tr>
          ${pricing.discount > 0 ? `
            <tr>
              <td>Discount:</td>
              <td align="right" style="color: #d32f2f;">-$${(pricing.discount || 0).toFixed(2)}</td>
            </tr>
          ` : ''}
          <tr>
            <td>Total tax (GST 9% inclusive):</td>
            <td align="right">$${((pricing.total || 0) * 0.09 / 1.09).toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; border-top: 2px solid #222;">
            <td>Total price:</td>
            <td align="right">$${(pricing.total || 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      
      <hr />
      <div style="font-size: 13px; margin-top: 12px;">
        If you have any questions, please send an email to 
        <a href="mailto:confinement@chillipadi.com.sg">confinement@chillipadi.com.sg</a>
      </div>
    </div>
  `;
}

// Partial Payment Confirmation Template
export function partialPaymentTemplate(orderPayload) {
  const {
    order = {},
    items = [],
    requests = [],
    notes,
    pricing = {},
    delivery = {},
    customer = {},
    product = {},
    productOption = {}
  } = orderPayload;

  const {
    id: confirmationNo,
    created_at: createdAt,
    input_date: serviceDate,
    input_type: inputType,
    session
  } = order;

  // Format date
  const orderDate = new Date(createdAt).toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Build items array from webhook items structure
  const emailItems = items.map(item => ({
    quantity: item.quantity,
    name: `${item.product?.name || product.name || 'Product'}${item.option?.value ? ` - ${item.option.value}` : ''}`,
    dateSelected: serviceDate || 'TBD',
    gst: `$${(item.price * 0.09 / 1.09).toFixed(2)}`, // 9% GST inclusive
    price: item.price.toFixed(2)
  }));

  // Add base product if no items
  if (emailItems.length === 0 && product.name) {
    emailItems.push({
      quantity: 1,
      name: `${product.name}${productOption.label ? ` - ${productOption.label}` : ''}`,
      dateSelected: serviceDate || 'TBD',
      gst: `$${(productOption.price * 0.09 / 1.09).toFixed(2)}`,
      price: productOption.price.toFixed(2)
    });
  }

  // Format special requests
  const specialRequests = [];
  if (requests?.length > 0) {
    specialRequests.push(...requests.map(req => req.label || req.code || req.value));
  }
  if (notes?.trim()) {
    specialRequests.push(notes.trim());
  }

  // Build delivery address
  const deliveryAddress = `${delivery.address_line || ''}${delivery.floor ? `, #${delivery.floor}` : ''}${delivery.unit ? `-${delivery.unit}` : ''}, Singapore ${delivery.postal_code || ''}`.trim();

  return `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 700px; margin: auto;">
    <hr />   
    <img src="${logoUrl}" 
           alt="Chilli Padi Confinement Logo" 
           style="height: 80px; width: auto; margin-bottom: 16px; display: block;"
           width="160" 
           height="80" />
      <div style="margin-bottom: 8px;">
        <div>
          Blk 3015 Bedok North Street 5 #04-19<br/>
          Shimei East Kitchen<br/>
          Singapore 486350
        </div>
        <div style="float: right; text-align: right;">
          <div>Order Created on ${orderDate}</div>
          <div>Order ID : ${confirmationNo}</div>
          <div>UEN: 200301089E</div>
        </div>
        <div style="clear: both;"></div>
      </div>
      
      <hr />

      <h3 style="margin-bottom: 4px;">Delivery Details</h3>
      <div><strong>Name:</strong> ${delivery.full_name || customer.name || ''}</div>
      <div><strong>Contact:</strong> ${delivery.phone || customer.phone || ''}</div>
      <div><strong>Email:</strong> ${delivery.email || customer.email || ''}</div>
      <div><strong>Address:</strong> ${deliveryAddress}</div>

      <h3 style="margin-top: 24px; margin-bottom: 4px;">Order Details</h3>
      <table width="100%" style="border-collapse: collapse; margin-bottom: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid #222;">
            <th align="left">Quantity</th>
            <th align="left">Item</th>
            <th align="left">GST (Inclusive)</th>
            <th align="left">Price</th>
          </tr>
        </thead>
        <tbody>
          ${emailItems.map(item => `
            <tr>
              <td>${item.quantity} x</td>
              <td>
                <strong>${item.name}</strong><br/>
                <span style="font-size: 13px;">Date Selected: ${item.dateSelected}</span>
              </td>
              <td>${item.gst}</td>
              <td>$${item.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-bottom: 12px;">
        <strong>Service Type:</strong> ${inputType === 'EDD' ? 'Expected Delivery Date' : 'Confirmed Start Date'}<br/>
        <strong>Session:</strong> ${session ? session.charAt(0).toUpperCase() + session.slice(1).toLowerCase() : 'All Day'}
        ${specialRequests.length > 0 ? `<br/><strong>Special Requests:</strong> ${specialRequests.join('; ')}` : ''}
      </div>

      <h3 style="margin-bottom: 4px;">Payment Details</h3>
      <table width="100%" style="border-collapse: collapse;">
        <tbody>
          <tr>
            <td>Subtotal price:</td>
            <td align="right">$${(pricing.subtotal || 0).toFixed(2)}</td>
          </tr>
          ${pricing.discount > 0 ? `
            <tr>
              <td>Discount:</td>
              <td align="right" style="color: #d32f2f;">-$${(pricing.discount || 0).toFixed(2)}</td>
            </tr>
          ` : ''}
          <tr>
            <td>Total tax (GST 9% inclusive):</td>
            <td align="right">$${((pricing.total || 0) * 0.09 / 1.09).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Amount Paid (Deposit):</td>
            <td align="right">$${(pricing.paid || 0).toFixed(2)}</td>
          </tr>
          <tr style="color: #d32f2f; font-weight: bold;">
            <td>Outstanding Balance:</td>
            <td align="right">$${(pricing.remaining || 0).toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; border-top: 2px solid #222;">
            <td>Total price:</td>
            <td align="right">$${(pricing.total || 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      
      <hr />
      <div style="font-size: 13px; margin-top: 12px;">
        If you have any questions, please send an email to 
        <a href="mailto:confinement@chillipadi.com.sg">confinement@chillipadi.com.sg</a>
      </div>
    </div>
  `;
}