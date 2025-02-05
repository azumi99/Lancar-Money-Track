import axios from "axios";


const API_URL = "https://api.currencybeacon.com/v1";
const API_KEY = "9GmqwTkIRJBemZ1QSn4jXjcZ5seZABtv";

async function getCurrencyRates(base = "IDR", symbols = "USD,EUR,GBP,IDR") {
    try {
        const response = await axios.get(`${API_URL}/latest`, {
            params: {
                base,
                symbols,
                api_key: API_KEY,
            },
        });
        console.log("Currency Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching currency data:", error);
    }
}


export { getCurrencyRates }
