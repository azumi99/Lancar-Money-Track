import React, { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { View, Text, HStack, Box, Divider, Spinner } from "@gluestack-ui/themed"
import SafeAreaCustom from "@components/safeArea"
import { getListCurrency } from "@services/Currency/getCurrency"
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

        async function fetchRates() {
            const result = await getListCurrency()
            let currencies = result.response

            const priorityCurrencies = ["IDR", "USD"]
            const priorityList = currencies.filter(currency =>
                priorityCurrencies.includes(currency.short_code)
            )
            const otherCurrencies = currencies.filter(currency =>
                !priorityCurrencies.includes(currency.short_code)
            )
            const sortedData = [...priorityList, ...otherCurrencies]

            const mergedData = sortedData.map(apiItem => {
                const existingItem = currency.find(c => c.id === apiItem.id)
                return existingItem ? { ...apiItem, is_default: existingItem.is_default } : { ...apiItem, is_default: false }
            })

            if (JSON.stringify(currency) !== JSON.stringify(mergedData)) {
                setCurrency(mergedData)
            }
            setFilteredData(mergedData)
            setIsLoading(false)
        }


        fetchRates()
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

    const handleSelectCurrency = (selectedItem: CurrencyItemInterface) => {
        const updatedCurrency = currency.map(item => ({
            ...item,
            is_default: item.id === selectedItem.id
        }))
        setCurrency(updatedCurrency)
        setShowModal(false);
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
