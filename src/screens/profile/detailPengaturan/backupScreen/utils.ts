import RNFS from 'react-native-fs';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

/**
 * Backup file database lancar.db ke Google Drive
 */

export const backupDatabaseToDrive = async (): Promise<string | null> => {
    try {
        const token = (await GoogleSignin.getTokens()).accessToken;

        const filePath = '/data/data/com.money_track/databases/lancar.db';
        console.log("File path:", filePath);

        const exists = await RNFS.exists(filePath);
        if (!exists) throw new Error("Database file tidak ditemukan.");

        const base64File = await RNFS.readFile(filePath, 'base64');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `lancar_backup_${timestamp}.db`;

        const boundary = 'foo_bar_baz';
        const metadata = {
            name: filename,
            mimeType: 'application/x-sqlite3',
        };

        const multipartRequestBody =
            `--${boundary}\r\n` +
            `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
            JSON.stringify(metadata) + `\r\n` +
            `--${boundary}\r\n` +
            `Content-Type: application/x-sqlite3\r\n` +
            `Content-Transfer-Encoding: base64\r\n\r\n` +
            base64File + `\r\n` +
            `--${boundary}--`;

        const response = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': `multipart/related; boundary=${boundary}`,
                    'Content-Length': multipartRequestBody.length.toString(),
                },
                body: multipartRequestBody,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload gagal: ${errorText}`);
        }

        console.log("Backup berhasil:", filename);
        return new Date().toISOString();
    } catch (err) {
        console.error("Gagal backup:", err);
        return null;
    }
};


/**
 * Ambil daftar file backup dari Google Drive
 */
export const getBackupList = async (): Promise<any[]> => {
    try {
        const token = (await GoogleSignin.getTokens()).accessToken;

        const res = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name contains 'lancar_backup_'&fields=files(id,name,createdTime)&orderBy=createdTime desc`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();
        return data?.files || [];
    } catch (err) {
        console.error("Gagal ambil daftar backup:", err);
        return [];
    }
};

export const downloadBackupFile = async (fileId: string, token: string): Promise<void> => {
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const localPath = '/data/data/com.money_track/databases/lancar.db';

    const res = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const base64 = Buffer.from(bytes).toString('base64');

    await RNFS.writeFile(localPath, base64, 'base64');
    console.log("Restore berhasil ke:", localPath);
};

export const deleteBackupFile = async (fileId: string, token: string): Promise<void> => {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Gagal menghapus file: " + res.statusText);
    }

    console.log("File backup berhasil dihapus:", fileId);
};

