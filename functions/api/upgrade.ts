import { getUserFromSession } from './_auth';

export async function onRequestPost(context: { request: Request; env: any }) {
  const user = await getUserFromSession(context.request, context.env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = context.env.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Database binding missing' }), { status: 500 });
  }

  const body: any = await context.request.json().catch(() => ({}));
  const action = body.action || 'simulate'; // 'simulate' for test upgrade, or 'create_checkout'

  if (action === 'simulate' || action === 'upgrade') {
    // Perform test upgrade in D1
    await db.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = ?')
      .bind('premium', Math.floor(Date.now() / 1000), user.id)
      .run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Plan successfully upgraded to Premium (Payment Stub Executed)',
      plan: 'premium',
      integrationNote: 'To connect a live gateway (Stripe/Razorpay), configure your API key in env and replace functions/api/upgrade.ts with checkout session handler.'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    checkoutUrl: 'https://checkout.stripe.com/pay/cs_test_placeholder_aktech_seo',
    gateway: 'Stripe/Razorpay Integration Stubbed'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
