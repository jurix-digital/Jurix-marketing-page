import { NextResponse } from 'next/server';
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

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

    // Azure Table Storage Configuration
    // Demo requests are stored in the same table as contacts by default, but
    // are distinguished by the `formType` field. Optionally override the table
    // via AZURE_DEMO_TABLE_NAME.
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const tableName =
      process.env.AZURE_DEMO_TABLE_NAME ||
      process.env.AZURE_CONTACT_TABLE_NAME ||
      'contacts';

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

    // Create lawyer demo entity (differentiated via formType)
    const demoEntity = {
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
    };

    // Insert entity into Azure Table Storage
    await tableClient.createEntity(demoEntity);

    return NextResponse.json({ ok: true, message: 'Demo request submitted successfully' });
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
