import React, { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { View, Text, HStack, Box, Divider, Spinner } from "@gluestack-ui/themed"
import SafeAreaCustom from "@components/safeArea"
import { getListCurrency, getCurrencyRates } from "@services/Currency/getCurrency"
import { TouchableOpacity } from "react-native-gesture-handler"
import { InputDefault } from "@components/input/inputDefault"
import { useCurrency, useCurrencySearch } from "@config/store"
import { IconCustom } from "@components/iconCustom"
import Ionicons from "react-native-vector-icons/Ionicons"
import { ModalKonfirmasiCurrency } from "./components/modalKonfirmasi"

export interface CurrencyItemInterface {
    id: number
    name: string
    short_code: string
    code: string
    precision: number
    subunit: number
    symbol: string
    symbol_first: boolean
    decimal_mark: string
    thousands_separator: string
    is_default: boolean
    value_convert: number
}

const CurrencyScreen = () => {
    const [filteredData, setFilteredData] = useState<CurrencyItemInterface[]>([]) // data hasil filter
    const [search, setSearch] = useState('')
    const { currencySearch, setCurrencySearch } = useCurrencySearch()
    const { currency, setCurrency } = useCurrency();
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState<CurrencyItemInterface | null>(null)

    const fetchAllRates = async () => {
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

    useEffect(() => {
        setCurrencySearch(false)

        async function initialize() {
            try {
                // Get the list of currencies
                const result = await getListCurrency()

                if (!result || !result.response) {
                    console.error("Invalid currency list data:", result)
                    setIsLoading(false)
                    return
                }

                let currencies = result.response

                // Apply priority sorting
                const priorityCurrencies = ["IDR", "USD"]
                const priorityList = currencies.filter(currency =>
                    priorityCurrencies.includes(currency.short_code)
                )
                const otherCurrencies = currencies.filter(currency =>
                    !priorityCurrencies.includes(currency.short_code)
                )
                const sortedData = [...priorityList, ...otherCurrencies]

                // Merge with existing state
                const initialData = sortedData.map(apiItem => {
                    const existingItem = currency.find(c => c.id === apiItem.id)
                    return existingItem
                        ? { ...apiItem, is_default: existingItem.is_default }
                        : { ...apiItem, is_default: apiItem.short_code === "IDR" }
                })

                // Set initial data to currency state
                setCurrency(initialData)

                // Now fetch and apply rates
                const dataWithRates = await fetchAllRates()
                setCurrency(dataWithRates)
                setFilteredData(dataWithRates)
            } catch (error) {
                console.error("Error initializing currency data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        initialize()
    }, [])

    useEffect(() => {
        if (search === '') {
            setFilteredData(currency)
        } else {
            const lowerSearch = search.toLowerCase()
            const filtered = currency.filter(item =>
                item.name.toLowerCase().includes(lowerSearch) ||
                item.short_code.toLowerCase().includes(lowerSearch)
            )
            setFilteredData(filtered)
        }
    }, [search, currency])

    const handleSelectCurrency = async (selectedItem: CurrencyItemInterface) => {
        try {
            setIsLoading(true)

            // Update default currency
            const updatedCurrency = currency.map(item => ({
                ...item,
                is_default: item.id === selectedItem.id
            }))
            setCurrency(updatedCurrency)
            setShowModal(false)

            // Fetch new rates for the selected currency
            const ratesData = await getCurrencyRates(selectedItem.short_code)
            if (!ratesData || !ratesData.rates) {
                console.error("Invalid rates data returned:", ratesData)
                setIsLoading(false)
                return
            }

            const rates = ratesData.rates

            // Update all currencies with new rates
            const finalCurrency = updatedCurrency.map(item => {
                if (item.short_code === selectedItem.short_code) {
                    return { ...item, value_convert: 1 }
                }

                const rate = rates[item.short_code]
                return { ...item, value_convert: rate !== undefined ? rate : 0 }
            })

            setCurrency(finalCurrency)
            setFilteredData(finalCurrency)
        } catch (error) {
            console.error("Error updating currency and rates:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePress = (item: CurrencyItemInterface) => {
        setSelectedItem(item)
        setShowModal(true)
    }

    const renderItem = ({ item }: { item: CurrencyItemInterface }) => (
        <>
            <TouchableOpacity onPress={() => handlePress(item)}>
                <Box paddingVertical={12} borderBottomWidth={0.5} borderColor="$coolGray200">
                    <HStack alignItems="center" justifyContent="space-between">
                        <HStack alignItems="center" space="xs">
                            <Text size="sm">{item.name}</Text>
                            <Text size="xs">({item.symbol})</Text>
                        </HStack>
                        <HStack alignItems="center" space="xs">
                            {item.is_default && <IconCustom As={Ionicons} name="checkmark-circle" color="green" size={20} />}
                            <Text size="sm">{item.short_code}</Text>
                        </HStack>
                    </HStack>
                </Box>
            </TouchableOpacity>
            {selectedItem?.id === item.id && (
                <ModalKonfirmasiCurrency
                    showModal={showModal}
                    setShowModal={setShowModal}
                    actionTrue={() => handleSelectCurrency(item)}
                />
            )}
        </>
    )

    return (
        <SafeAreaCustom>
            {currencySearch && (
                <View>
                    <Box paddingHorizontal={11} marginVertical={16}>
                        <InputDefault
                            autoFocus
                            changeText={setSearch}
                            showIcon
                            iconElement={<IconCustom As={Ionicons} name="search" size={20} />}
                        />
                    </Box>
                    <Divider my={'$0.5'} />
                </View>
            )}
            {isLoading ? <View justifyContent="center" alignItems="center" flex={1}>
                <Spinner size="large" />
            </View> : <FlatList
                data={filteredData}
                keyExtractor={(item) => item.name}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
            />}

        </SafeAreaCustom>
    )
}

export { CurrencyScreen }