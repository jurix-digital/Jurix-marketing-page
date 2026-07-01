// This file is an API route handler for submitting KYC information to the backend API.
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const token = String(formData.get('token') || '');
    const rawData = formData.get('data');

    const submitData =typeof rawData === 'string' ? JSON.parse(rawData) : {};

    const profileId = String(formData.get('profileId') || submitData.profileId || '');

    const lawyerProfileId = String(formData.get('lawyerProfileId') ||submitData.lawyerProfileId ||'');

    const backendUrl =
      process.env.BACKEND_API_URL || 'http://localhost:3001';

    const queryParams = {token,profileId,lawyerProfileId,};

    const query = new URLSearchParams(Object.entries(queryParams).filter(([, value]) => value));

    const response = await fetch(
      `${backendUrl}/v1/kyc/submit?${query.toString()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: submitData.notes,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        `Backend API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('KYC submit error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      },
      { status: 500 }
    );
  }
}