// Brevo HTTP API email sender — works reliably on Render (no SMTP needed)
const BREVO_API = 'https://api.brevo.com/v3/smtp/email';
const SENDER = { name: 'MediNexus AI', email: process.env.ADMIN_EMAIL || 'mahajanyash2054@gmail.com' };

const sendBrevoEmail = async ({ to, subject, html, text }) => {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) throw new Error('BREVO_API_KEY not set');

    const body = {
        sender: SENDER,
        to: [{ email: to }],
        subject,
        ...(html ? { htmlContent: html } : { textContent: text || '' }),
    };

    const res = await fetch(BREVO_API, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Brevo API error');
    console.log('✅ Brevo email sent:', data.messageId);
    return data;
};

export default sendBrevoEmail;
