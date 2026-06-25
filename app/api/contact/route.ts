import { NextResponse } from 'next/server';
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

export async function POST(request: Request) {
  try {
    const { name, email, phone, category, subject, message, captchaToken } = await request.json();

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

    // Azure Table Storage Configuration
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const tableName = process.env.AZURE_CONTACT_TABLE_NAME || 'contacts';

    if (!accountName || !accountKey) {
      throw new Error('Azure Storage credentials are not configured');
    }

    // Create Table Service Client
    const credential = new AzureNamedKeyCredential(accountName, accountKey);
    const tableClient = new TableClient(
      `https://${accountName}.table.core.windows.net`,
      tableName,
      credential
    );

    // Generate unique partition key and row key
    const timestamp = new Date().toISOString();
    const partitionKey = timestamp.substring(0, 7); // YYYY-MM for monthly partitioning
    const rowKey = `${timestamp}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Create contact entity
    const contactEntity = {
      partitionKey,
      rowKey,
      name,
      email,
      phone,
      category,
      subject,
      message,
      submittedAt: timestamp,
      status: 'new'
    };

    // Insert entity into Azure Table Storage
    await tableClient.createEntity(contactEntity);

    return NextResponse.json({ ok: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
