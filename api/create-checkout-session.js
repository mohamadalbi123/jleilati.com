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

function appendLineItem(params, index, { name, quantity, price }) {
  const unitAmount = Math.max(0, Math.round(Number(price || 0) * 100));
  params.append(`line_items[${index}][quantity]`, String(Math.max(1, Number(quantity) || 1)));
  params.append(`line_items[${index}][price_data][currency]`, "eur");
  params.append(`line_items[${index}][price_data][unit_amount]`, String(unitAmount));
  params.append(`line_items[${index}][price_data][product_data][name]`, String(name || "Jleilati product").slice(0, 120));
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const secretKey =
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_SECRET ||
    process.env.STRIPE_SK ||
    process.env.STRIPE_PRIVATE_KEY ||
    "";

  if (!secretKey) {
    return response.status(500).json({ error: "Stripe secret key is not configured." });
  }

  const body = readJsonBody(request);
  const lines = Array.isArray(body.lines) ? body.lines : [];
  if (!lines.length) {
    return response.status(400).json({ error: "Cart is empty." });
  }

  const origin = request.headers.origin || `https://${request.headers.host}`;
  const orderId = body.orderId ? String(body.orderId) : "";
  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", `${origin}/?payment=success&order=${encodeURIComponent(orderId)}`);
  params.append("cancel_url", `${origin}/?payment=cancelled`);
  if (body.customer?.email) params.append("customer_email", String(body.customer.email));
  params.append("metadata[order_id]", orderId);
  params.append("metadata[source]", "jleilati_web");

  lines.forEach((line, index) => appendLineItem(params, index, line));

  const shipping = Number(body.shipping || 0);
  if (shipping > 0) {
    appendLineItem(params, lines.length, {
      name: "Shipping",
      quantity: 1,
      price: shipping,
    });
  }

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const data = await stripeResponse.json();
  if (!stripeResponse.ok) {
    return response.status(400).json({ error: data.error?.message || "Stripe checkout failed." });
  }

  return response.status(200).json({ id: data.id, url: data.url });
}
