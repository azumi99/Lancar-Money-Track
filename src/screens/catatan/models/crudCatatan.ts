import { db } from "@config/dbService";
import { CatatanInterface } from "../dummyData";

const CreateTableCatatan = () => (
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS catatan (
        id TEXT PRIMARY KEY,
        jenis TEXT,
        jumlah INTEGER,
        tanggal TEXT,
        catatan TEXT,
        kategori INTEGER,
        iconName TEXT,
        iconLibrary TEXT
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

const AddCatatan = (id, jenis, jumlah, tanggal, catatan, kategori, iconName, iconLibrary) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO catatan (id, jenis, jumlah, tanggal, catatan, kategori, iconName, iconLibrary)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, jenis, jumlah, tanggal, catatan, kategori, iconName, iconLibrary],
            (_, result) => {
                console.log('Data berhasil ditambahkan:', result.rowsAffected);
            },
            error => {
                console.error('Error menambahkan data:', error);
            }
        );
    });
};

const GetCatatan = (): Promise<CatatanInterface[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM catatan`,
                [],
                (_, result) => {
                    console.log('Data dari tabel catatan:', result.rows.raw());
                    resolve(result.rows.raw() as CatatanInterface[]);
                },
                error => {
                    console.error('Error membaca data:', error);
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



export { CreateTableCatatan, AddCatatan, GetCatatan, GetLastId }