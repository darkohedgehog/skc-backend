import * as XLSX from 'xlsx';
import * as path from 'path';

interface KnjigaRecord {
    id: string;
    razina: string;
    invbroj: string;
    zbirka: string;
    signatura: string;
    skupina1: string;
    skupina1a: string;
    skupina2: string;
    skupina4: string;
    godina: string;
    isbn: string;
}

export default {
    async afterCreate(event: any) {
        const { result } = event;

        if (!result || !result.File || !result.File[0]) {
            strapi.log.warn('Nema validnog fajla za obradu u afterCreate hook-u.');
            return;
        }

        // Dohvatanje putanje fajla
        const fileUrl = result.File[0].url;
        const filePath = path.resolve('./public/uploads', fileUrl.replace('/uploads/', ''));

        try {
            // Čitanje Excel fajla
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData: KnjigaRecord[] = XLSX.utils.sheet_to_json(sheet);

            for (const record of jsonData) {
                // Formatiranje i validacija podataka
                const godina = record.godina ? parseInt(record.godina.replace(',', ''), 10) : null;
                const invbroj = record.invbroj ? parseInt(record.invbroj.replace(',', ''), 10) : null;

                // Preskakanje ako godina nije validna
                if (isNaN(godina)) {
                    strapi.log.warn(`Preskačem unos zbog nevalidne godine: ${JSON.stringify(record)}`);
                    continue;
                }

                // Unos u bazu podataka
                await strapi.db.query('api::knjige.knjige').create({
                    data: {
                        knjigaId: record.id?.trim() || null,
                        razina: record.razina?.trim() || null,
                        invbroj: invbroj || null,
                        zbirka: record.zbirka?.trim() || null,
                        signatura: record.signatura?.trim() || null,
                        skupina1: record.skupina1?.trim() || null,
                        skupina1a: record.skupina1a?.trim() || null,
                        skupina2: record.skupina2?.trim() || null,
                        skupina4: record.skupina4?.trim() || null,
                        godina: godina || null,
                        isbn: record.isbn?.trim() || null,
                    },
                });
            }

            strapi.log.info('Excel fajl uspešno obrađen.');
        } catch (error) {
            strapi.log.error(`Greška pri obradi Excel fajla: ${error.message}`);
        }
    },
};
