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

function orderLanguage(order) {
  const lang = clean(order?.language, 8).toLowerCase();
  return ["ar", "de", "fr", "en"].includes(lang) ? lang : "en";
}

function paidCopy(order) {
  const orderId = orderNumber(order);
  const name = customerName(order);
  const copies = {
    ar: {
      subject: `شكراً لطلبك #${orderId}`,
      lead: `مرحباً ${name}،`,
      body: `شكراً لطلبك من بزورية جليلاتي. تم استلام الدفع وبدأنا تجهيز طلبك.`,
      footer: `سنخبرك عندما يصبح الطلب جاهزاً للشحن.`,
    },
    de: {
      subject: `Danke fuer deine Bestellung #${orderId}`,
      lead: `Hallo ${name},`,
      body: `vielen Dank fuer deine Bestellung bei Jleilati. Wir haben deine Zahlung erhalten und bereiten deine Bestellung jetzt vor.`,
      footer: `Wir melden uns wieder, sobald deine Bestellung vorbereitet ist.`,
    },
    fr: {
      subject: `Merci pour votre commande #${orderId}`,
      lead: `Bonjour ${name},`,
      body: `merci pour votre commande chez Jleilati. Nous avons bien recu votre paiement et nous preparons votre commande.`,
      footer: `Nous vous previendrons des que votre commande sera preparee.`,
    },
    en: {
      subject: `Thank you for your order #${orderId}`,
      lead: `Hello ${name},`,
      body: `Thank you for ordering from Jleilati. We received your payment and started preparing your order.`,
      footer: `We will let you know when your order has been prepared.`,
    },
  };
  return copies[orderLanguage(order)] || copies.en;
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

function customerPaidHtml(order) {
  const copy = paidCopy(order);
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#111;max-width:640px">
      <h2 style="margin:0 0 12px">Jleilati order #${htmlEscape(orderNumber(order))}</h2>
      <p style="margin:0 0 12px">${htmlEscape(copy.lead)}</p>
      <p style="margin:0 0 12px">${htmlEscape(copy.body)}</p>
      <p style="margin:0">${htmlEscape(copy.footer)}</p>
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
  const customer = order.customer || {};
  const totals = order.totals || {};
  const lines = orderLines(order);
  const orderId = orderNumber(order);
  const content = [];
  const pageWidth = 595;
  const margin = 42;
  const width = pageWidth - margin * 2;
  const green = "0.12 0.23 0.17";
  const gold = "0.83 0.65 0.26";
  const light = "0.96 0.93 0.86";
  const lineColor = "0.75 0.70 0.62";

  const rect = (x, y, w, h, mode = "S") => content.push(`${x} ${y} ${w} ${h} re ${mode}`);
  const strokeColor = (color) => content.push(`${color} RG`);
  const fillColor = (color) => content.push(`${color} rg`);
  const text = (value, x, y, size = 10, font = "F1") => {
    content.push(`BT /${font} ${size} Tf ${x} ${y} Td (${pdfSafe(value)}) Tj ET`);
  };
  const wrappedText = (value, x, y, maxLength, options = {}) => {
    const size = options.size || 10;
    const leading = options.leading || size + 4;
    const font = options.font || "F1";
    wrapLine(value, maxLength).slice(0, options.maxLines || 4).forEach((line, index) => {
      text(line, x, y - index * leading, size, font);
    });
  };
  const box = (title, x, y, w, h) => {
    strokeColor(lineColor);
    fillColor("1 0.99 0.96");
    rect(x, y, w, h, "B");
    fillColor(light);
    rect(x, y + h - 24, w, 24, "f");
    fillColor(green);
    text(title, x + 12, y + h - 17, 11, "F2");
  };

  fillColor("1 0.98 0.93");
  rect(0, 0, 595, 842, "f");
  fillColor(green);
  text("Jleilati Spices", margin, 798, 24, "F2");
  fillColor(gold);
  text("Admin order preparation sheet", margin, 776, 11, "F2");
  fillColor("0 0 0");
  text(`Order #${orderId}`, margin, 746, 16, "F2");
  text(`Paid by Stripe`, margin + 170, 746, 11, "F2");
  text(`Total paid: ${money(totals.total)}`, margin + 320, 746, 11, "F2");

  box("Customer details", margin, 634, width, 86);
  fillColor("0 0 0");
  text(`Name: ${customerName(order)}`, margin + 14, 690, 10, "F2");
  text(`Email: ${clean(customer.email, 180) || "-"}`, margin + 14, 674, 10);
  text(`Phone: ${clean(customer.phone, 80) || "-"}`, margin + 270, 674, 10);
  wrappedText(`Address: ${clean(customer.address, 500) || "-"}`, margin + 14, 656, 86, { size: 10, maxLines: 2 });

  box("Order items", margin, 384, width, 226);
  fillColor(green);
  rect(margin + 12, 564, width - 24, 24, "f");
  fillColor("1 1 1");
  text("Product", margin + 22, 571, 9, "F2");
  text("Size", margin + 282, 571, 9, "F2");
  text("Qty", margin + 354, 571, 9, "F2");
  text("Line total", margin + 410, 571, 9, "F2");
  strokeColor(lineColor);
  lines.slice(0, 9).forEach((line, index) => {
    const y = 540 - index * 18;
    fillColor("0 0 0");
    wrappedText(lineName(line), margin + 22, y, 38, { size: 9, maxLines: 1 });
    text(clean(line.weight, 80) || "-", margin + 282, y, 9);
    text(String(Math.max(1, Number(line.quantity) || 1)), margin + 354, y, 9);
    text(money(line.lineTotal), margin + 410, y, 9);
    strokeColor(lineColor);
    content.push(`${margin + 12} ${y - 7} m ${margin + width - 12} ${y - 7} l S`);
  });
  if (lines.length > 9) {
    fillColor("0 0 0");
    text(`+ ${lines.length - 9} more items`, margin + 22, 392, 9, "F2");
  }

  const smallW = (width - 24) / 3;
  box("Payment", margin, 286, smallW, 74);
  box("Totals", margin + smallW + 12, 286, smallW, 74);
  box("Preparation note", margin + smallW * 2 + 24, 286, smallW, 74);
  fillColor("0 0 0");
  text("Status: paid", margin + 12, 326, 10, "F2");
  wrappedText(`Stripe session: ${clean(order.payment?.checkoutSession, 120) || "-"}`, margin + 12, 310, 24, { size: 8, maxLines: 2 });
  text(`Subtotal: ${money(totals.subtotal)}`, margin + smallW + 24, 328, 10);
  text(`Shipping: ${money(totals.shipping)}`, margin + smallW + 24, 312, 10);
  text(`Total: ${money(totals.total)}`, margin + smallW + 24, 296, 10, "F2");
  wrappedText("Prepare, print if needed, then deposit the parcel manually at the shipping center.", margin + smallW * 2 + 36, 328, 24, { size: 9, maxLines: 4 });

  fillColor(gold);
  text("Subject includes the order number. This PDF contains customer, payment, and item details.", margin, 244, 9, "F2");
  const stream = content.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
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
      const copy = paidCopy(order);
      await sendEmail({
        from: FROM_EMAIL,
        to: customerEmail,
        subject: copy.subject,
        text: `${copy.lead}\n\n${copy.body}\n\n${copy.footer}`,
        html: customerPaidHtml(order),
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
