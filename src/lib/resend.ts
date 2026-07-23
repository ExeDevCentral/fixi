// Resend Email Helper Service
const resendApiKey = import.meta.env.VITE_RESEND_API_KEY || '';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendResendEmail({ to, subject, html }: SendEmailOptions) {
  if (!resendApiKey) {
    console.warn('VITE_RESEND_API_KEY no está configurado.');
    return { success: false, error: 'API Key missing' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Fixi Marketplace <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Error de Resend API:', data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Excepción al enviar mail con Resend:', err);
    return { success: false, error: err };
  }
}

export async function sendProviderRegistrationEmail(providerData: {
  email: string;
  nombre: string;
  categoria?: string;
  zona?: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; borderRadius: 16px;">
      <h2 style="color: #34d399; margin-bottom: 8px;">¡Bienvenido/a a Fixi Marketplace!</h2>
      <p>Hola <strong>${providerData.nombre}</strong>,</p>
      <p>Tu servicio ha sido publicado con éxito en la plataforma Fixi.</p>
      <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Categoría:</strong> ${providerData.categoria || 'Servicios generales'}</p>
        <p style="margin: 4px 0;"><strong>Zona:</strong> ${providerData.zona || 'Rosario y Región'}</p>
      </div>
      <p>Los clientes de tu zona ahora podrán contactarte por WhatsApp y mensajes internos en Fixi.</p>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">Fixi Marketplace • Conectando profesionales con clientes.</p>
    </div>
  `;

  return sendResendEmail({
    to: providerData.email,
    subject: '¡Tu Servicio fue publicado en Fixi!',
    html,
  });
}

export async function sendSupportTicketEmail(ticketData: {
  usuario_email: string;
  asunto: string;
  categoria: string;
  mensaje: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; borderRadius: 16px;">
      <h2 style="color: #38bdf8; margin-bottom: 8px;">Ticket de Soporte Registrado</h2>
      <p>Hemos recibido tu consulta en Fixi Marketplace:</p>
      <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Categoría:</strong> ${ticketData.categoria}</p>
        <p style="margin: 4px 0;"><strong>Asunto:</strong> ${ticketData.asunto}</p>
        <p style="margin: 4px 0;"><strong>Detalle:</strong> ${ticketData.mensaje}</p>
      </div>
      <p>Nuestro equipo de soporte revisará tu ticket y te responderá en el panel de control.</p>
    </div>
  `;

  return sendResendEmail({
    to: ticketData.usuario_email,
    subject: `Confirmación Ticket Soporte: ${ticketData.asunto}`,
    html,
  });
}

export async function sendNewMessageNotificationEmail(msgData: {
  receptor_email: string;
  emisor_nombre?: string;
  contenido: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; borderRadius: 16px;">
      <h2 style="color: #34d399; margin-bottom: 8px;">Nuevo Mensaje en Fixi</h2>
      <p>Recibiste un nuevo mensaje de <strong>${msgData.emisor_nombre || 'Un usuario'}</strong>:</p>
      <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 16px 0; font-style: italic;">
        "${msgData.contenido}"
      </div>
      <p>Ingresá a tu panel de Fixi para responder.</p>
    </div>
  `;

  return sendResendEmail({
    to: msgData.receptor_email,
    subject: 'Nuevo mensaje recibido en Fixi',
    html,
  });
}
