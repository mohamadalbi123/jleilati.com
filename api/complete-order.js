const ADMIN_EMAIL = process.env.ORDER_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "saeedjleilati@gmail.com";
const FROM_EMAIL = process.env.ORDER_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "Jleilati <orders@jleilati.com>";

function readJsonBody(request) {
  if (!request.body) return {};
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body);
    } catch (error) {
      return {};
    }
  }
  return request.body;
}

function sendJson(response, statusCode, payload) {
  response.status(statusCode).json(payload);
}

function clean(value, maxLength = 500) {
  return String(value || "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, maxLength);
}

function cleanEmail(value) {
  const email = clean(value, 180).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function money(value) {
  return `${Number(value || 0).toFixed(2)} EUR`;
}

function orderNumber(order) {
  return clean(order?.id, 40) || "unknown";
}

function customerName(order) {
  const customer = order?.customer || {};
  return [customer.firstName, customer.secondName].map((part) => clean(part, 120)).filter(Boolean).join(" ") || "Customer";
}

function orderLines(order) {
  return Array.isArray(order?.lines) ? order.lines : [];
}

function lineName(line) {
  return clean(line.productNameEn || line.productName || line.productId || "Product", 180);
}

function orderText(order) {
  const customer = order.customer || {};
  const totals = order.totals || {};
  const lines = orderLines(order);
  return [
    `Order #${orderNumber(order)}`,
    "",
    "Customer",
    `Name: ${customerName(order)}`,
    `Email: ${clean(customer.email, 180) || "-"}`,
    `Phone: ${clean(customer.phone, 80) || "-"}`,
    `Address: ${clean(customer.address, 500) || "-"}`,
    "",
    "Payment",
    "Status: Paid by Stripe",
    `Stripe session: ${clean(order.payment?.checkoutSession, 120) || "-"}`,
    "",
    "Order details",
    ...lines.map((line) => {
      const qty = Math.max(1, Number(line.quantity) || 1);
      return `- ${lineName(line)} | ${clean(line.weight, 80) || "-"} | qty ${qty} | ${money(line.lineTotal)}`;
    }),
    "",
    `Subtotal: ${money(totals.subtotal)}`,
    `Shipping: ${money(totals.shipping)}`,
    `Total paid: ${money(totals.total)}`,
    "",
    "Manual shipping note",
    "Prepare this order, print this PDF if needed, then deposit the parcel manually at the shipping center.",
  ].join("\n");
}

function htmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function orderHtml(order, { admin = false } = {}) {
  const customer = order.customer || {};
  const totals = order.totals || {};
  const lines = orderLines(order);
  const rows = lines
    .map((line) => {
      const qty = Math.max(1, Number(line.quantity) || 1);
      return `
        <tr>
          <td>${htmlEscape(lineName(line))}</td>
          <td>${htmlEscape(line.weight || "-")}</td>
          <td>${qty}</td>
          <td>${htmlEscape(money(line.lineTotal))}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;max-width:760px">
      <h2 style="margin:0 0 10px">Jleilati order #${htmlEscape(orderNumber(order))}</h2>
      <p style="margin:0 0 18px">${admin ? "Paid order received. Prepare this order for manual shipping." : "Thank you for your order. We have received your payment and started preparing your order."}</p>
      <h3 style="margin:18px 0 8px">Customer</h3>
      <p style="margin:0">
        <strong>${htmlEscape(customerName(order))}</strong><br>
        ${htmlEscape(customer.email || "-")}<br>
        ${htmlEscape(customer.phone || "-")}<br>
        ${htmlEscape(customer.address || "-")}
      </p>
      <h3 style="margin:18px 0 8px">Order details</h3>
      <table style="width:100%;border-collapse:collapse" cellpadding="8">
        <thead>
          <tr style="background:#f4efe4;text-align:left">
            <th>Product</th><th>Size</th><th>Qty</th><th>Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:18px 0 0">
        Subtotal: ${htmlEscape(money(totals.subtotal))}<br>
        Shipping: ${htmlEscape(money(totals.shipping))}<br>
        <strong>Total paid: ${htmlEscape(money(totals.total))}</strong>
      </p>
    </div>
  `;
}

function pdfSafe(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/€/g, "EUR")
    .replace(/[^\x20-\x7e]/g, "")
    .replace(/[()\\]/g, "\\$&");
}

function wrapLine(value, maxLength = 92) {
  const words = pdfSafe(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function createOrderPdf(order) {
  const textLines = orderText(order).flatMap((line) => wrapLine(line));
  const content = ["BT", "/F1 10 Tf", "50 790 Td", "14 TL"];
  textLines.slice(0, 52).forEach((line, index) => {
    if (index > 0) content.push("T*");
    content.push(`(${pdfSafe(line)}) Tj`);
  });
  content.push("ET");
  const stream = content.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "binary"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "binary");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "binary");
}

async function verifyStripeSession(sessionId, orderId) {
  const secretKey =
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_SECRET ||
    process.env.STRIPE_SK ||
    process.env.STRIPE_PRIVATE_KEY ||
    "";

  if (!secretKey) throw new Error("Stripe secret key is not configured.");
  if (!sessionId) throw new Error("Missing Stripe session.");

  const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const session = await stripeResponse.json().catch(() => ({}));
  if (!stripeResponse.ok) throw new Error(session.error?.message || "Could not verify Stripe payment.");
  if (session.payment_status !== "paid") throw new Error("Stripe payment is not marked as paid yet.");
  if (orderId && session.metadata?.order_id && String(session.metadata.order_id) !== String(orderId)) {
    throw new Error("Stripe session does not match this order.");
  }
  return session;
}

async function sendEmail(payload) {
  if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY environment variable.");
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await resendResponse.json().catch(() => ({}));
  if (!resendResponse.ok) throw new Error(data.message || "Email could not be sent.");
  return data;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { ok: false, message: "Method not allowed." });
  }

  try {
    const body = readJsonBody(request);
    const order = body.order || {};
    const orderId = orderNumber(order);
    const sessionId = clean(body.sessionId || order.payment?.checkoutSession, 160);
    const customerEmail = cleanEmail(order.customer?.email);

    await verifyStripeSession(sessionId, orderId);

    const pdf = createOrderPdf({
      ...order,
      payment: { ...(order.payment || {}), checkoutSession: sessionId },
    });
    const subject = `Jleilati order #${orderId} paid`;
    const pdfAttachment = {
      filename: `order-${orderId}.pdf`,
      content: pdf.toString("base64"),
    };

    if (customerEmail) {
      await sendEmail({
        from: FROM_EMAIL,
        to: customerEmail,
        subject: `Thank you for your order #${orderId}`,
        text: `Thank you for your order #${orderId}.\n\nWe have received your payment and started preparing your order.\n\n${orderText(order)}`,
        html: orderHtml(order),
      });
    }

    await sendEmail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      reply_to: customerEmail || undefined,
      subject,
      text: orderText(order),
      html: orderHtml(order, { admin: true }),
      attachments: [pdfAttachment],
    });

    return sendJson(response, 200, { ok: true, orderId });
  } catch (error) {
    return sendJson(response, 400, { ok: false, message: error.message || "Order email failed." });
  }
}
