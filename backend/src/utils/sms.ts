export async function sendSms(to: string, body: string){
  const sid = process.env.TWILIO_SID;
  const token = process.env.TWILIO_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from) { console.warn('Twilio not configured; skipping SMS'); return { skipped: true }; }
  const twilio = require('twilio')(sid, token);
  await twilio.messages.create({ to, from, body });
  return { ok: true };
}
