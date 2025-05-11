import { db } from "@config/dbService";
import { useCallback } from "react";
import { ShowToast } from "@components/toast";
import { GetRekeningById, UpdateJumlah } from "@screens/profile/detailPengaturan/pengaturanRekening/modelRekening";

export interface InterfaceCatatan {
    vendor?: string;
    kategoriIcon?: string;
    id: number;
    jenis: 'pemasukan' | 'pengeluaran' | 'transfer';
    jumlah: number;
    tanggal: string;
    catatan: string;
    image: string;
    matauang: string;
    id_rekening: number;
    id_rekening_tf?: number;
    id_kategori: number;
    title?: string;
}


const CreateTableCatatan = () => (
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS catatan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jenis TEXT,
        jumlah INTEGER,
        tanggal TEXT,
        catatan TEXT,
        image TEXT,
        matauang TEXT,
        id_rekening INTEGER,
        id_rekening_tf INTEGER,
        id_kategori INTEGER
      );`,
            [],
            () => {
                console.log('Tabel catatan berhasil dibuat');
            },
            error => {
                console.error('Error membuat tabel:', error);
            }
        );
    })
)

const AddCatatan = (jenis, jumlah, tanggal, catatan, image, matauang, id_rekening, id_rekening_tf, id_kategori) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO catatan (jenis, jumlah, tanggal, catatan, image, matauang, id_rekening, id_rekening_tf, id_kategori)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [jenis, jumlah, tanggal, catatan, image, matauang, id_rekening, id_rekening_tf, id_kategori],
            (_, result) => {
                console.log('Data berhasil ditambahkan:', result.rowsAffected);

            },
            error => {
                console.error('Error menambahkan data:', error);
            }
        );
    });
};

const UpdateCatatan = (id, jenis, jumlah, tanggal, catatan, image, matauang, id_rekening, id_rekening_tf, id_kategori) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE catatan
            SET jenis = ?, jumlah = ?, tanggal = ?, catatan = ?, image = ?, matauang = ?, id_rekening = ?, id_rekening_tf = ?, id_kategori = ?
            WHERE id = ?`,
            [jenis, jumlah, tanggal, catatan, image, matauang, id_rekening, id_rekening_tf, id_kategori, id],
            (_, result) => {
                console.log('Data berhasil diupdate:', result.rowsAffected);
            },
            error => {
                console.error('Error mengupdate data:', error);
            }
        );
    });
};



const GetCatatan = (): Promise<InterfaceCatatan[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT
            catatan.*,
            kategori.kategoriIcon,
            kategori.vendor,
            kategori.title
          FROM catatan
          LEFT JOIN kategori ON catatan.id_kategori = kategori.key`,
                [],
                (_, result) => {
                    console.log('Data dari tabel catatan + kategori:', result.rows.raw());
                    resolve(result.rows.raw() as InterfaceCatatan[]);
                },
                error => {
                    console.error('Error membaca data dengan join:', error);
                    reject(error);
                }
            );
        });
    });
};



const GetLastId = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT MAX(id) as lastId FROM catatan`,
                [],
                (_, result) => {
                    const lastId = result.rows.item(0).lastId;
                    resolve(lastId || 0);
                },
                error => {
                    console.error("Error mendapatkan ID terakhir:", error);
                    reject(error);
                }
            );
        });
    });
};
const GetCatatanById = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM catatan WHERE id = ?`,
                [id],
                (_, { rows }) => resolve(rows.length > 0 ? rows.item(0) : null),
                (_, error) => reject(error)
            );
        });
    });
};
const handleDelete = async (id: number): Promise<void> => {
    try {
        // Ambil data catatan terlebih dahulu (di luar transaction)
        const catatan = await GetCatatanById(id);
        if (!catatan) throw new Error('Catatan tidak ditemukan');

        const { jumlah, jenis, id_rekening: rekeningFromId, id_rekening_tf: rekeningToId } = catatan;

        // Update saldo berdasarkan jenis catatan
        if (jenis === 'transfer') {
            const rekeningFrom = await GetRekeningById(rekeningFromId);
            const rekeningTo = await GetRekeningById(rekeningToId);
            await UpdateJumlah(rekeningFromId, (rekeningFrom?.jumlah ?? 0) + jumlah);
            await UpdateJumlah(rekeningToId, (rekeningTo?.jumlah ?? 0) - jumlah);
        } else if (jenis === 'pemasukan') {
            const rekening = await GetRekeningById(rekeningFromId);
            await UpdateJumlah(rekeningFromId, (rekening?.jumlah ?? 0) - jumlah);
        } else if (jenis === 'pengeluaran') {
            const rekening = await GetRekeningById(rekeningFromId);
            await UpdateJumlah(rekeningFromId, (rekening?.jumlah ?? 0) + jumlah);
        }

        // Setelah update saldo, jalankan DELETE di dalam transaction
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM catatan WHERE id = ?`,
                    [id],
                    () => {
                        ShowToast('Catatan berhasil dihapus');
                        GetCatatan();
                        resolve();
                    },
                    (_, error) => {
                        console.error('Gagal menghapus catatan:', error);
                        reject(error);
                    }
                );
            });
        });

    } catch (error) {
        console.error('Gagal update saldo atau hapus catatan:', error);
        ShowToast('Gagal menghapus catatan');
    }
};





export { CreateTableCatatan, AddCatatan, GetCatatan, GetLastId, handleDelete, UpdateCatatan, GetCatatanById }