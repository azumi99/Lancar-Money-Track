import React, { useEffect, useState } from 'react';
import {
    Box,
    HStack,
    VStack,
    Text,
    Modal,
    Center,
    ScrollView,
    View,
    ModalContent,
    ModalBackdrop
} from '@gluestack-ui/themed';
import SafeAreaCustom from '@components/safeArea';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconCustom } from '@components/iconCustom';
import { FlatList, TouchableOpacity } from 'react-native';
import { useKategoriStorePengeluaran } from '@config/store';
import { KategoriInterface } from '@screens/profile/detailPengaturan/pengaturanKategori/modelKategori';
import { CurrencyFormatter } from '@components/curencyComponent';
import { formatThousand, useThousandSeparatorStore } from '@components/formatRibuan';
import { AnggaranInterface, GetAnggaran, GetAnggaranByKategori, InsertAnggaran, UpdateAnggaranByKategori } from '@screens/anggaran/model';
import { ShowToast } from '@components/toast';


const AnggaranScreen = () => {
    const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
    const [editingCategory, setEditingCategory] = useState<KategoriInterface | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isMonthlyBudgetModal, setIsMonthlyBudgetModal] = useState<boolean>(false);
    const [tempAmount, setTempAmount] = useState<string>('');
    const [idKategori, setIdKategori] = useState<string>('');
    const [anggaran, setAnggaran] = useState<AnggaranInterface[]>([]);
    const { kategori } = useKategoriStorePengeluaran();

    const findAmount = (id: string) => {
        return anggaran.find(value => value.id_kategori === id) || { jumlah: 0 };
    };

    const getTotalBudgetExcludingMonthly = () => {
        return anggaran
            .filter(item => item.id_kategori !== '0')
            .reduce((total, item) => total + (item.jumlah || 0), 0);
    };

    const handleEditPress = (category: KategoriInterface) => {
        const monthlyBudgetData = anggaran.find(item => item.id_kategori === '0');
        if (!monthlyBudgetData || monthlyBudgetData.jumlah <= 0) {
            ShowToast('Anggaran bulanan harus diset terlebih dahulu');
            return;
        }

        setEditingCategory(category);
        setIdKategori(category.key);
        const existingAmount = findAmount(category.key).jumlah;
        setTempAmount(existingAmount ? existingAmount.toString() : '');
        setIsMonthlyBudgetModal(false);
        setModalVisible(true);
    };

    const handleEditMonthlyBudget = () => {
        setEditingCategory(null);
        setIdKategori('0');
        setTempAmount(monthlyBudget ? monthlyBudget.toString() : '');
        setIsMonthlyBudgetModal(true);
        setModalVisible(true);
    };

    const handleSaveAmount = async () => {
        try {
            const amountToSave = Number(tempAmount);

            if (idKategori === '0') {
                const totalOtherBudgets = getTotalBudgetExcludingMonthly();
                if (amountToSave < totalOtherBudgets && amountToSave !== 0) {
                    ShowToast('Anggaran bulanan tidak boleh kurang dari total anggaran kategori');
                    return;
                }
            }
            else {

                const monthlyBudgetData = anggaran.find(item => item.id_kategori === '0');
                if (!monthlyBudgetData || monthlyBudgetData.jumlah <= 0) {
                    ShowToast('Anggaran bulanan harus diset terlebih dahulu');
                    return;
                }

                const currentAmount = findAmount(idKategori).jumlah || 0;
                const otherBudgetsTotal = getTotalBudgetExcludingMonthly() - currentAmount;
                const totalAfterChange = otherBudgetsTotal + amountToSave;

                if (totalAfterChange > monthlyBudget) {
                    ShowToast('Total anggaran kategori tidak boleh melebihi anggaran bulanan');
                    return;
                }
            }

            const existing = await GetAnggaranByKategori(idKategori);
            if (existing) {
                await UpdateAnggaranByKategori(idKategori, amountToSave);
                ShowToast('Anggaran berhasil diupdate');
            } else {
                await InsertAnggaran(idKategori, amountToSave);
                ShowToast('Anggaran berhasil diset');
            }

            if (idKategori === '0') {
                setMonthlyBudget(amountToSave);
            }

            await getAnggaran();
            setModalVisible(false);
            setTempAmount('');

        } catch (error) {
            ShowToast('Ada masalah');
            console.error(error);
        }
    };


    const handleSetBudgetToZero = async (categoryId: string) => {
        try {

            if (categoryId === '0') {
                const totalOtherBudgets = getTotalBudgetExcludingMonthly();
                if (totalOtherBudgets > 0) {
                    ShowToast('Tidak bisa mereset anggaran bulanan karena masih ada anggaran kategori');
                    return;
                }
            }

            const existing = await GetAnggaranByKategori(categoryId);
            if (existing) {
                await UpdateAnggaranByKategori(categoryId, 0);
                ShowToast('Anggaran direset ke 0');


                if (categoryId === '0') {
                    setMonthlyBudget(0);
                }

                await getAnggaran();
            }
        } catch (error) {
            ShowToast('Ada masalah');
            console.error(error);
        }
    };

    const getAnggaran = async () => {
        try {
            const response = await GetAnggaran();
            setAnggaran(response);

            const monthlyBudgetData = response.find(item => item.id_kategori === '0');
            if (monthlyBudgetData) {
                setMonthlyBudget(monthlyBudgetData.jumlah);
            }
        } catch (error) {
            ShowToast('Ada masalah');
        }
    }

    useEffect(() => {
        getAnggaran();
    }, []);


    const handleNumberPress = (num: string) => {
        if (num === 'backspace') {
            setTempAmount(prev => prev.slice(0, -1));
        } else {
            setTempAmount(prev => {
                if ((prev === '' || prev === '0') && (num === '0' || num === '000')) {
                    return '0';
                }
                if (prev === '0' && num !== '0' && num !== '000') {
                    return num;
                }
                return prev + num;
            });
        }
    };


    const handleClear = () => {
        setTempAmount('');
    };
    const activeCategories = kategori.filter(k => (findAmount(k.key).jumlah || 0) > 0);
    const inactiveCategories = kategori.filter(k => (findAmount(k.key).jumlah || 0) === 0);
    const sortedCategories = [...activeCategories, ...inactiveCategories];


    const renderCategoryItem = ({ item }: { item: KategoriInterface }) => {
        const jumlahAnggaran = findAmount(item.key).jumlah || 0;
        const iconColor = jumlahAnggaran > 0 ? '#FF5252' : '#B0BEC5';

        return (
            <TouchableOpacity onPress={() => handleEditPress(item)}>
                <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    padding={16}
                    backgroundColor="white"
                    borderBottomWidth={1}
                    borderBottomColor="#EEE"
                >
                    <HStack alignItems="center">
                        {jumlahAnggaran > 0 ? (
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleSetBudgetToZero(item.key);
                                }}
                            >
                                <Center
                                    width={20}
                                    borderRadius={18}
                                    backgroundColor="#FF5252"
                                    marginRight={12}
                                >
                                    <IconCustom As={MaterialCommunityIcons} name="minus" size={20} color="white" />
                                </Center>
                            </TouchableOpacity>
                        ) : (
                            <Center
                                width={20}
                                borderRadius={18}
                                backgroundColor="#B0BEC5"
                                marginRight={12}
                            >
                                <IconCustom As={MaterialCommunityIcons} name="minus" size={20} color="white" />
                            </Center>
                        )}
                        <Center
                            width={36}
                            height={36}
                            borderRadius={18}
                            backgroundColor={'$yellow400'}
                            marginRight={12}
                        >
                            <IconCustom As={Ionicons} name={item.kategoriIcon} size={20} />
                        </Center>
                        <Text fontSize={16}>{item.title}</Text>
                    </HStack>

                    <HStack alignItems="center">
                        <Text fontSize={16} marginRight={8}>
                            {formatThousand(jumlahAnggaran)}
                        </Text>
                        <IconCustom As={MaterialCommunityIcons} name="chevron-right" size={20} color="#888" />
                    </HStack>
                </HStack>
            </TouchableOpacity>
        );
    };



    const NumPadButton = ({
        onPress,
        children,
        confirmButton = false
    }: {
        onPress: () => void,
        children: React.ReactNode,
        confirmButton?: boolean
    }) => (
        <TouchableOpacity
            style={{ flex: 1, marginHorizontal: 4 }}
            onPress={onPress}
        >
            <Center
                backgroundColor={confirmButton ? "#FFCA28" : "white"}
                borderRadius={4}
                height={60}
            >
                {children}
            </Center>
        </TouchableOpacity>
    );

    return (
        <SafeAreaCustom>
            <Box flex={1} backgroundColor="#F5F5F5">
                <TouchableOpacity onPress={handleEditMonthlyBudget}>
                    <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        padding={16}
                        backgroundColor="white"
                        borderBottomWidth={1}
                        borderBottomColor="#EEE"
                    >
                        <HStack alignItems="center">
                            {monthlyBudget > 0 ? (
                                <TouchableOpacity
                                    onPress={(e) => {
                                        e.stopPropagation(); // Prevent triggering parent TouchableOpacity
                                        handleSetBudgetToZero('0');
                                    }}
                                >
                                    <Center
                                        width={20}
                                        borderRadius={18}
                                        backgroundColor="#FF5252"
                                        marginRight={12}
                                    >
                                        <IconCustom As={MaterialCommunityIcons} name="minus" size={20} color="white" />
                                    </Center>
                                </TouchableOpacity>
                            ) : (
                                <Center
                                    width={20}
                                    borderRadius={18}
                                    backgroundColor="#B0BEC5"
                                    marginRight={12}
                                >
                                    <IconCustom As={MaterialCommunityIcons} name="minus" size={20} color="white" />
                                </Center>
                            )}
                            <Text fontSize={16}>Anggaran Bulanan</Text>
                        </HStack>

                        <HStack alignItems="center">
                            <Text fontSize={16} fontWeight="bold" marginRight={8}>{formatThousand(monthlyBudget)}</Text>
                            <IconCustom As={MaterialCommunityIcons} name="chevron-right" size={20} color="#888" />
                        </HStack>
                    </HStack>
                </TouchableOpacity>

                {/* Categories List */}
                <FlatList
                    data={sortedCategories}
                    renderItem={renderCategoryItem}
                    keyExtractor={item => item.key}
                />

            </Box>

            {/* Edit Modal */}
            <Modal
                isOpen={modalVisible}
                onClose={() => setModalVisible(false)}
                avoidKeyboard
            >
                <ModalBackdrop />
                <ModalContent marginBottom={0} marginTop="auto" width="$full" borderTopLeftRadius={20} borderTopRightRadius={20} >
                    <Box padding={16} borderBottomWidth={1} borderBottomColor="#EEE">
                        <Text fontSize={16} fontWeight="bold">
                            {isMonthlyBudgetModal ? 'Anggaran Bulanan' : `Anggaran Bulanan - ${editingCategory?.title}`}
                        </Text>
                    </Box>

                    <Box
                        height={60}
                        justifyContent="center"
                        alignItems="flex-end"
                        paddingHorizontal={16}
                        backgroundColor="white"
                        marginBottom={8}
                    >
                        <Text fontSize={24} fontWeight="bold">
                            {formatThousand(tempAmount) || '0'}
                        </Text>
                    </Box>

                    <Box padding={8}>
                        {/* Number pad rows */}
                        <HStack marginBottom={8} justifyContent="space-between">
                            <NumPadButton onPress={() => handleNumberPress('7')}>
                                <Text fontSize={20} fontWeight="bold">7</Text>
                            </NumPadButton>
                            <NumPadButton onPress={() => handleNumberPress('8')}>
                                <Text fontSize={20} fontWeight="bold">8</Text>
                            </NumPadButton>
                            <NumPadButton onPress={() => handleNumberPress('9')}>
                                <Text fontSize={20} fontWeight="bold">9</Text>
                            </NumPadButton>
                            <NumPadButton onPress={() => setModalVisible(false)}>
                                <IconCustom As={Ionicons} name="chevron-down" size={24} color="#000" />
                            </NumPadButton>
                        </HStack>

                        <HStack marginBottom={8} justifyContent="space-between">
                            <NumPadButton onPress={() => handleNumberPress('4')}>
                                <Text fontSize={20} fontWeight="bold">4</Text>
                            </NumPadButton>
                            <NumPadButton onPress={() => handleNumberPress('5')}>
                                <Text fontSize={20} fontWeight="bold">5</Text>
                            </NumPadButton>
                            <NumPadButton onPress={() => handleNumberPress('6')}>
                                <Text fontSize={20} fontWeight="bold">6</Text>
                            </NumPadButton>
                            <NumPadButton onPress={handleClear}>
                                <IconCustom As={MaterialCommunityIcons} name="trash-can-outline" size={24} color="#000" />
                            </NumPadButton>
                        </HStack>

                        <HStack marginBottom={8} justifyContent="space-between">
                            <NumPadButton onPress={() => handleNumberPress('1')}>
                                <Text fontSize={20} fontWeight="bold">1</Text>
                            </NumPadButton>
                            <NumPadButton onPress={() => handleNumberPress('2')}>
                                <Text fontSize={20} fontWeight="bold">2</Text>
                            </NumPadButton>
                            <NumPadButton onPress={() => handleNumberPress('3')}>
                                <Text fontSize={20} fontWeight="bold">3</Text>
                            </NumPadButton>
                            <Box flex={1} marginHorizontal={4} />
                        </HStack>

                        <HStack justifyContent="space-between">
                            <NumPadButton onPress={() => handleNumberPress('000')}>
                                <Text fontSize={20} fontWeight="bold">000</Text>
                            </NumPadButton>
                            <NumPadButton onPress={() => handleNumberPress('0')}>
                                <Text fontSize={20} fontWeight="bold">0</Text>
                            </NumPadButton>
                            <NumPadButton onPress={() => handleNumberPress('backspace')}>
                                <IconCustom As={MaterialCommunityIcons} name="backspace-outline" size={24} color="#000" />
                            </NumPadButton>
                            <NumPadButton onPress={handleSaveAmount} confirmButton>
                                <IconCustom As={MaterialCommunityIcons} name="check" size={24} color="#000" />
                            </NumPadButton>
                        </HStack>
                    </Box>
                </ModalContent>
            </Modal>
        </SafeAreaCustom>
    );
};

export { AnggaranScreen };