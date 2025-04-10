import axios from "axios";


const API_URL = "https://api.currencybeacon.com/v1";
const API_KEY = "LAc6yDKGi2YMvPNrBhTyrDiZXWsRU3vo";

async function getCurrencyRates(base = "IDR") {
    try {
        const response = await axios.get(`${API_URL}/latest`, {
            params: {
                base,
                api_key: API_KEY,
            },
        });
        // console.log("Currency Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching currency data:", error);
    }
}

async function getListCurrency() {
    try {
        const response = await axios.get(`${API_URL}/currencies`, {
            params: {
                type: 'fiat',
                api_key: API_KEY,
            },
        });
        // console.log("Currency Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching currency data:", error);
    }
}



export { getCurrencyRates, getListCurrency }
