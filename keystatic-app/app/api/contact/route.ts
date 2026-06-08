import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '';

function getRatelimit() {
  const url   = process.env.UPSTASH_REDIS_REST_URL   ?? process.env.kancelaria_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.kancelaria_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'kns:contact',
  });
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
  if (origin !== ALLOWED_ORIGIN) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  if (origin !== ALLOWED_ORIGIN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const headers = corsHeaders(origin);

  // rate limiting — max 5 wysłań na godzinę per IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
  const ratelimit = getRatelimit();
  if (ratelimit) {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Zbyt wiele prób. Proszę spróbować za godzinę lub zadzwonić bezpośrednio.' },
        { status: 429, headers }
      );
    }
  }

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
    await transporter.sendMail({
      from: `"Formularz KNS" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      replyTo: `"${name.trim()}" <${email.trim()}>`,
      subject: `[Formularz] ${topic || 'Zapytanie ze strony'}`,
      text: lines.join('\n'),
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
