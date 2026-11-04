import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionUser, COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      );
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      );
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (err) {
    console.error('[Auth Me Error]:', err);
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
