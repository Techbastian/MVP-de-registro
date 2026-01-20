import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { db } from '@/lib/firebaseAdmin';
import { Readable } from 'stream';
import { parsePrivateKey } from '@/lib/utils';

// Configuration
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1Ixz4qb-4paVoKuMbySgyloqL8_86N0FG';

export async function GET() {
    console.log("GET /api/applicants - Request received");
    try {
        // Use 'fecha_registro' to match existing schema
        const snapshot = await db.collection('aspirantes').orderBy('fecha_registro', 'desc').get();
        const applicants = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                // Map user's fields to frontend interface or just pass them through
                nombre: data.nombre,
                apellido: data.apellido,
                documento: data.documento,
                celular: data.celular,
                url_hv: data.url_hv,
                fecha_registro: data.fecha_registro,
                status: data.status || 'Active',
                ...data // Spread remaining fields
            };
        });

        return NextResponse.json(applicants);
    } catch (error: any) {
        console.error('API GET Error:', error);

        // Fallback: If orderBy fails (e.g. missing index or field), try without sorting
        try {
            const snapshot = await db.collection('aspirantes').get();
            const applicants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return NextResponse.json(applicants);
        } catch (innerError) {
            return new Response(JSON.stringify({ error: 'Failed to fetch' }), { status: 500 });
        }
    }
}

export async function POST(req: NextRequest) {
    console.log("POST /api/applicants - Request received");
    try {
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const surname = formData.get('surname') as string;
        const dob = formData.get('dob') as string;
        const documentId = formData.get('documentId') as string;
        const phone = formData.get('phone') as string;
        const experiencesRaw = formData.get('experiences') as string;
        const file = formData.get('cv') as File | null;

        const experiences = experiencesRaw ? JSON.parse(experiencesRaw) : [];

        if (!name || (!file && !experiencesRaw)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Auth with Google Service Account (shared for Drive and Firebase)
        const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

        if (!clientEmail || !privateKey) {
            return NextResponse.json({
                error: 'Missing Google Auth Credentials in .env.local'
            }, { status: 500 });
        }

        // Google Drive Auth
        const auth = new JWT({
            email: clientEmail,
            key: privateKey,
            scopes: SCOPES,
        });

        const drive = google.drive({ version: 'v3', auth });

        // 2. Upload file to Google Drive (if provided)
        let fileId = '';
        let fileUrl = '';

        if (file && file.size > 0) {
            const buffer = await file.arrayBuffer();
            console.log(`Attempting CV upload for ${name} ${surname} to folder: ${DRIVE_FOLDER_ID}`);
            const driveResponse = await drive.files.create({
                requestBody: {
                    name: `${name}_${surname}_CV.pdf`,
                    parents: [DRIVE_FOLDER_ID],
                },
                media: {
                    mimeType: 'application/pdf',
                    body: Readable.from(Buffer.from(buffer)),
                },
                fields: 'id, webViewLink',
                supportsAllDrives: true, // For Shared Drives
            } as any);

            fileId = driveResponse.data.id || '';
            fileUrl = driveResponse.data.webViewLink || '';
        }

        // 3. Save to Firestore (Collection: aspirantes)
        // Using fields from the user's screenshot
        const applicantData = {
            nombre: name,
            apellido: surname,
            documento: documentId,
            celular: phone || '',
            url_hv: fileUrl || '',
            id: documentId,
            status: 'Active',
            experiencia: experiences,
            fecha_registro: (() => {
                const d = new Date();
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
            })(),
            dob: dob // Keep optional
        };

        const docRef = db.collection('aspirantes').doc(documentId);
        await docRef.set(applicantData);

        return NextResponse.json({
            success: true,
            id: documentId,
            message: 'Applicant registered in Google Drive and Firebase successfully.'
        });

    } catch (error: any) {
        console.error('API SERVER-SIDE ERROR:', error);

        let message = error.message || 'Unknown error';
        if (message.includes("storage quota")) {
            message = "Error de Cuota: Las Cuentas de Servicio no tienen espacio en carpetas personales. Por favor, usa una 'Unidad Compartida' (Shared Drive) y añade la cuenta de servicio como colaborador.";
        }

        // Ensure we always return JSON, never HTML
        return new Response(JSON.stringify({
            error: 'Backend Execution Error',
            message: message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
