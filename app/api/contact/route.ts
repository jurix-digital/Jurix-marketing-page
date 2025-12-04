import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { fullName, phoneNumber, email, occupation, message } =
      await request.json();

    const apiKey = process.env.BREVO_API_KEY || '';
    if (!apiKey) {
      throw new Error('BREVO_API_KEY is not configured');
    }

    const emailData = {
      sender: { 
        name: 'Jurix', 
        email:'hello@jurix.law' 
      },
      to: [{ 
        email: 'hello@jurix.law', 
        name: 'Jurix Inbox' 
      }],
      subject: 'Jurix – New Contact Form Submission',
      htmlContent: `
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Occupation:</strong> ${occupation}</p>
        <p><strong>Message:</strong><br/>${message || '—'}</p>
      `,
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Brevo API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
