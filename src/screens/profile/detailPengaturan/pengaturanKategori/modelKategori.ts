import { ShowToast } from "@components/toast";
import { db } from "@config/dbService";

export interface KategoriInterface {
    key: string;
    title: string;
    kategoriIcon: string;
    vendor: string;
    active: string;
    keterangan: string;
}

const CreateTableKategori = () => (
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS kategori (
        key TEXT PRIMARY KEY,
        title TEXT,
        kategoriIcon TEXT,
        vendor TEXT,
        active TEXT,
        keterangan TEXT
      );`,
            [],
            () => {
                console.log('Tabel kategori berhasil dibuat');
            },
            error => {
                console.error('Error membuat tabel:', error);
            }
        );
    })
)

const InsertKategori = (key, title, kategoriIcon, vendor, active, keterangan) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO kategori (key, title, kategoriIcon, vendor, active, keterangan)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [key, title, kategoriIcon, vendor, active, keterangan],
            (_, result) => {
                console.log('Data berhasil ditambahkan:', result.rowsAffected);
            },
            error => {
                console.error('Error menambahkan data:', error);
            }
        );
    });
};

const UpdateKategori = (key, title, kategoriIcon, vendor, active, keterangan) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE kategori 
             SET title = ?, kategoriIcon = ?, vendor = ?, active = ?, keterangan = ? 
             WHERE key = ?`,
            [title, kategoriIcon, vendor, active, keterangan, key],
            (_, result) => {
                console.log('Data berhasil diperbarui:', result.rowsAffected);
            },
            error => {
                console.error('Error memperbarui data:', error);
            }
        );
    });
};


const DeleteKategori = (key, active) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE kategori SET active = ? WHERE key = ?`,
            [active, key],
            (_, result) => {
                console.log('Status active berhasil diperbarui:', result.rowsAffected);
            },
            error => {
                console.error('Error memperbarui status active:', error);
            }
        );
    });
};



const GetKategori = (ket): Promise<KategoriInterface[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM kategori WHERE keterangan = ? ORDER BY CAST(key AS INTEGER) DESC`,
                [ket],
                (_, result) => {
                    console.log('Data dari tabel catatan:', result.rows.raw());
                    resolve(result.rows.raw() as KategoriInterface[]);
                },
                error => {
                    console.error('Error membaca data:', error);
                    reject(error);
                }
            );
        });
    });
};

const GetKategoriByKey = (key: string): Promise<KategoriInterface | null> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM kategori WHERE key = ? LIMIT 1`,
                [key],
                (_, result) => {
                    const data = result.rows.length > 0 ? result.rows.item(0) : null;
                    resolve(data as KategoriInterface | null);
                },
                error => {
                    console.error('Error membaca data berdasarkan key:', error);
                    reject(error);
                }
            );
        });
    });
};


const IdKategori = async (): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT key FROM kategori ORDER BY CAST(key AS INTEGER) DESC LIMIT 1`,
                [],
                (_, result) => {
                    const lastId = result.rows.length > 0 ? Number(result.rows.item(0).key) : 0;
                    resolve(lastId);
                },
                error => {
                    console.error("Error mendapatkan ID terakhir:", error);
                    reject(error);
                }
            );
        });
    });
};



const handleAddHarcodeKategori = async () => {
    try {
        InsertKategori("1", "Makanan", "fast-food-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("2", "Game", "game-controller-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("3", "Belanja", "cart-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("4", "Transportasi", "bus-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("5", "Travel", "airplane-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("6", "Kesehatan", "medkit-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("7", "Olahraga", "bicycle-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("8", "Hiburan", "tv-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("9", "Edukasi", "school-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("10", "Kerja", "briefcase-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("11", "Gadget", "phone-portrait-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("12", "Uang", "wallet-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("13", "Investasi", "trending-up-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("14", "Wisata", "map-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("15", "Cepat", "pizza-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("16", "Minuman", "wine-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("17", "Rumah", "home-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("18", "Fesyen", "shirt-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("19", "Hewan", "paw-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("20", "Hadiah", "gift-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("21", "Musik", "musical-notes-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("22", "Foto", "camera-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("23", "Kosmetik", "flower-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("24", "Tubuh", "heart-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("25", "Dapur", "cafe-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("26", "Buku", "book-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("27", "Mobil", "car-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("28", "Film", "film-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("29", "Langit", "cloud-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("30", "Chat", "chatbubble-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("31", "Kunci", "key-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("32", "Jam", "watch-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("33", "Listrik", "flash-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("34", "Teh", "beer-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("35", "Pohon", "leaf-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("36", "Pantai", "water-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("37", "Hujan", "rainy-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("38", "Seni", "color-palette-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("39", "Alat", "construct-outline", "Ionicons", "1", "pengeluaran");
        InsertKategori("40", "Kopi", "cafe-outline", "Ionicons", "1", "pengeluaran");

        console.log("Semua data kategori berhasil ditambahkan!");
    } catch (error) {
        console.error("Error saat menambahkan data:", error);
    }
};

const handleAddHarcodeKategoriPemasukan = async () => {
    try {
        InsertKategori("41", "Gaji", "cash-outline", "Ionicons", "1", "pemasukan");
        InsertKategori("42", "Bonus", "gift-outline", "Ionicons", "1", "pemasukan");
        InsertKategori("43", "Investasi", "trending-up-outline", "Ionicons", "1", "pemasukan");
        InsertKategori("44", "Hadiah", "medal-outline", "Ionicons", "1", "pemasukan");
        InsertKategori("45", "Proyek", "briefcase-outline", "Ionicons", "1", "pemasukan");
        InsertKategori("46", "Usaha", "business-outline", "Ionicons", "1", "pemasukan");
        InsertKategori("47", "Tabungan", "save-outline", "Ionicons", "1", "pemasukan");
        InsertKategori("48", "Pemasukan", "wallet-outline", "Ionicons", "1", "pemasukan");

        console.log("Semua data kategori berhasil ditambahkan!");
    } catch (error) {
        console.error("Error saat menambahkan data:", error);
    }
};
export { UpdateKategori, DeleteKategori, CreateTableKategori, GetKategori, InsertKategori, IdKategori, handleAddHarcodeKategori, handleAddHarcodeKategoriPemasukan, GetKategoriByKey }