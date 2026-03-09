import type { APIRoute } from 'astro';

const resendApiUrl = 'https://api.resend.com/emails';

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const website = String(formData.get('website') ?? '').trim();
    if (website) {
      // Honeypot anti-spam: respond as success to avoid bot feedback.
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    const nombre = String(formData.get('nombre') ?? '').trim();
    const correo = String(formData.get('correo') ?? '').trim();
    const empresa = String(formData.get('empresa') ?? '').trim();
    const mensaje = String(formData.get('mensaje') ?? '').trim();

    if (!nombre || !correo || !mensaje) {
      return new Response(
        JSON.stringify({ error: 'Completá nombre, correo electrónico y mensaje.' }),
        { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
      );
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const fromEmail = import.meta.env.CONTACT_FROM_EMAIL;
    const toEmail = import.meta.env.CONTACT_TO_EMAIL ?? 'contacto@xendar.com.ar';

    if (!resendApiKey || !fromEmail) {
      return new Response(
        JSON.stringify({
          error: 'Falta configuración del servidor de correo (RESEND_API_KEY / CONTACT_FROM_EMAIL).',
        }),
        { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
      );
    }

    const subject = `Nuevo contacto web - ${nombre}`;
    const safeEmpresa = empresa || 'No informada';

    const html = `
      <h2>Nuevo mensaje desde xendar.com.ar</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(correo)}</p>
      <p><strong>Empresa:</strong> ${escapeHtml(safeEmpresa)}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${escapeHtml(mensaje).replaceAll('\n', '<br/>')}</p>
    `;

    const text = [
      'Nuevo mensaje desde xendar.com.ar',
      `Nombre: ${nombre}`,
      `Correo: ${correo}`,
      `Empresa: ${safeEmpresa}`,
      'Mensaje:',
      mensaje,
    ].join('\n');

    const resendResponse = await fetch(resendApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail.split(',').map((value: string) => value.trim()).filter(Boolean),
        reply_to: correo,
        subject,
        html,
        text,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      return new Response(
        JSON.stringify({ error: 'No se pudo enviar el mensaje.', detail: resendError }),
        { status: 502, headers: { 'content-type': 'application/json; charset=utf-8' } }
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Error inesperado al procesar el formulario.',
        detail: error instanceof Error ? error.message : 'unknown',
      }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    );
  }
};

