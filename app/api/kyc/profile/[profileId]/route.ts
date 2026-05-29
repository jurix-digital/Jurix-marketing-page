// This file is an API route handler for fetching KYC profile information based on a profile ID.
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  try {
    const { profileId } = await params;
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';

    const response = await fetch(`${backendUrl}/v1/kyc/profile/${profileId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('KYC profile error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
