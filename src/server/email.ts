import { Resend } from "resend";

import { env } from "~/env";

function getFromAddress(): string {
  const from = env.EMAIL_FROM ?? "HiniBricks <pedidos@hinibricks.cl>";
  if (from.includes("<")) return from;
  return `HiniBricks <${from}>`;
}

function getResendClient(): Resend {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY no configurado");
  }
  return new Resend(env.RESEND_API_KEY);
}

const ADMIN_EMAIL = env.ADMIN_EMAIL ?? "ventas@hinibricks.cl";

type OrderEmailPayload = {
  orderId: number;
  customerName: string;
  customerEmail: string;
  planName: string;
  totalPrice: number;
};

function htmlCustomer({ orderId, customerName, planName, totalPrice }: OrderEmailPayload) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedido confirmado</title>
</head>
<body style="margin:0; padding:0; font-family: system-ui, -apple-system, sans-serif; background:#f3f4f6;">
  <div style="max-width:560px; margin:0 auto; padding:24px;">
    <div style="background:#fff; border-radius:12px; padding:32px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <h1 style="margin:0 0 8px; font-size:24px; color:#1e293b;">¡Hola, ${escapeHtml(customerName)}!</h1>
      <p style="margin:0 0 24px; color:#64748b; font-size:16px;">Tu pedido en HiniBricks ha sido confirmado correctamente.</p>
      <div style="background:#f8fafc; border-radius:8px; padding:20px; margin-bottom:24px;">
        <p style="margin:0 0 8px; font-weight:600; color:#0f172a;">Pedido #${orderId}</p>
        <p style="margin:0 0 4px; color:#475569;">Plan: ${escapeHtml(planName)}</p>
        <p style="margin:0; font-size:20px; font-weight:700; color:#2563eb;">$${totalPrice.toLocaleString("es-CL")}</p>
      </div>
      <p style="margin:0; color:#64748b; font-size:14px;">Nos pondremos en contacto contigo para los siguientes pasos.</p>
      <p style="margin:24px 0 0; color:#94a3b8; font-size:12px;">— El equipo de HiniBricks · hinibricks.cl</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function htmlAdmin({ orderId, customerName, customerEmail, planName, totalPrice }: OrderEmailPayload) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo pedido #${orderId}</title>
</head>
<body style="margin:0; padding:0; font-family: system-ui, -apple-system, sans-serif; background:#f3f4f6;">
  <div style="max-width:560px; margin:0 auto; padding:24px;">
    <div style="background:#fff; border-radius:12px; padding:32px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <h1 style="margin:0 0 8px; font-size:24px; color:#1e293b;">Nuevo pedido #${orderId}</h1>
      <p style="margin:0 0 24px; color:#64748b; font-size:16px;">Se ha registrado un pedido desde hinibricks.cl.</p>
      <div style="background:#f8fafc; border-radius:8px; padding:20px; margin-bottom:24px;">
        <p style="margin:0 0 8px;"><strong>Cliente:</strong> ${escapeHtml(customerName)}</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
        <p style="margin:0 0 8px;"><strong>Plan:</strong> ${escapeHtml(planName)}</p>
        <p style="margin:0; font-size:20px; font-weight:700; color:#2563eb;">Total: $${totalPrice.toLocaleString("es-CL")}</p>
      </div>
      <p style="margin:0; color:#64748b; font-size:14px;">Revisa el panel de administración para más detalles.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendOrderConfirmedEmails(payload: OrderEmailPayload): Promise<{ ok: boolean; error?: string }> {
  if (!env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY no configurado, no se envían correos.");
    return { ok: false, error: "RESEND_API_KEY no configurado" };
  }

  const formatErr = (e: unknown): string =>
    typeof e === "string" ? e : JSON.stringify(e);

  try {
    const resend = getResendClient();
    const from = getFromAddress();

    console.log("[email] Enviando correos para pedido #", payload.orderId);

    const toCustomer = await resend.emails.send({
      from,
      to: payload.customerEmail,
      subject: `Pedido #${payload.orderId} confirmado – HiniBricks`,
      html: htmlCustomer(payload),
    });

    if (toCustomer.error) {
      const errMsg = formatErr(toCustomer.error);
      console.error("[email] Error al enviar correo al cliente:", errMsg);
      return { ok: false, error: errMsg };
    }

    console.log("[email] Correo al cliente enviado:", toCustomer.data?.id);

    const toAdmin = await resend.emails.send({
      from,
      to: ADMIN_EMAIL,
      subject: `Nuevo pedido #${payload.orderId} – ${payload.customerName}`,
      html: htmlAdmin(payload),
    });

    if (toAdmin.error) {
      const errMsg = formatErr(toAdmin.error);
      console.error("[email] Error al enviar correo al admin:", errMsg);
      return { ok: false, error: errMsg };
    }

    console.log("[email] Correo al admin enviado:", toAdmin.data?.id);
    return { ok: true };
  } catch (err) {
    console.error("[email] Error enviando correos:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
