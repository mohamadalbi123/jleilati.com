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

function htmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function customerName(order) {
  const customer = order?.customer || {};
  return [customer.firstName, customer.secondName].map((part) => clean(part, 120)).filter(Boolean).join(" ") || "Customer";
}

function preparedCopy(lang, orderId, name) {
  const copies = {
    ar: {
      subject: `تم تجهيز طلبك #${orderId}`,
      text: `مرحباً ${name},\n\nتم تجهيز طلبك #${orderId}. ستستلمه قريباً بعد تسليمه للشحن.\n\nشكراً لاختيارك بزورية جليلاتي.`,
      html: `مرحباً ${name},<br><br>تم تجهيز طلبك <strong>#${orderId}</strong>. ستستلمه قريباً بعد تسليمه للشحن.<br><br>شكراً لاختيارك بزورية جليلاتي.`,
    },
    de: {
      subject: `Deine Bestellung #${orderId} wurde vorbereitet`,
      text: `Hallo ${name},\n\nDeine Bestellung #${orderId} wurde vorbereitet. Du wirst sie bald erhalten, sobald sie an den Versand uebergeben wurde.\n\nVielen Dank fuer deine Bestellung bei Jleilati.`,
      html: `Hallo ${name},<br><br>deine Bestellung <strong>#${orderId}</strong> wurde vorbereitet. Du wirst sie bald erhalten, sobald sie an den Versand uebergeben wurde.<br><br>Vielen Dank fuer deine Bestellung bei Jleilati.`,
    },
    fr: {
      subject: `Votre commande #${orderId} a ete preparee`,
      text: `Bonjour ${name},\n\nVotre commande #${orderId} a ete preparee. Vous la recevrez bientot apres sa remise au service de livraison.\n\nMerci pour votre commande chez Jleilati.`,
      html: `Bonjour ${name},<br><br>votre commande <strong>#${orderId}</strong> a ete preparee. Vous la recevrez bientot apres sa remise au service de livraison.<br><br>Merci pour votre commande chez Jleilati.`,
    },
    en: {
      subject: `Your order #${orderId} has been prepared`,
      text: `Hello ${name},\n\nYour order #${orderId} has been prepared. You will receive it soon after it is handed to the shipping center.\n\nThank you for ordering from Jleilati.`,
      html: `Hello ${name},<br><br>Your order <strong>#${orderId}</strong> has been prepared. You will receive it soon after it is handed to the shipping center.<br><br>Thank you for ordering from Jleilati.`,
    },
  };
  return copies[lang] || copies.en;
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
    return response.status(405).json({ ok: false, message: "Method not allowed." });
  }

  try {
    const body = readJsonBody(request);
    const order = body.order || {};
    const orderId = clean(order.id, 40);
    const email = cleanEmail(order.customer?.email);
    if (!orderId || !email) return response.status(400).json({ ok: false, message: "Order email details are missing." });

    const name = customerName(order);
    const copy = preparedCopy(clean(order.language, 8), orderId, name);
    const safeHtml = copy.html.split(name).join(htmlEscape(name)).split(orderId).join(htmlEscape(orderId));
    await sendEmail({
      from: FROM_EMAIL,
      to: email,
      subject: copy.subject,
      text: copy.text,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.55;color:#111;max-width:640px"><h2 style="margin:0 0 12px">Jleilati order #${htmlEscape(orderId)}</h2><p>${safeHtml}</p></div>`,
    });

    return response.status(200).json({ ok: true, orderId });
  } catch (error) {
    return response.status(400).json({ ok: false, message: error.message || "Prepared email failed." });
  }
}
