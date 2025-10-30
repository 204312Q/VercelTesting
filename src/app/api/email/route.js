import { Resend } from 'resend';

export async function POST(request) {
    console.log('📧 Email API called at:', new Date().toISOString());

    const resend = new Resend(process.env.RESEND_API_KEY);

    let body;
    try {
        body = await request.json();
        console.log('📬 Email request received:', {
            to: body.to,
            subject: body.subject,
            hasHtml: !!body.html,
            htmlLength: body.html?.length,
            hasApiKey: !!process.env.RESEND_API_KEY,
            apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) + '...'
        });
    } catch (error) {
        console.error('❌ Failed to parse request body:', error);
        return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    try {
        console.log('🚀 Calling Resend API...');
        const data = await resend.emails.send({
            from: 'noreply@chillipadi.com.sg',
            to: body.to,
            subject: body.subject,
            html: body.html,
        });

        console.log('✅ Resend response:', {
            success: true,
            data,
            id: data?.id
        });

        return Response.json({ success: true, data });
    } catch (error) {
        console.error('❌ Resend error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        return Response.json({
            success: false,
            error: error.message,
            details: error.stack
        }, { status: 500 });
    }
}