import { db } from "@config/dbService";
import { ShowToast } from "@components/toast";

export interface AnggaranInterface {
    id: number;
    id_kategori: string;
    jumlah: number;
}

export const CreateTableAnggaran = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS anggaran (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_kategori TEXT,
                jumlah INTEGERr
            );`,
            [],
            () => {
                console.log('Tabel anggaran berhasil dibuat');
            },
            error => {
                console.error('Error membuat tabel anggaran:', error);
            }
        );
    });
};

export const InsertAnggaran = (id_kategori: string, jumlah: number) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO anggaran (id_kategori, jumlah) VALUES (?, ?);`,
            [id_kategori, jumlah],
            () => {
                console.log('Data anggaran berhasil disimpan');
            },
            error => {
                console.error('Gagal menyimpan data anggaran:', error);
            }
        );
    });
};


export const UpdateAnggaranByKategori = (id_kategori: string, jumlah: number) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE anggaran SET jumlah = ? WHERE id_kategori = ?;`,
            [jumlah, id_kategori],
            () => {
                console.log('Data anggaran per kategori berhasil diupdate');
            },
            error => {
                console.error('Gagal update data anggaran per kategori:', error);
            }
        );
    });
};

export const GetAnggaran = (): Promise<AnggaranInterface[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM anggaran;`,
                [],
                (_, result) => {
                    console.log('Data dari tabel anggaran:', result.rows.raw());
                    resolve(result.rows.raw() as AnggaranInterface[]);
                },
                error => {
                    console.error('Gagal ambil data anggaran:', error);
                    reject(error);
                }
            );
        });
    });
};

export const GetAnggaranByKategori = (id_kategori: string): Promise<AnggaranInterface | null> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM anggaran WHERE id_kategori = ? LIMIT 1`,
                [id_kategori],
                (_, result) => {
                    const rows = result.rows.raw();
                    if (rows.length > 0) {
                        resolve(rows[0] as AnggaranInterface);
                    } else {
                        resolve(null);
                    }
                },
                error => {
                    console.error('Error membaca anggaran per kategori:', error);
                    reject(error);
                }
            );
        });
    });
};

export const GetPengeluaranByMonthAndYear = (month, year): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        // Pad month to two digits if needed
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;

        db.transaction(tx => {
            tx.executeSql(
                `SELECT anggaran.*, kategori.title, kategori.kategoriIcon, kategori.vendor, 
                        CASE 
                            WHEN anggaran.id_kategori = 0 THEN 
                                (SELECT SUM(catatan.jumlah) FROM catatan 
                                 WHERE catatan.jenis = 'pengeluaran' 
                                 AND strftime('%m', catatan.tanggal) = ? 
                                 AND strftime('%Y', catatan.tanggal) = ?)
                            ELSE SUM(catatan.jumlah) 
                        END AS total_pengeluaran,
                        CASE 
                            WHEN anggaran.id_kategori = 0 THEN 
                                anggaran.jumlah - (SELECT SUM(catatan.jumlah) FROM catatan 
                                                   WHERE catatan.jenis = 'pengeluaran' 
                                                   AND strftime('%m', catatan.tanggal) = ? 
                                                   AND strftime('%Y', catatan.tanggal) = ?)
                            ELSE anggaran.jumlah - SUM(catatan.jumlah) 
                        END AS sisa_anggaran
                 FROM anggaran 
                 LEFT JOIN kategori ON anggaran.id_kategori = kategori.key
                 LEFT JOIN catatan ON catatan.id_kategori = anggaran.id_kategori
                 WHERE (catatan.jenis = 'pengeluaran' OR catatan.id_kategori IS NULL)
                 AND (anggaran.id_kategori = 0 OR 
                      (strftime('%m', catatan.tanggal) = ? AND strftime('%Y', catatan.tanggal) = ?))
                 GROUP BY anggaran.id;`,
                [formattedMonth, year.toString(), formattedMonth, year.toString(), formattedMonth, year.toString()],
                (_, result) => {
                    console.log(`Total pengeluaran dan sisa anggaran untuk bulan ${month}/${year}:`, result.rows.raw());
                    resolve(result.rows.raw());
                },
                error => {
                    console.error('Gagal ambil data pengeluaran dan sisa anggaran:', error);
                    reject(error);
                }
            );
        });
    });
};

// New function to get available years from the database
export const GetAvailableYears = (): Promise<number[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT DISTINCT strftime('%Y', tanggal) as year 
                 FROM catatan 
                 ORDER BY year ASC;`,
                [],
                (_, result) => {
                    const years = result.rows.raw().map(row => parseInt(row.year));
                    const currentYear = new Date().getFullYear();

                    // Add current year if not already in the list
                    if (!years.includes(currentYear)) {
                        years.push(currentYear);
                    }

                    console.log('Available years from database:', years);
                    resolve(years);
                },
                error => {
                    console.error('Gagal mengambil data tahun tersedia:', error);
                    // Return current year as fallback
                    resolve([new Date().getFullYear()]);
                }
            );
        });
    });
};

// Mempertahankan fungsi asli untuk kompatibilitas
export const GetPengeluaranBulanIni = (): Promise<any[]> => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Get current month (0-11, hence add 1)
    const year = currentDate.getFullYear(); // Get current year (4 digits)

    return GetPengeluaranByMonthAndYear(month, year);
};