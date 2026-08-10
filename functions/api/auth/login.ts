export async function onRequestGet(context: { request: Request; env: any }) {
  const { env } = context;

  const clientId = env.GOOGLE_CLIENT_ID;
  const url = new URL(context.request.url);
  const redirectUri = env.REDIRECT_URI || `${url.origin}/api/auth/callback`;

  const scopes = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/webmasters.readonly'
  ].join(' ');

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', scopes);
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');
  googleAuthUrl.searchParams.set('state', 'seo_login_state_' + Math.random().toString(36).substring(7));

  return Response.redirect(googleAuthUrl.toString(), 302);
}
