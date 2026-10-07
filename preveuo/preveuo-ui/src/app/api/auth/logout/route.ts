import { NextResponse } from 'next/server';
import { AuthApiResponse } from '@/types/auth';

export async function POST() {
  const response = NextResponse.json<AuthApiResponse>({
    success: true,
    message: 'Signed out successfully.',
  });

  response.cookies.delete('preveuo_token');
  return response;
}
