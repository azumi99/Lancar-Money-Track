import { ShowToast } from "@components/toast";
import { GetAllRekening, RekeningInterface } from "./modelRekening";


interface getRekeningInterface {
    rekening: RekeningInterface[];
    setRekening: (value: RekeningInterface[]) => void;
}
const fetchRekening = async ({ rekening, setRekening }: getRekeningInterface) => {
    try {
        const response: RekeningInterface[] = await GetAllRekening();


        const prevRekening = rekening;
        const prevMap = new Map(prevRekening.map(item => [item.key, item]));
        const newMap = new Map(response.map(item => [item.key, item]));


        const updateRekening = prevRekening
            .map(item => (newMap.has(item.key) ? { ...item, ...newMap.get(item.key)! } : item))
            .filter(item => newMap.has(item.key));


        response.forEach(item => {
            if (!prevMap.has(item.key)) {
                updateRekening.push(item);
            }
        });

        setRekening(updateRekening);

    } catch (error) {
        ShowToast('Ada masalah');
    }
};



export { fetchRekening }