import type { APIRoute } from 'astro';

export const prerender = false;

const resendApiUrl = 'https://api.resend.com/emails';

const parseMultipartBody = (raw: string, contentType: string) => {
  const dict: Record<string, string> = {};
  const boundaryMatch = contentType.match(/boundary=([^;]+)/i);
  if (!boundaryMatch?.[1]) return dict;

  const boundary = boundaryMatch[1].trim().replace(/^"|"$/g, '');
  const parts = raw.split(`--${boundary}`);

  for (const part of parts) {
    const normalized = part.trim();
    if (!normalized || normalized === '--') continue;

    const nameMatch = normalized.match(/name="([^"]+)"/i);
    if (!nameMatch?.[1]) continue;

    const key = nameMatch[1].trim().toLowerCase();
    const splitIndex = normalized.indexOf('\r\n\r\n') >= 0
      ? normalized.indexOf('\r\n\r\n')
      : normalized.indexOf('\n\n');

    if (splitIndex === -1) continue;
    const rawValue = normalized.slice(splitIndex).replace(/^\r?\n\r?\n/, '');
    const value = rawValue.replace(/\r?\n$/, '').trim();
    dict[key] = value;
  }

  return dict;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') ?? '';

    let nombre = '';
    let correo = '';
    let empresa = '';
    let mensaje = '';
    let website = '';

    if (contentType.includes('multipart/form-data')) {
      const raw = await request.text();
      const dict = parseMultipartBody(raw, contentType);
      website = String(dict.website ?? '').trim();
      nombre = String(dict.nombre ?? '').trim();
      correo = String(dict.correo ?? '').trim();
      empresa = String(dict.empresa ?? '').trim();
      mensaje = String(dict.mensaje ?? '').trim();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const raw = await request.text();
      const params = new URLSearchParams(raw);
      website = String(params.get('website') ?? '').trim();
      nombre = String(params.get('nombre') ?? '').trim();
      correo = String(params.get('correo') ?? '').trim();
      empresa = String(params.get('empresa') ?? '').trim();
      mensaje = String(params.get('mensaje') ?? '').trim();
    } else if (contentType.includes('application/json')) {
      const body = (await request.json()) as Record<string, unknown>;
      website = String(body.website ?? '').trim();
      nombre = String(body.nombre ?? '').trim();
      correo = String(body.correo ?? '').trim();
      empresa = String(body.empresa ?? '').trim();
      mensaje = String(body.mensaje ?? '').trim();
    } else {
      // Fallback robusto para text/plain u otros tipos inesperados.
      const raw = await request.text();
      const params = new URLSearchParams(raw);

      if (params.size > 0) {
        website = String(params.get('website') ?? '').trim();
        nombre = String(params.get('nombre') ?? '').trim();
        correo = String(params.get('correo') ?? '').trim();
        empresa = String(params.get('empresa') ?? '').trim();
        mensaje = String(params.get('mensaje') ?? '').trim();
      } else {
        // Intenta formato "clave: valor" por línea
        const lines = raw.split(/\r?\n/);
        const dict: Record<string, string> = {};
        for (const line of lines) {
          const [key, ...rest] = line.split(':');
          if (!key || rest.length === 0) continue;
          dict[key.trim().toLowerCase()] = rest.join(':').trim();
        }

        // Fallback para formato alternado por líneas:
        // nombre\nAlejandro\ncorreo\na@b.com...
        if (Object.keys(dict).length === 0) {
          for (let i = 0; i < lines.length - 1; i += 2) {
            const key = lines[i]?.trim().toLowerCase();
            const value = lines[i + 1]?.trim();
            if (!key) continue;
            dict[key] = value ?? '';
          }
        }

        website = dict.website ?? '';
        nombre = dict.nombre ?? '';
        correo = dict.correo ?? '';
        empresa = dict.empresa ?? '';
        mensaje = dict.mensaje ?? '';
      }
    }

    if (website) {
      // Honeypot anti-spam: respond as success to avoid bot feedback.
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    if (!nombre || !correo || !mensaje) {
      return new Response(
        JSON.stringify({ error: 'Completá nombre, correo electrónico y mensaje.' }),
        { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
      );
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const fromEmail = import.meta.env.CONTACT_FROM_EMAIL;
    const toEmail = import.meta.env.CONTACT_TO_EMAIL ?? 'contacto@xendar.com.ar';

    const missing: string[] = [];
    if (!resendApiKey) missing.push('RESEND_API_KEY');
    if (!fromEmail) missing.push('CONTACT_FROM_EMAIL');

    if (missing.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Falta configuración del servidor: ${missing.join(', ')}`,
        }),
        { status: 503, headers: { 'content-type': 'application/json; charset=utf-8' } }
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
      const resendBody = await resendResponse.text();
      let resendMessage = resendBody;
      try {
        const parsed = JSON.parse(resendBody) as { message?: string; error?: string };
        resendMessage = parsed.message || parsed.error || resendBody;
      } catch {
        // keep raw text as fallback
      }
      return new Response(
        JSON.stringify({ error: resendMessage, detail: resendMessage }),
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
