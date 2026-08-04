import { Resend } from "resend"
import type { OrderItem } from "@/lib/orders"

const FROM_EMAIL = process.env.SALES_EMAIL_FROM || "pedido@lacasadelminero.cl"

/**
 * Devuelve null si RESEND_API_KEY no está configurada, en vez de lanzar: el
 * envío de correos es un efecto secundario best-effort, no debe romper el
 * cambio de estado del pedido mientras el secreto no esté listo.
 */
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

type NotifiableStatus = "confirmado" | "enviado" | "entregado"

type OrderStatusEmailInput = {
  to: string
  customerName: string
  items: OrderItem[]
  total: number
  status: NotifiableStatus
  orderId: string
}

const STATUS_COPY: Record<NotifiableStatus, { subject: string; heading: string; message: string }> = {
  confirmado: {
    subject: "Tu pedido fue confirmado",
    heading: "¡Tu pedido fue confirmado!",
    message: "Ya estamos preparando tu pedido. Te avisaremos apenas salga despachado.",
  },
  enviado: {
    subject: "Tu pedido fue enviado",
    heading: "¡Tu pedido está en camino!",
    message: "Tu pedido ya salió de nuestras bodegas.",
  },
  entregado: {
    subject: "Tu pedido fue entregado",
    heading: "¡Tu pedido fue entregado!",
    message: "Confirmamos la entrega de tu pedido. ¡Gracias por comprar en La Casa del Minero!",
  },
}

export async function sendOrderStatusEmail(input: OrderStatusEmailInput): Promise<void> {
  const resend = getResendClient()
  if (!resend) {
    console.error(`RESEND_API_KEY no configurada: no se envió el correo del pedido ${input.orderId}`)
    return
  }

  const copy = STATUS_COPY[input.status]
  const reference = input.orderId.slice(0, 8)

  const { error } = await resend.emails.send({
    from: `La Casa del Minero <${FROM_EMAIL}>`,
    to: input.to,
    subject: `${copy.subject} — Pedido #${reference}`,
    html: orderStatusEmailHtml({ ...input, copy, reference }),
  })

  if (error) throw new Error(error.message)
}

function orderStatusEmailHtml({
  customerName,
  items,
  total,
  copy,
  reference,
}: OrderStatusEmailInput & {
  copy: { heading: string; message: string }
  reference: string
}): string {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">$${item.price.toLocaleString("es-CL")}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">$${(item.price * item.quantity).toLocaleString("es-CL")}</td>
        </tr>`
    )
    .join("")

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1f2937;">
    <div style="background:#1d4ed8;padding:20px 24px;border-radius:8px 8px 0 0;">
      <span style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:0.05em;">LA CASA DEL MINERO</span>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
      <h1 style="font-size:20px;margin:0 0 8px;">${copy.heading}</h1>
      <p style="margin:0 0 4px;color:#4b5563;">Hola ${escapeHtml(customerName)},</p>
      <p style="margin:0 0 20px;color:#4b5563;">${copy.message}</p>
      <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Pedido #${reference}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr>
            <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #1f2937;">Producto</th>
            <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #1f2937;">Cant.</th>
            <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #1f2937;">Precio</th>
            <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #1f2937;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="text-align:right;margin-top:16px;font-size:16px;font-weight:bold;">
        Total: $${total.toLocaleString("es-CL")}
      </div>
      <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
        Si tienes dudas sobre tu pedido, responde este correo.
      </p>
    </div>
  </div>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
