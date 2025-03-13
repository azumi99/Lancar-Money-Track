import { ShowToast } from "@components/toast";
import { GetKategori, handleAddHarcodeKategori, handleAddHarcodeKategoriPemasukan, KategoriInterface } from "@screens/profile/detailPengaturan/pengaturanKategori/modelKategori";

interface GetKategoriInterface {
    kategori: KategoriInterface[];
    setKategori: (value: KategoriInterface[]) => void;
}
const fetchPemasukan = async ({ kategori, setKategori }: GetKategoriInterface) => {
    try {
        const response: KategoriInterface[] = await GetKategori('pemasukan');
        if (response.length <= 0) {
            await handleAddHarcodeKategoriPemasukan();
            return;
        }

        const prevKategori = kategori;
        const prevMap = new Map(prevKategori.map(item => [item.key, item]));
        const newMap = new Map(response.map(item => [item.key, item]));


        const updatedKategori = prevKategori
            .map(item => (newMap.has(item.key) ? { ...item, ...newMap.get(item.key)! } : item))
            .filter(item => newMap.has(item.key));


        response.forEach(item => {
            if (!prevMap.has(item.key)) {
                updatedKategori.push(item);
            }
        });

        setKategori(updatedKategori);

    } catch (error) {
        ShowToast('Ada masalah');
    }
};

const fetchPengeluaran = async ({ kategori, setKategori }: GetKategoriInterface) => {
    try {
        const response: KategoriInterface[] = await GetKategori('pengeluaran');
        if (response.length <= 0) {
            await handleAddHarcodeKategori();
            return;
        }

        const prevKategori = kategori;
        const prevMap = new Map(prevKategori.map(item => [item.key, item]));
        const newMap = new Map(response.map(item => [item.key, item]));


        const updatedKategori = prevKategori
            .map(item => (newMap.has(item.key) ? { ...item, ...newMap.get(item.key)! } : item))
            .filter(item => newMap.has(item.key));


        response.forEach(item => {
            if (!prevMap.has(item.key)) {
                updatedKategori.push(item);
            }
        });

        setKategori(updatedKategori);

    } catch (error) {
        ShowToast('Ada masalah');
    }
};


export { fetchPemasukan, fetchPengeluaran }