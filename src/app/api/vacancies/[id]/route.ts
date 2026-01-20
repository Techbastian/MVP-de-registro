import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { db } from '@/lib/firebaseAdmin';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_VACANCIES_FOLDER_ID;

    console.log(`PATCH /api/vacancies/${id} - Request received`);
    console.log(`DRIVE_FOLDER_ID from env: ${DRIVE_FOLDER_ID}`);

    try {
        if (!id) {
            return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
        }

        const contentType = req.headers.get('content-type') || '';
        let updateData: any = {};
        let fileUrl = '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();

            // Map form fields to Firestore fields
            const fieldMap: Record<string, string> = {
                razonSocial: 'razon_social',
                nit: 'nit',
                nombreVacante: 'nombre_vacante',
                descripcion: 'descripcion',
                municipio: 'municipio',
                numVacantes: 'num_vacantes',
                salario: 'salario',
                fechaLimite: 'fecha_limite',
                status: 'status'
            };

            for (const [key, value] of Array.from(formData.entries())) {
                if (key === 'soporte') continue;
                const firestoreKey = fieldMap[key] || key;
                updateData[firestoreKey] = key === 'numVacantes' ? parseInt(value as string, 10) : value;
            }

            const file = formData.get('soporte') as File | null;
            console.log(`File found in FormData: ${file ? file.name : 'NO'}`);

            if (file) {
                if (!DRIVE_FOLDER_ID) {
                    console.error('CRITICAL: GOOGLE_DRIVE_VACANCIES_FOLDER_ID is missing');
                } else {
                    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
                    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

                    if (clientEmail && privateKey) {
                        const auth = new JWT({
                            email: clientEmail,
                            key: privateKey,
                            scopes: SCOPES,
                        });
                        const drive = google.drive({ version: 'v3', auth });
                        const buffer = await file.arrayBuffer();
                        const fileContent = Buffer.from(buffer);

                        console.log(`File size: ${fileContent.length} bytes`);
                        console.log(`Attempting Drive upload to folder: ${DRIVE_FOLDER_ID}`);
                        const driveResponse = await drive.files.create({
                            requestBody: {
                                name: `${updateData.razon_social || 'Update'}_${updateData.nombre_vacante || 'Support'}_Soporte.pdf`,
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
                        console.log(`Drive Upload Success: ${fileUrl}`);
                        if (fileUrl) updateData.url_soporte = fileUrl;
                    } else {
                        console.error('Missing Google Auth Credentials');
                    }
                }
            }
        } else {
            // Assume JSON
            updateData = await req.json();
        }

        const docRef = db.collection('vacantes_abiertas').doc(id);

        await docRef.update({
            ...updateData,
            fecha_actualizacion: new Date().toISOString()
        });

        return NextResponse.json({ success: true, message: 'Vacante actualizada correctamente', url_soporte: fileUrl });
    } catch (error: any) {
        console.error('API PATCH Error:', error);
        return new Response(JSON.stringify({
            error: 'Error al actualizar la vacante',
            message: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log(`DELETE /api/vacancies/${id} - Request received`);

    try {
        if (!id) {
            return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
        }

        await db.collection('vacantes_abiertas').doc(id).delete();
        return NextResponse.json({ success: true, message: 'Vacante eliminada correctamente' });
    } catch (error: any) {
        console.error('API DELETE Error:', error);
        return new Response(JSON.stringify({
            error: 'Error al eliminar la vacante',
            message: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
