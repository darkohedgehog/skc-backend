import * as XLSX from 'xlsx';
import * as path from 'path';

interface KnjigaRecord {
    id: number;
    razina: string;
    invbroj: number;
    zbirka: string;
    signatura: string;
    skupina1: string;
    skupina1a: string;
    skupina2: string;
    skupina4: string;
    godina: number;
    isbn: string;
}

export default {
    async afterCreate(event: any) {
        const { result } = event;

        if (result && result.file) {
            // Kreiranje apsolutne putanje do fajla
            const filePath = path.resolve('./public', result.file.url.replace('/uploads/', ''));

            try {
                // Parsiranje Excel fajla
                const workbook = XLSX.readFile(filePath);
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData: KnjigaRecord[] = XLSX.utils.sheet_to_json(sheet);

                // Kreiranje zapisa u kolekciji koristeći novi API
                for (const record of jsonData) {
                    await strapi.db.query('api::knjige.knjige').create({
                        data: {
                            knjigaId: record.id,
                            razina: record.razina,
                            invbroj: record.invbroj,
                            zbirka: record.zbirka,
                            signatura: record.signatura,
                            skupina1: record.skupina1,
                            skupina1a: record.skupina1a,
                            skupina2: record.skupina2,
                            skupina4: record.skupina4,
                            godina: record.godina,
                            isbn: record.isbn,
                        },
                    });
                }
            } catch (error) {
                strapi.log.error('Greška pri parsiranju Excel fajla:', error);
            }
        }
    },
};
