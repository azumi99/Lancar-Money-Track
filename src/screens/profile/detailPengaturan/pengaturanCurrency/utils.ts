import { useCurrency } from "@config/store";
import { getCurrencyRates, getListCurrency } from "@services/Currency/getCurrency";


export const fetchAllRates = async ({ currency }) => {
    try {
        // Get the default currency
        const defaultCurrency = currency.find(item => item.is_default)
        const baseCurrency = defaultCurrency ? defaultCurrency.short_code : "IDR"

        // Get rates data
        const ratesData = await getCurrencyRates(baseCurrency)
        console.log(`Fetching rates with base currency: ${baseCurrency}`)

        if (!ratesData || !ratesData.rates) {
            console.error("Invalid rates data returned:", ratesData)
            return currency
        }

        const rates = ratesData.rates
        console.log("Available rates:", Object.keys(rates).length)

        // Map the rates to each currency
        return currency.map(item => {
            const shortCode = item.short_code

            // For base currency, value_convert should be 1
            if (shortCode === baseCurrency) {
                return { ...item, value_convert: 1 }
            }

            // Try to find the rate for this currency
            const rate = rates[shortCode]
            if (rate !== undefined) {
                return { ...item, value_convert: rate }
            } else {
                return { ...item, value_convert: 0 }
            }
        })
    } catch (error) {
        console.error("Error fetching rates:", error)
        return currency
    }
}

export async function initialize({ setCurrency, setIsLoading, currency, setFilteredData }) {
    try {
        setIsLoading(true);

        const result = await getListCurrency();
        if (!result || !result.response) {
            setIsLoading(false);
            return;
        }

        let currencies = result.response;

        const priorityCurrencies = ["IDR", "USD"];
        const priorityList = currencies.filter(currency =>
            priorityCurrencies.includes(currency.short_code)
        );
        const otherCurrencies = currencies.filter(currency =>
            !priorityCurrencies.includes(currency.short_code)
        );
        const sortedData = [...priorityList, ...otherCurrencies];

        // Map awal
        let initialData = sortedData.map(apiItem => {
            const existingItem = currency.find(c => c.id === apiItem.id);
            return existingItem
                ? { ...apiItem, is_default: existingItem.is_default }
                : { ...apiItem, is_default: false };
        });

        // Jika tidak ada yang is_default, jadikan IDR default jika ada
        const hasDefault = initialData.some(item => item.is_default);
        if (!hasDefault) {
            const idx = initialData.findIndex(item => item.short_code === "IDR");
            if (idx !== -1) {
                initialData[idx].is_default = true;
            }
        }

        setCurrency(initialData);


        const dataWithRates = await fetchAllRates({ currency: initialData });
        setCurrency(dataWithRates);
        setFilteredData(dataWithRates);

    } catch (error) {
        console.error("Error initializing currency data:", error);
    } finally {
        setIsLoading(false);
    }
}


