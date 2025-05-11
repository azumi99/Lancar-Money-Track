// @screens/reminder/modelReminder.ts
import { db } from "@config/dbService";
import { ShowToast } from "@components/toast";

export interface InterfaceReminder {
    id?: number;
    name: string;
    frequency: string;
    startDate: string;
    time: string;
    notes: string;
    isCompleted?: number; // 0 or 1 for SQLite boolean
}

// Create table for reminders
export const CreateTableReminder = () => (
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        frequency TEXT NOT NULL,
        startDate TEXT NOT NULL,
        time TEXT NOT NULL,
        notes TEXT,
        isCompleted INTEGER DEFAULT 0
      );`,
            [],
            () => {
                console.log('Tabel reminder berhasil dibuat');
            },
            error => {
                console.error('Error membuat tabel:', error);
                return false;
            }
        );
    })
);

// Add reminder
export const AddReminder = (name, frequency, startDate, time, notes) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO reminders (name, frequency, startDate, time, notes)
        VALUES (?, ?, ?, ?, ?)`,
                [name, frequency, startDate, time, notes],
                (_, result) => {
                    console.log('Reminder berhasil ditambahkan:', result.rowsAffected);
                    ShowToast('Pengingat berhasil ditambahkan');
                    resolve(result.insertId);
                },
                error => {
                    console.error('Error menambahkan reminder:', error);
                    ShowToast('Pengingat gagal ditambahkan');
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Update reminder
export const UpdateReminder = (id, name, frequency, startDate, time, notes) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE reminders
        SET name = ?, frequency = ?, startDate = ?, time = ?, notes = ?
        WHERE id = ?`,
                [name, frequency, startDate, time, notes, id],
                (_, result) => {
                    console.log('Reminder berhasil diupdate:', result.rowsAffected);
                    ShowToast('Pengingat berhasil diperbarui');
                    resolve(result.rowsAffected);
                },
                error => {
                    console.error('Error mengupdate reminder:', error);
                    ShowToast('Pengingat gagal diperbarui');
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Delete reminder
export const DeleteReminder = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM reminders WHERE id = ?`,
                [id],
                (_, result) => {
                    console.log('Reminder berhasil dihapus:', result.rowsAffected);
                    ShowToast('Pengingat berhasil dihapus');
                    resolve(result.rowsAffected);
                },
                error => {
                    console.error('Error menghapus reminder:', error);
                    ShowToast('Pengingat gagal dihapus');
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Get all reminders
export const GetReminders = (): Promise<InterfaceReminder[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM reminders ORDER BY startDate DESC, time ASC`,
                [],
                (_, result) => {
                    console.log('Data dari tabel reminders:', result.rows.raw());
                    resolve(result.rows.raw() as InterfaceReminder[]);
                },
                error => {
                    console.error('Error membaca data reminder:', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Get reminder by ID
export const GetReminderById = (id): Promise<InterfaceReminder> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM reminders WHERE id = ?`,
                [id],
                (_, result) => {
                    if (result.rows.length > 0) {
                        resolve(result.rows.item(0) as InterfaceReminder);
                    } else {
                        reject(new Error('Reminder tidak ditemukan'));
                    }
                },
                error => {
                    console.error('Error mencari reminder:', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Toggle reminder completion status
export const ToggleReminderCompletion = (id, isCompleted) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE reminders SET isCompleted = ? WHERE id = ?`,
                [isCompleted ? 0 : 1, id], // Toggle between 0 and 1
                (_, result) => {
                    console.log('Status pengingat berhasil diubah:', result.rowsAffected);
                    resolve(result.rowsAffected);
                },
                error => {
                    console.error('Error mengubah status pengingat:', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Get the last inserted ID
export const GetLastId = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT MAX(id) as lastId FROM reminders`,
                [],
                (_, result) => {
                    const lastId = result.rows.item(0).lastId;
                    resolve(lastId || 0);
                },
                error => {
                    console.error("Error mendapatkan ID terakhir:", error);
                    reject(error);
                    return false;
                }
            );
        });
    });
};