import { db } from "@config/dbService";
import { ShowToast } from "@components/toast";
import { GetRekeningById, UpdateJumlah } from "@screens/profile/detailPengaturan/pengaturanRekening/modelRekening";
import { AddCatatan } from "@screens/catatan/models/crudCatatan";


export interface InterfacePembayaranRegular {
    id: number;
    nama_pembayaran: string;
    frekuensi: 'Harian' | 'Mingguan' | 'Bulanan' | 'Tahunan';
    tanggal_mulai: string; // ISO date string
    jumlah: number;
    batas_jumlah_kali: number | null; // null means unlimited
    jumlah_terlaksana: number;
    jenis: 'pemasukan' | 'pengeluaran' | 'transfer';
    id_kategori: number;
    id_rekening: number;
    id_rekening_tf?: number | null;
    catatan: string;
    aktif: boolean;
    matauang: string | undefined;
    tanggal_terakhir_eksekusi?: string;
}

// Create the table for scheduled payments
export const CreateTablePembayaranRegular = () => (
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS pembayaran_regular (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nama_pembayaran TEXT,
                frekuensi TEXT,
                tanggal_mulai TEXT,
                jumlah INTEGER,
                batas_jumlah_kali INTEGER,
                jumlah_terlaksana INTEGER DEFAULT 0,
                jenis TEXT,
                id_kategori INTEGER,
                id_rekening INTEGER,
                id_rekening_tf INTEGER,
                catatan TEXT,
                aktif INTEGER DEFAULT 1,
                matauang TEXT,
                tanggal_terakhir_eksekusi TEXT
            );`,
            [],
            () => {
                console.log('Tabel pembayaran_regular berhasil dibuat');
            },
            error => {
                console.error('Error membuat tabel pembayaran_regular:', error);
                return true;
            }
        );
    })
);

// Add a new scheduled payment
export const AddPembayaranRegular = (
    nama_pembayaran: string,
    frekuensi: string,
    tanggal_mulai: string,
    jumlah: number,
    batas_jumlah_kali: number | null,
    jenis: string,
    id_kategori: number,
    id_rekening: number | undefined,
    id_rekening_tf: number | null,
    catatan: string,
    matauang: string | undefined
): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO pembayaran_regular (
                    nama_pembayaran, frekuensi, tanggal_mulai, jumlah, batas_jumlah_kali,
                    jumlah_terlaksana, jenis, id_kategori, id_rekening, id_rekening_tf, 
                    catatan, aktif, matauang
                ) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, 1, ?)`,
                [
                    nama_pembayaran, frekuensi, tanggal_mulai, jumlah, batas_jumlah_kali,
                    jenis, id_kategori, id_rekening, id_rekening_tf, catatan, matauang
                ],
                async (_, result) => {
                    console.log('Pembayaran regular berhasil ditambahkan:', result.rowsAffected);
                    const lastId = await GetLastIdPembayaranRegular();
                    resolve(Number(lastId));
                },
                error => {
                    console.error('Error menambahkan pembayaran regular:', error);
                    reject(error);
                    return true;
                }
            );
        });
    });
};

// Get all scheduled payments
export const GetPembayaranRegular = (): Promise<InterfacePembayaranRegular[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT 
                    p.*,
                    k.title, k.kategoriIcon, k.vendor
                FROM pembayaran_regular p
                LEFT JOIN kategori k ON p.id_kategori = k.key
                ORDER BY p.nama_pembayaran ASC`,
                [],
                (_, result) => {
                    resolve(result.rows.raw() as InterfacePembayaranRegular[]);
                },
                error => {
                    console.error('Error membaca data pembayaran regular:', error);
                    reject(error);
                    return true;
                }
            );
        });
    });
};

// Update a scheduled payment
export const UpdatePembayaranRegular = (
    id: number,
    nama_pembayaran: string,
    frekuensi: string,
    tanggal_mulai: string,
    jumlah: number,
    batas_jumlah_kali: number | null,
    jenis: string,
    id_kategori: number,
    id_rekening: number | undefined,
    id_rekening_tf: number | null,
    catatan: string,
    matauang: string | undefined
): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE pembayaran_regular
                SET nama_pembayaran = ?, frekuensi = ?, tanggal_mulai = ?, jumlah = ?,
                    batas_jumlah_kali = ?, jenis = ?, id_kategori = ?, id_rekening = ?,
                    id_rekening_tf = ?, catatan = ?, matauang = ?
                WHERE id = ?`,
                [
                    nama_pembayaran, frekuensi, tanggal_mulai, jumlah,
                    batas_jumlah_kali, jenis, id_kategori, id_rekening,
                    id_rekening_tf, catatan, matauang, id
                ],
                (_, result) => {
                    console.log('Pembayaran regular berhasil diupdate:', result.rowsAffected);
                    resolve();
                },
                error => {
                    console.error('Error mengupdate pembayaran regular:', error);
                    reject(error);
                    return true;
                }
            );
        });
    });
};

// Delete a scheduled payment
export const DeletePembayaranRegular = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM pembayaran_regular WHERE id = ?`,
                [id],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        ShowToast('Pembayaran regular berhasil dihapus');
                        resolve();
                    } else {
                        reject(new Error('Pembayaran regular tidak ditemukan'));
                    }
                },
                error => {
                    console.error('Error menghapus pembayaran regular:', error);
                    reject(error);
                    return true;
                }
            );
        });
    });
};

// Get a specific scheduled payment by ID
export const GetPembayaranRegularById = (id: number): Promise<InterfacePembayaranRegular | null> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM pembayaran_regular WHERE id = ?`,
                [id],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        resolve(rows.item(0) as InterfacePembayaranRegular);
                    } else {
                        resolve(null);
                    }
                },
                error => {
                    console.error('Error mencari pembayaran regular:', error);
                    reject(error);
                    return true;
                }
            );
        });
    });
};

// Update the completion count for a scheduled payment
export const UpdateJumlahTerlaksana = (id: number, jumlah_terlaksana: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE pembayaran_regular SET jumlah_terlaksana = ? WHERE id = ?`,
                [jumlah_terlaksana, id],
                (_, result) => {
                    console.log('Jumlah terlaksana berhasil diupdate:', result.rowsAffected);
                    resolve();
                },
                error => {
                    console.error('Error mengupdate jumlah terlaksana:', error);
                    reject(error);
                    return true;
                }
            );
        });
    });
};

// Toggle active status of a scheduled payment
export const ToggleStatusPembayaranRegular = (id: number, aktif: boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
        const statusValue = aktif ? 1 : 0;
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE pembayaran_regular SET aktif = ? WHERE id = ?`,
                [statusValue, id],
                (_, result) => {
                    console.log('Status pembayaran regular berhasil diupdate:', result.rowsAffected);
                    resolve();
                },
                error => {
                    console.error('Error mengupdate status pembayaran regular:', error);
                    reject(error);
                    return true;
                }
            );
        });
    });
};

// Get the last ID from the table
export const GetLastIdPembayaranRegular = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT MAX(id) as lastId FROM pembayaran_regular`,
                [],
                (_, result) => {
                    const lastId = result.rows.item(0).lastId;
                    resolve(lastId || 0);
                },
                error => {
                    console.error("Error mendapatkan ID terakhir pembayaran regular:", error);
                    reject(error);
                    return true;
                }
            );
        });
    });
};

// Calculate the next execution date based on frequency
const calculateNextExecutionDate = (lastDate: string, frequency: string): string => {
    const date = new Date(lastDate);

    switch (frequency) {
        case 'Harian':
            date.setDate(date.getDate() + 1);
            break;
        case 'Mingguan':
            date.setDate(date.getDate() + 7);
            break;
        case 'Bulanan':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'Tahunan':
            date.setFullYear(date.getFullYear() + 1);
            break;
        default:
            break;
    }

    return date.toISOString().slice(0, 10);
};

export const UpdateTanggalTerakhirEksekusi = (id: number, tanggal: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE pembayaran_regular SET tanggal_terakhir_eksekusi = ? WHERE id = ?`,
                [tanggal, id],
                (_, result) => {
                    console.log(`Tanggal eksekusi terakhir untuk ID ${id} diupdate ke ${tanggal}`);
                    resolve();
                },
                error => {
                    console.error('Error mengupdate tanggal eksekusi terakhir:', error);
                    reject(error);
                    return true;
                }
            );
        });
    });
};


// Check and process scheduled payments that need to be executed
export const processScheduledPayments = async (): Promise<void> => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const payments = await GetPembayaranRegular();

        for (const payment of payments) {
            if (!payment.aktif) continue;

            if (payment.batas_jumlah_kali !== null &&
                payment.jumlah_terlaksana >= payment.batas_jumlah_kali) {
                continue;
            }

            const today = new Date().toISOString().slice(0, 10);
            const lastExecutedDate = payment.tanggal_terakhir_eksekusi;
            if (lastExecutedDate === today) continue; // udah dieksekusi hari ini

            const startDate = new Date(payment.tanggal_mulai);
            const todayDate = new Date(today);

            let tempDate = new Date(payment.tanggal_mulai);
            let shouldExecute = false;

            while (tempDate <= todayDate) {
                const currentExecutionDate = tempDate.toISOString().slice(0, 10);
                if (currentExecutionDate === today) {
                    shouldExecute = true;
                    break;
                }
                tempDate = new Date(calculateNextExecutionDate(currentExecutionDate, payment.frekuensi));
            }

            if (shouldExecute) {
                // Input catatan dll di sini
                await AddCatatan(
                    payment.jenis,
                    payment.jumlah,
                    today,
                    `${payment.nama_pembayaran} (Otomatis)${payment.catatan ? ` - ${payment.catatan}` : ''}`,
                    '[]',
                    payment.matauang,
                    payment.id_rekening,
                    payment.id_rekening_tf,
                    payment.id_kategori
                );

                const rekening = await GetRekeningById(payment.id_rekening);

                if (payment.jenis === 'transfer' && payment.id_rekening_tf) {
                    const rekeningTujuan = await GetRekeningById(payment.id_rekening_tf);
                    await UpdateJumlah(payment.id_rekening, (rekening?.jumlah || 0) - payment.jumlah);
                    await UpdateJumlah(payment.id_rekening_tf, (rekeningTujuan?.jumlah || 0) + payment.jumlah);
                } else if (payment.jenis === 'pemasukan') {
                    await UpdateJumlah(payment.id_rekening, (rekening?.jumlah || 0) + payment.jumlah);
                } else if (payment.jenis === 'pengeluaran') {
                    await UpdateJumlah(payment.id_rekening, (rekening?.jumlah || 0) - payment.jumlah);
                }

                await UpdateJumlahTerlaksana(payment.id, payment.jumlah_terlaksana + 1);
                await UpdateTanggalTerakhirEksekusi(payment.id, today);

                if (payment.batas_jumlah_kali !== null &&
                    payment.jumlah_terlaksana + 1 >= payment.batas_jumlah_kali) {
                    await ToggleStatusPembayaranRegular(payment.id, false);
                }

                ShowToast(`Pembayaran otomatis "${payment.nama_pembayaran}" berhasil dilaksanakan`);
            }
        }

    } catch (error) {
        console.error('Error memproses pembayaran terjadwal:', error);
        ShowToast('Gagal memproses pembayaran terjadwal');
    }
};