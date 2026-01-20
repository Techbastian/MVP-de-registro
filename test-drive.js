const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

function getEnv() {
    const envPath = path.join(__dirname, '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    const env = {};
    lines.forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length) {
            let value = valueParts.join('=').trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            env[key] = value;
        }
    });
    return env;
}

const env = getEnv();
const clientEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const folderId = "1jvSFEZ9xALyw31mhDjgMsDR6PB9uF0Ke";

async function testWrite() {
    const auth = new JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    try {
        console.log(`Testing write access for folder: ${folderId}`);
        const res = await drive.files.create({
            requestBody: {
                name: 'TEST_USER_FOLDER.txt',
                parents: [folderId],
            },
            media: {
                mimeType: 'text/plain',
                body: 'Hello User Folder',
            },
            fields: 'id, webViewLink',
            supportsAllDrives: true,
        });
        console.log('Write Success:', res.data.webViewLink);
        await drive.files.delete({ fileId: res.data.id, supportsAllDrives: true });
        console.log('Cleanup Success.');
    } catch (err) {
        console.error('Write Error:', err.message);
    }
}

testWrite();
