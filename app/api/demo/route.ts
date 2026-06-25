import { NextResponse } from 'next/server';
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';
import { buildDemoEmail, sendEmail, NOTIFY_TO } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const {
      name,
      barCouncilNo,
      email,
      mobile,
      city,
      areaOfPractice,
      preferredDateTime,
      captchaToken,
    } = await request.json();

    // Validate reCAPTCHA token
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      throw new Error('RECAPTCHA_SECRET_KEY is not configured');
    }

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${recaptchaSecret}&response=${captchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success) {
      throw new Error('reCAPTCHA validation failed');
    }

    const timestamp = new Date().toISOString();

    // Persist to Azure Table Storage (non-fatal if it fails so we don't lose the lead).
    // Demo requests share the contacts table by default but are tagged via `formType`.
    let tableSaved = false;
    try {
      const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
      const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
      const tableName =
        process.env.AZURE_DEMO_TABLE_NAME ||
        process.env.AZURE_CONTACT_TABLE_NAME ||
        'contacts';

      if (!accountName || !accountKey) {
        throw new Error('Azure Storage credentials are not configured');
      }

      const credential = new AzureNamedKeyCredential(accountName, accountKey);
      const tableClient = new TableClient(
        `https://${accountName}.table.core.windows.net`,
        tableName,
        credential
      );

      const partitionKey = timestamp.substring(0, 7); // YYYY-MM for monthly partitioning
      const rowKey = `${timestamp}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      await tableClient.createEntity({
        partitionKey,
        rowKey,
        formType: 'lawyer-demo',
        name,
        barCouncilNo,
        email,
        mobile,
        city,
        areaOfPractice,
        preferredDateTime,
        submittedAt: timestamp,
        status: 'new',
      });
      tableSaved = true;
    } catch (storageError) {
      console.error('Demo form storage error:', storageError);
    }

    // Always notify the team by email
    let emailSent = false;
    try {
      const { subject: emailSubject, html } = buildDemoEmail({
        name,
        barCouncilNo,
        email,
        mobile,
        city,
        areaOfPractice,
        preferredDateTime,
      });
      await sendEmail({
        to: NOTIFY_TO,
        subject: emailSubject,
        html,
        replyTo: email ? { email, name } : undefined,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Demo form email error:', emailError);
    }

    if (!tableSaved && !emailSent) {
      throw new Error('Failed to record submission and send notification');
    }

    return NextResponse.json({
      ok: true,
      message: 'Demo request submitted successfully',
      tableSaved,
      emailSent,
    });
  } catch (error) {
    console.error('Demo form error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
