import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://103.240.147.23:4000';

export async function POST(request: NextRequest) {
    try {
        const incoming = await request.formData();
        // Try both common field names
        const file = incoming.get('image') || incoming.get('file');

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json(
                { success: false, error: 'No image file provided' },
                { status: 400 }
            );
        }

        const outgoing = new FormData();
        outgoing.append('file', file);

        console.log('[upload] Sending file to backend, size:', file.size, 'type:', file.type);

        const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: outgoing,
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            console.error('[upload] Backend error:', res.status, text);
            return NextResponse.json(
                { success: false, error: `Upload failed: ${res.status} ${text}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({ success: true, url: data.url });
    } catch (e) {
        console.error('[upload] Error:', e);
        return NextResponse.json(
            { success: false, error: e instanceof Error ? e.message : 'Upload error' },
            { status: 500 }
        );
    }
}
