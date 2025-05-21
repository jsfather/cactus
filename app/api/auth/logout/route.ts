import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();

  // Clear the authentication cookie
  cookieStore.delete('token');

  return NextResponse.json({ success: true });
}
