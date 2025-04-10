import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { Box, HStack, ScrollView, Switch, Text, View, VStack } from "@gluestack-ui/themed"
import React from "react"
import { TouchableOpacity } from "react-native"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import Fontisto from "react-native-vector-icons/Fontisto"
import Octicons from "react-native-vector-icons/Octicons"
import { useNavigation } from "@react-navigation/native"
import { useThousandSeparatorStore } from "@components/formatRibuan"
import { useCurrency } from "@config/store"

const PengaturanScreen = () => {
    const navigation = useNavigation<any>();
    const { isActive, toggleActive } = useThousandSeparatorStore();
    console.log('togle', isActive)
    const { currency } = useCurrency();
    const defaultCurrency = currency.find(value => value.is_default);

    return (
        <SafeAreaCustom>
            <ScrollView marginVertical={16}>
                <VStack space="sm">
                    <TouchableOpacity>
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="person" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="lg">Profil</Text>
                                </HStack>
                                <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                            </HStack>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'KategoriSettings' })}>
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="layers-sharp" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="lg">Pengaturan kategori</Text>
                                </HStack>
                                <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                            </HStack>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'CurrencyScreen' })}>
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Fontisto} name="money-symbol" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="lg">Mata uang</Text>
                                </HStack>
                                <HStack alignItems="center" space="md">
                                    <Text size="xs">{defaultCurrency?.short_code} ({defaultCurrency?.symbol})</Text>
                                    <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                                </HStack>

                            </HStack>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="color-palette" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="lg">Tema</Text>
                                </HStack>
                                <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                            </HStack>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="disc-sharp" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="lg">Pemisah Ribuan</Text>
                                </HStack>

                                <Switch size="md" value={isActive} onToggle={toggleActive} />

                            </HStack>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'RekeningScreen' })}>
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="wallet-outline" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="lg">Rekening</Text>
                                </HStack>
                                <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                            </HStack>
                        </Box>
                    </TouchableOpacity>
                </VStack>
            </ScrollView>
        </SafeAreaCustom>
    )
}

export { PengaturanScreen }