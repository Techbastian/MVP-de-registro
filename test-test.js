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

const folderId = "1v_G1M0PzDjgMsDR6PB9uF0Ke";

async function testWrite() {
    const auth = new JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    try {
        console.log(`Testing write in NEW folder: ${folderId}`);
        const testFile = await drive.files.create({
            requestBody: {
                name: 'TEST_SUBMIT.txt',
                parents: [folderId],
            },
            media: {
                mimeType: 'text/plain',
                body: 'Final Check',
            },
            fields: 'id, webViewLink',
            supportsAllDrives: true,
        });
        console.log('Success!', testFile.data.webViewLink);
        await drive.files.delete({ fileId: testFile.data.id, supportsAllDrives: true });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testWrite();
