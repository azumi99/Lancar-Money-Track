import { db } from "@config/dbService";

export interface RekeningInterface {
    key?: number;
    name: string;
    matauang: string;
    jenis: string;
    jumlah: number;
    iconname: string;
    catatan: string;
    is_default: boolean;
}

const CreateTableRekening = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS rekening (
                key INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                matauang TEXT,
                jenis TEXT,
                jumlah INTEGER,
                iconname TEXT,
                catatan TEXT,
                is_default INTEGER
            );`,
            [],
            () => console.log('Tabel rekening berhasil dibuat'),
            error => console.error('Error membuat tabel:', error)
        );
    });
};

const AddRekening = (data: Omit<RekeningInterface, "key">) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO rekening (name, matauang, jenis, jumlah, iconname, catatan, is_default) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.name,
                data.matauang,
                data.jenis,
                data.jumlah,
                data.iconname,
                data.catatan,
                data.is_default ? 1 : 0
            ],
            (_, result) => {
                console.log('Rekening berhasil ditambahkan dengan ID:', result.insertId);
            },
            (_, error) => {
                console.error('Error menambahkan rekening:', error);
            }
        );
    });
};

const UpdateRekening = (data: RekeningInterface) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE rekening 
            SET name = ?, matauang = ?, jenis = ?, jumlah = ?, iconname = ?, catatan = ?, is_default = ?
            WHERE key = ?`,
            [
                data.name,
                data.matauang,
                data.jenis,
                data.jumlah,
                data.iconname,
                data.catatan,
                data.is_default ? 1 : 0,
                data.key!
            ],
            (_, result) => {
                console.log('Rekening berhasil diupdate:', result.rowsAffected);
            },
            (_, error) => {
                console.error('Error mengupdate rekening:', error);
            }
        );
    });
};

const UpdateJumlah = (key, jumlah) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE rekening 
            SET jumlah = ?
            WHERE key = ?`,
            [jumlah, key],
            (_, result) => {
                console.log('Jumlah berhasil diupdate:', result.rowsAffected);
            },
            (_, error) => {
                console.error('Error mengupdate jumlah rekening:', error);
            }
        );
    });
};



const UpdateIsDefaultRekening = (key: number) => {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE rekening SET is_default = 0`,
                [],
                () => {
                    tx.executeSql(
                        `UPDATE rekening SET is_default = 1 WHERE key = ?`,
                        [key],
                        (_, result) => {
                            if (result.rowsAffected > 0) {
                                resolve();
                            } else {
                                reject(new Error("Gagal memperbarui rekening default"));
                            }
                        },
                        (_, error) => reject(error)
                    );
                },
                (_, error) => reject(error)
            );
        });
    });
};
const CheckRekeningUsage = (key?: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT COUNT(*) as total FROM catatan WHERE id_rekening = ? OR id_rekening_tf = ?`,
                [key, key],
                (_, result) => {
                    const count = result.rows.item(0).total;
                    resolve(count > 0);
                },
                (_, error) => {
                    console.error('Gagal memeriksa penggunaan rekening:', error);
                    reject(error);
                }
            );
        });
    });
};

const DeleteRekening = (key: number | undefined) => {
    db.transaction(tx => {
        tx.executeSql(
            `DELETE FROM rekening WHERE key = ?`,
            [key],
            (_, result) => {
                console.log('Rekening berhasil dihapus:', result.rowsAffected);
            },
            (_, error) => {
                console.error('Error menghapus rekening:', error);
            }
        );
    });
};

const GetAllRekening = (): Promise<RekeningInterface[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM rekening`,
                [],
                (_, result) => {
                    resolve(result.rows.raw() as RekeningInterface[]);
                },
                (_, error) => {
                    console.error('Error membaca data rekening:', error);
                    reject(error);
                }
            );
        });
    });
};

const GetRekeningById = (key: number): Promise<RekeningInterface | null> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM rekening WHERE key = ?`,
                [key],
                (_, result) => {
                    if (result.rows.length > 0) {
                        const item = result.rows.item(0);
                        resolve({
                            ...item,
                            is_default: item.is_default === 1
                        });
                    } else {
                        resolve(null);
                    }
                },
                (_, error) => {
                    console.error('Error membaca rekening berdasarkan key:', error);
                    reject(error);
                }
            );
        });
    });
};

export {
    CreateTableRekening,
    AddRekening,
    UpdateRekening,
    DeleteRekening,
    GetAllRekening,
    GetRekeningById,
    UpdateIsDefaultRekening,
    UpdateJumlah,
    CheckRekeningUsage
};
