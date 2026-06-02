import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

const authMiddleware = withAuth({
  pages: {
    signIn: '/login',
  },
});

export function proxy(request: NextRequest, event: any) {
  return authMiddleware(request as any, event);
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
