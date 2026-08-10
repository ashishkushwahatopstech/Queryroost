import { getUserFromSession } from '../_auth';

export async function onRequestGet(context: { request: Request; env: any }) {
  const user = await getUserFromSession(context.request, context.env);
  if (!user) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const adminEmail = context.env.ADMIN_EMAIL || 'ashishkushwaha88643@gmail.com';
  const isAdmin = user.email.toLowerCase() === adminEmail.toLowerCase();

  return new Response(JSON.stringify({
    authenticated: true,
    user: {
      ...user,
      isAdmin,
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
