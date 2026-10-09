const FROM_EMAIL = process.env.ORDER_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "Jleilati <orders@jleilati.com>";
const EMAIL_COLORS = {
  green: "#0b1b12",
  gold: "#d4a642",
  paper: "#fff8eb",
  cream: "#fffdf8",
  ink: "#17130d",
  muted: "#766b58",
  line: "#e6ddcb",
};

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

function orderLanguage(order) {
  const lang = clean(order?.language, 8).toLowerCase();
  return ["ar", "de", "fr", "en"].includes(lang) ? lang : "en";
}

function emailShell({ title, subtitle, body, dir = "ltr" }) {
  const textAlign = dir === "rtl" ? "right" : "left";
  return `
    <div dir="${dir}" style="margin:0;background:${EMAIL_COLORS.paper};padding:24px;font-family:Arial,sans-serif;color:${EMAIL_COLORS.ink};line-height:1.55;text-align:${textAlign}">
      <div style="max-width:680px;margin:0 auto;background:${EMAIL_COLORS.cream};border:1px solid ${EMAIL_COLORS.line};border-radius:14px;overflow:hidden">
        <div style="background:${EMAIL_COLORS.green};padding:22px 24px;color:${EMAIL_COLORS.paper}">
          <div style="color:${EMAIL_COLORS.gold};font-size:22px;font-weight:800;margin-bottom:4px">Jleilati Spices</div>
          <h1 style="font-size:24px;line-height:1.2;margin:0">${htmlEscape(title)}</h1>
          ${subtitle ? `<p style="margin:8px 0 0;color:#efe6d5">${htmlEscape(subtitle)}</p>` : ""}
        </div>
        <div style="padding:24px">
          ${body}
        </div>
      </div>
    </div>
  `;
}

function preparedCopy(lang, orderId, name) {
  const copies = {
    ar: {
      subject: `تم تجهيز طلبك #${orderId}`,
      title: "تم تجهيز طلبك",
      status: "الطلب جاهز",
      lead: `مرحباً ${name}،`,
      body: `تم تجهيز طلبك وسيتم تسليمه للشحن قريباً.`,
      footer: `شكراً لاختيارك بزورية جليلاتي.`,
      text: `مرحباً ${name},\n\nتم تجهيز طلبك #${orderId}. ستستلمه قريباً بعد تسليمه للشحن.\n\nشكراً لاختيارك بزورية جليلاتي.`,
    },
    de: {
      subject: `Deine Bestellung #${orderId} wurde vorbereitet`,
      title: "Deine Bestellung ist vorbereitet",
      status: "Bestellung vorbereitet",
      lead: `Hallo ${name},`,
      body: `deine Bestellung wurde vorbereitet und wird bald an den Versand uebergeben.`,
      footer: `Vielen Dank fuer deine Bestellung bei Jleilati.`,
      text: `Hallo ${name},\n\nDeine Bestellung #${orderId} wurde vorbereitet. Du wirst sie bald erhalten, sobald sie an den Versand uebergeben wurde.\n\nVielen Dank fuer deine Bestellung bei Jleilati.`,
    },
    fr: {
      subject: `Votre commande #${orderId} a ete preparee`,
      title: "Votre commande est preparee",
      status: "Commande preparee",
      lead: `Bonjour ${name},`,
      body: `votre commande a ete preparee et sera bientot remise au service de livraison.`,
      footer: `Merci pour votre commande chez Jleilati.`,
      text: `Bonjour ${name},\n\nVotre commande #${orderId} a ete preparee. Vous la recevrez bientot apres sa remise au service de livraison.\n\nMerci pour votre commande chez Jleilati.`,
    },
    en: {
      subject: `Your order #${orderId} has been prepared`,
      title: "Your order has been prepared",
      status: "Order prepared",
      lead: `Hello ${name},`,
      body: `your order has been prepared and will soon be handed to the shipping center.`,
      footer: `Thank you for ordering from Jleilati.`,
      text: `Hello ${name},\n\nYour order #${orderId} has been prepared. You will receive it soon after it is handed to the shipping center.\n\nThank you for ordering from Jleilati.`,
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
    const lang = orderLanguage(order);
    const copy = preparedCopy(lang, orderId, name);
    const dir = lang === "ar" ? "rtl" : "ltr";
    await sendEmail({
      from: FROM_EMAIL,
      to: email,
      subject: copy.subject,
      text: copy.text,
      html: emailShell({
        title: copy.title,
        subtitle: `#${orderId}`,
        dir,
        body: `
          <p style="margin:0 0 14px">${htmlEscape(copy.lead)}</p>
          <p style="margin:0 0 18px">${htmlEscape(copy.body)}</p>
          <div style="border:1px solid ${EMAIL_COLORS.line};border-radius:12px;padding:16px;background:#ffffff;margin:0 0 18px">
            <div style="display:inline-block;background:${EMAIL_COLORS.gold};color:#050604;border-radius:999px;padding:6px 12px;font-weight:800">${htmlEscape(copy.status)}</div>
          </div>
          <p style="margin:0;color:${EMAIL_COLORS.muted}">${htmlEscape(copy.footer)}</p>
        `,
      }),
    });

    return response.status(200).json({ ok: true, orderId });
  } catch (error) {
    return response.status(400).json({ ok: false, message: error.message || "Prepared email failed." });
  }
}
