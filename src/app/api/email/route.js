import { Resend } from 'resend';

export async function POST(request) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();

    try {
        const data = await resend.emails.send({
            from: 'noreply@chillipadi.com.sg',
            to: body.to,
            subject: body.subject,
            html: body.html,
        });
        return Response.json({ success: true, data });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}