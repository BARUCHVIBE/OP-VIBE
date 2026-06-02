import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Lógica padrão do NextAuth middleware
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);
