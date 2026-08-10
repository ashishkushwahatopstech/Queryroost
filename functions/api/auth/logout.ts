export async function onRequestPost() {
  const headers = new Headers();
  headers.append('Set-Cookie', `seo_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  headers.append('Content-Type', 'application/json');

  return new Response(JSON.stringify({ success: true, message: 'Logged out successfully' }), {
    status: 200,
    headers
  });
}
