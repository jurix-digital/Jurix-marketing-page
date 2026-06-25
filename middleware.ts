import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Serve static index.html for the root path
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/index.html', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
