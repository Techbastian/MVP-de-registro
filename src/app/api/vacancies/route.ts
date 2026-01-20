import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { db } from '@/lib/firebaseAdmin';
import { Readable } from 'stream';
import { parsePrivateKey } from '@/lib/utils';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

export async function GET() {
    console.log("GET /api/vacancies - Request received");
    try {
        const snapshot = await db.collection('vacantes_abiertas').orderBy('fecha_registro', 'desc').get();
        const vacancies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json(vacancies);
    } catch (error: any) {
        console.error('API GET Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch vacancies' }), { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_VACANCIES_FOLDER_ID;
    console.log("POST /api/vacancies - Request received");
    console.log(`DRIVE_FOLDER_ID: ${DRIVE_FOLDER_ID}`);

    try {
        const formData = await req.formData();

        // Extract fields
        const razonSocial = formData.get('razonSocial') as string;
        const nit = formData.get('nit') as string;
        const nombreVacante = formData.get('nombreVacante') as string;
        const descripcion = formData.get('descripcion') as string;
        const municipio = formData.get('municipio') as string;
        const numVacantes = formData.get('numVacantes') as string;
        const salario = formData.get('salario') as string;
        const fechaLimite = formData.get('fechaLimite') as string;
        const file = formData.get('soporte') as File | null;

        console.log(`File: ${file ? file.name : 'NONE'}`);

        // 1. Auth with Google Service Account
        const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

        if (!clientEmail || !privateKey) {
            return NextResponse.json({
                error: 'Faltan credenciales de Google Auth en .env.local'
            }, { status: 500 });
        }

        const auth = new JWT({
            email: clientEmail,
            key: privateKey,
            scopes: SCOPES,
        });

        const drive = google.drive({ version: 'v3', auth });

        let fileUrl = '';

        // 2. Upload file to Google Drive if exists
        if (file && DRIVE_FOLDER_ID) {
            const buffer = await file.arrayBuffer();
            console.log(`Uploading ${file.name} to Drive...`);
            const driveResponse = await drive.files.create({
                requestBody: {
                    name: `${razonSocial}_${nombreVacante}_Soporte.pdf`,
                    parents: [DRIVE_FOLDER_ID],
                },
                media: {
                    mimeType: 'application/pdf',
                    body: Readable.from(Buffer.from(buffer)),
                },
                fields: 'id, webViewLink',
                supportsAllDrives: true,
            } as any);

            fileUrl = driveResponse.data.webViewLink || '';
            console.log(`File uploaded: ${fileUrl}`);
        }

        // 3. Save to Firestore (Collection: vacantes_abiertas)
        const vacancyData = {
            razon_social: razonSocial,
            nit: nit,
            nombre_vacante: nombreVacante,
            descripcion: descripcion || '',
            municipio: municipio,
            num_vacantes: parseInt(numVacantes, 10),
            salario: salario,
            fecha_limite: fechaLimite,
            url_soporte: fileUrl,
            fecha_registro: new Date().toISOString(),
            status: 'Open'
        };

        const docRef = await db.collection('vacantes_abiertas').add(vacancyData);

        return NextResponse.json({
            success: true,
            id: docRef.id,
            message: 'Vacante registrada exitosamente.'
        });

    } catch (error: any) {
        console.error('API SERVER-SIDE ERROR:', error);
        return new Response(JSON.stringify({
            error: 'Error en la ejecución del servidor',
            message: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
