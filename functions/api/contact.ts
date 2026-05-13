interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
  FROM_EMAIL: string;
}

/* ---- Rate limiting (in-memory, per isolate) ---- */

const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const LIMIT = 5;
  const WINDOW = 60 * 60 * 1000; // 1 h
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW });
    return false;
  }
  if (entry.count >= LIMIT) return true;
  entry.count++;
  return false;
}

/* ---- Helpers ---- */

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendEmail(apiKey: string, opts: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
}): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      reply_to: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

/* ---- Email templates ---- */

const td   = 'padding:10px 14px;font-size:14px;vertical-align:top';
const tdLb = `${td};color:#5A6A7A;font-weight:500;font-size:12px;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap;width:140px;border-top:1px solid #DDE6F0`;
const tdVl = `${td};color:#1A1A1A;border-top:1px solid #DDE6F0;border-left:1px solid #DDE6F0`;
const tdLb1 = `${td};color:#5A6A7A;font-weight:500;font-size:12px;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap;width:140px;background:#F4F7FB`;
const tdVl1 = `${td};color:#1A1A1A;border-left:1px solid #DDE6F0;background:#F4F7FB;font-weight:500`;

function notificationHtml(d: {
  name: string; email: string; phone?: string; topic: string; message: string;
}): string {
  const phoneRow = d.phone
    ? `<tr><td style="${tdLb}">Telefon</td><td style="${tdVl}"><a href="tel:${esc(d.phone)}" style="color:#2E6DA4;text-decoration:none">${esc(d.phone)}</a></td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><title>Nowe zapytanie</title></head>
<body style="margin:0;padding:40px 0;background:#F4F7FB;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #DDE6F0">

  <div style="background:#0E2236;padding:28px 40px">
    <p style="color:#fff;font-size:18px;font-weight:600;margin:0">KNS Kancelaria Radców Prawnych</p>
    <p style="color:rgba(255,255,255,.65);font-size:13px;margin:6px 0 0">Nowe zapytanie z formularza kontaktowego</p>
  </div>

  <div style="padding:32px 40px 0">
    <p style="color:#5A6A7A;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;margin:0 0 12px">Dane zgłaszającego</p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #DDE6F0">
      <tr>
        <td style="${tdLb1}">Imię i nazwisko</td>
        <td style="${tdVl1}">${esc(d.name)}</td>
      </tr>
      <tr>
        <td style="${tdLb}">E-mail</td>
        <td style="${tdVl}"><a href="mailto:${esc(d.email)}" style="color:#2E6DA4;text-decoration:none">${esc(d.email)}</a></td>
      </tr>
      ${phoneRow}
      <tr>
        <td style="${tdLb}">Temat</td>
        <td style="${tdVl};color:#1A3A5C;font-weight:500">${esc(d.topic)}</td>
      </tr>
    </table>
  </div>

  <div style="padding:24px 40px">
    <hr style="border:none;border-top:1px solid #DDE6F0;margin:0 0 24px">
    <p style="color:#5A6A7A;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;margin:0 0 12px">Treść wiadomości</p>
    <div style="color:#1A1A1A;font-size:14px;line-height:1.8;padding:16px 20px;background:#F4F7FB;border-radius:6px;border:1px solid #DDE6F0;white-space:pre-wrap">${esc(d.message)}</div>
  </div>

  <div style="background:#F4F7FB;padding:16px 40px;border-top:1px solid #DDE6F0;text-align:center">
    <span style="color:#5A6A7A;font-size:12px">Wiadomość wysłana z formularza kontaktowego · kns-kancelaria.pl</span>
  </div>

</div>
</body>
</html>`;
}

function confirmationHtml(d: { name: string; topic: string }): string {
  const topicLine = d.topic
    ? ` w sprawie: <strong style="color:#1A3A5C">${esc(d.topic)}</strong>`
    : '';

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><title>Potwierdzenie zapytania</title></head>
<body style="margin:0;padding:40px 0;background:#F4F7FB;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #DDE6F0">

  <div style="background:#0E2236;padding:28px 40px">
    <p style="color:#fff;font-size:18px;font-weight:600;margin:0">KNS Kancelaria Radców Prawnych</p>
    <p style="color:rgba(255,255,255,.65);font-size:13px;margin:6px 0 0">Potwierdzenie zapytania</p>
  </div>

  <div style="padding:36px 40px 0">
    <h1 style="color:#1A3A5C;font-size:22px;font-weight:600;margin:0 0 20px;line-height:1.3">Szanowni Państwo,<br>dziękujemy za kontakt.</h1>
    <p style="color:#1A1A1A;font-size:15px;line-height:1.8;margin:0 0 16px">
      Potwierdzamy otrzymanie zapytania przesłanego przez <strong>${esc(d.name)}</strong>${topicLine}.
    </p>
    <p style="color:#1A1A1A;font-size:15px;line-height:1.8;margin:0 0 16px">
      Nasz radca prawny zapozna się z Państwa wiadomością i skontaktuje się z Państwem
      w możliwie najkrótszym czasie — zazwyczaj w ciągu 1–2 dni roboczych.
    </p>
    <p style="color:#5A6A7A;font-size:14px;line-height:1.7;margin:0">W pilnych sprawach zapraszamy do kontaktu bezpośredniego:</p>
  </div>

  <div style="padding:20px 40px 0">
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="padding:8px 0;color:#5A6A7A;font-size:13px;width:200px;border-top:1px solid #DDE6F0">r.&nbsp;pr.&nbsp;Marcin&nbsp;Nawrocki</td>
        <td style="padding:8px 0;border-top:1px solid #DDE6F0"><a href="tel:606411109" style="color:#2E6DA4;text-decoration:none;font-size:13px;font-weight:500">606 411 109</a></td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#5A6A7A;font-size:13px;border-top:1px solid #DDE6F0">r.&nbsp;pr.&nbsp;Adam&nbsp;Słania</td>
        <td style="padding:8px 0;border-top:1px solid #DDE6F0"><a href="tel:603176037" style="color:#2E6DA4;text-decoration:none;font-size:13px;font-weight:500">603 176 037</a></td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#5A6A7A;font-size:13px;border-top:1px solid #DDE6F0">E-mail</td>
        <td style="padding:8px 0;border-top:1px solid #DDE6F0"><a href="mailto:sekretariat@ns-radcy.pl" style="color:#2E6DA4;text-decoration:none;font-size:13px">sekretariat@ns-radcy.pl</a></td>
      </tr>
    </table>
  </div>

  <div style="padding:28px 40px">
    <hr style="border:none;border-top:1px solid #DDE6F0;margin:0 0 24px">
    <p style="color:#5A6A7A;font-size:13px;line-height:1.7;margin:0">
      Z poważaniem,<br>
      <strong style="color:#1A3A5C">Zespół KNS Kancelaria Radców Prawnych</strong><br>
      ul. Stanisława Moniuszki 22/105, 42-583 Bytom
    </p>
  </div>

  <div style="background:#F4F7FB;padding:16px 40px;border-top:1px solid #DDE6F0;text-align:center">
    <span style="color:#5A6A7A;font-size:11px;line-height:1.7">
      Ta wiadomość została wysłana automatycznie w odpowiedzi na zapytanie z formularza kontaktowego.<br>
      Radcowie prawni wpisani na listę Okręgowej Izby Radców Prawnych w Katowicach.
    </span>
  </div>

</div>
</body>
</html>`;
}

/* ---- Route handlers ---- */

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204 });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';

  if (isRateLimited(ip)) {
    return jsonResponse({ error: 'Zbyt wiele zapytań. Proszę spróbować za godzinę.' }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: 'Nieprawidłowy format danych.' }, 400);
  }

  const { name, email, phone, topic, message, rodo, _hp } = body;

  // Honeypot
  if (_hp) return jsonResponse({ success: true });

  const nameStr  = String(name  ?? '').trim();
  const emailStr = String(email ?? '').trim();
  const topicStr = String(topic ?? '').trim();
  const msgStr   = String(message ?? '').trim();
  const phoneStr = String(phone ?? '').trim() || undefined;

  const errors: Record<string, string> = {};
  if (!nameStr)
    errors.name = 'Proszę podać imię i nazwisko.';
  if (!emailStr || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr))
    errors.email = 'Proszę podać prawidłowy adres e-mail.';
  if (!topicStr)
    errors.topic = 'Proszę wybrać temat wiadomości.';
  if (msgStr.length < 10)
    errors.message = 'Treść wiadomości musi mieć co najmniej 10 znaków.';
  if (!rodo)
    errors.rodo = 'Wymagana jest zgoda na przetwarzanie danych osobowych.';

  if (Object.keys(errors).length) {
    return jsonResponse({ errors }, 400);
  }

  const { RESEND_API_KEY, CONTACT_EMAIL, FROM_EMAIL } = env;
  if (!RESEND_API_KEY || !CONTACT_EMAIL || !FROM_EMAIL) {
    console.error('Missing env variables');
    return jsonResponse({ error: 'Błąd konfiguracji serwera.' }, 500);
  }

  try {
    await Promise.all([
      sendEmail(RESEND_API_KEY, {
        from: FROM_EMAIL,
        to: CONTACT_EMAIL,
        replyTo: emailStr,
        subject: `Nowe zapytanie: ${topicStr} — ${nameStr}`,
        html: notificationHtml({ name: nameStr, email: emailStr, phone: phoneStr, topic: topicStr, message: msgStr }),
      }),
      sendEmail(RESEND_API_KEY, {
        from: FROM_EMAIL,
        to: emailStr,
        subject: 'Potwierdzenie zapytania — KNS Kancelaria Radców Prawnych',
        html: confirmationHtml({ name: nameStr, topic: topicStr }),
      }),
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return jsonResponse({ error: 'Błąd wysyłania wiadomości. Proszę spróbować ponownie.' }, 500);
  }
};
