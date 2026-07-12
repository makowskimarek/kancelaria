import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string) {
  return ALLOWED_ORIGINS.includes(origin);
}

function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  if (!isAllowedOrigin(origin)) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const headers = corsHeaders(origin);

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe żądanie.' }, { status: 400, headers });
  }

  const { name, email, phone, topic, message, rodo, _hp } = body;

  // honeypot — bot wypełnił ukryte pole, cicho odrzucamy
  if (_hp) return NextResponse.json({ ok: true }, { headers });

  if (!name?.trim() || !email?.trim() || !message?.trim() || !rodo) {
    return NextResponse.json({ error: 'Brak wymaganych pól.' }, { status: 400, headers });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Nieprawidłowy adres e-mail.' }, { status: 400, headers });
  }

  if (message.trim().length < 10) {
    return NextResponse.json({ error: 'Treść wiadomości jest za krótka.' }, { status: 400, headers });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const lines = [
    `Od: ${name.trim()}`,
    `E-mail: ${email.trim()}`,
    phone?.trim() ? `Telefon: ${phone.trim()}` : null,
    topic ? `Temat: ${topic}` : null,
    '',
    message.trim(),
  ].filter((l): l is string => l !== null);

  try {
    const info = await transporter.sendMail({
      from: `"Formularz KNS" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      replyTo: `"${name.trim()}" <${email.trim()}>`,
      subject: `[Formularz] ${topic || 'Zapytanie ze strony'}`,
      text: lines.join('\n'),
    });
    console.log('SMTP accepted:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
      to: process.env.SMTP_TO,
    });
  } catch (err) {
    console.error('SMTP error:', err);
    return NextResponse.json(
      { error: 'Błąd wysyłki. Proszę spróbować ponownie lub zadzwonić bezpośrednio.' },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ ok: true }, { headers });
}
