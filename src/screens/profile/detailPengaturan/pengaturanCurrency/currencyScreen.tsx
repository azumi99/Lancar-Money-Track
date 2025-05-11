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
import { initialize } from "./utils"

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



    useEffect(() => {
        setCurrencySearch(false)

        initialize({ currency, setCurrency, setFilteredData, setIsLoading })
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