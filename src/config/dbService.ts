import SQLite from 'react-native-sqlite-storage';


const db = SQLite.openDatabase(
    {
        name: 'lancar.db',
        location: 'default',
    },
    () => {
        console.log('Database berhasil dibuka');
    },
    error => {
        console.error('Error membuka database:', error);
    }
);


export { db }
