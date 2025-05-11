import SafeAreaCustom from "@components/safeArea"
import {
    ScrollView, View, Text, Box, AddIcon, Fab, FabIcon,
    VStack, HStack, Pressable, Heading, Divider,
    AlertDialog, AlertDialogBackdrop, AlertDialogContent,
    AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
    ButtonText, Button, CloseIcon, CheckIcon, TrashIcon, EditIcon,
    Icon
} from "@gluestack-ui/themed"
import { useNavigation } from "@react-navigation/native"
import React, { useState, useEffect, useCallback } from "react"
import { TouchableOpacity, RefreshControl } from "react-native"
import {
    GetPembayaranRegular,
    DeletePembayaranRegular,
    ToggleStatusPembayaranRegular,
    processScheduledPayments,
    InterfacePembayaranRegular
} from "@screens/pembayaran/model"
import { ShowToast } from "@components/toast"
import { useFocusEffect } from '@react-navigation/native'
import { IconCustom } from "@components/iconCustom"

const PembayaranScreen = () => {
    const navigation = useNavigation<any>()
    const [pembayaranList, setPembayaranList] = useState<InterfacePembayaranRegular[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null)

    const fetchData = async () => {
        try {
            setRefreshing(true)
            const data = await GetPembayaranRegular()
            setPembayaranList(data)
            await processScheduledPayments()

            setRefreshing(false)
        } catch (error) {
            ShowToast("Gagal memuat data pembayaran")
            setRefreshing(false)
        }
    }

    // Refresh when screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchData()
            return () => { } // Cleanup function
        }, [])
    )

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            await ToggleStatusPembayaranRegular(id, !currentStatus)
            ShowToast(`Pembayaran ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
            fetchData()
        } catch (error) {
            console.error("Error toggling status:", error)
            ShowToast("Gagal mengubah status pembayaran")
        }
    }

    const handleEditPayment = (id: number) => {
        navigation.navigate("StackNav", {
            screen: "PembayaranFormScreen",
            params: { pembayaranId: id }
        })
    }

    const handleDeleteConfirm = () => {
        setDeleteDialogOpen(true)
    }

    const handleDeletePayment = async () => {
        if (selectedPaymentId) {
            try {
                await DeletePembayaranRegular(selectedPaymentId)
                setDeleteDialogOpen(false)
                fetchData()
            } catch (error) {
                console.error("Error deleting payment:", error)
                ShowToast("Gagal menghapus pembayaran")
            }
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID').format(amount)
    }

    const renderFrequencyLabel = (frequency: string, completed: number, total: number | null) => {
        if (total === null) {
            return `${frequency} (${completed}/∞)`
        }
        return `${frequency} (${completed}/${total})`
    }

    return (
        <SafeAreaCustom>
            <ScrollView
                flex={1}
                bgColor="$white"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchData}
                    />
                }
            >
                <Box px="$4" py="$3" bg="$coolGray100">
                    <Heading size="sm">Pembayaran Reguler Terjadwal</Heading>
                </Box>

                {pembayaranList.length === 0 && !refreshing && (
                    <Box p="$4" alignItems="center">
                        <Text color="$coolGray500">Belum ada pembayaran reguler</Text>
                    </Box>
                )}

                {pembayaranList.map((item) => (
                    <Box
                        key={item.id}
                        borderBottomWidth={1}
                        borderColor="$coolGray200"
                    >
                        <Pressable
                            onPress={() => {
                                setSelectedPaymentId(item.id)
                                handleEditPayment(item.id)
                            }}
                        >
                            <Box px="$4" py="$3">
                                <HStack justifyContent="space-between" alignItems="center">
                                    <VStack flex={1} space="xs">
                                        <HStack space="sm" alignItems="center">
                                            <Text fontWeight="$bold" fontSize="$md">
                                                {item.nama_pembayaran}
                                            </Text>
                                            {!item.aktif && (
                                                <Box bg="$coolGray200" px="$1" borderRadius="$sm">
                                                    <Text fontSize="$xs" color="$coolGray600">Nonaktif</Text>
                                                </Box>
                                            )}
                                        </HStack>

                                        <Text color="$coolGray500" fontSize="$sm">
                                            {renderFrequencyLabel(
                                                item.frekuensi,
                                                item.jumlah_terlaksana,
                                                item.batas_jumlah_kali
                                            )}
                                        </Text>
                                    </VStack>

                                    <HStack space="md" alignItems="center">
                                        <Text
                                            fontWeight="$medium"
                                            color={item.jenis === 'pemasukan' ? '$green700' : '$red700'}
                                        >
                                            {item.jenis === 'pemasukan' ? '+' : '-'}
                                            {formatCurrency(item.jumlah)}
                                        </Text>

                                        <HStack space="sm">
                                            <Pressable
                                                onPress={() => handleToggleStatus(item.id, item.aktif)}
                                                hitSlop={8}
                                            >
                                                <Box
                                                    bg={item.aktif ? "$green100" : "$coolGray200"}
                                                    p="$1"
                                                    borderRadius="$full"
                                                >
                                                    <Icon
                                                        as={CheckIcon}
                                                        color={item.aktif ? "$green700" : "$coolGray500"}
                                                        size="sm"
                                                    />
                                                </Box>
                                            </Pressable>

                                            <Pressable
                                                onPress={() => {
                                                    setSelectedPaymentId(item.id)
                                                    handleDeleteConfirm()
                                                }}
                                                hitSlop={8}
                                            >
                                                <Box
                                                    bg="$red100"
                                                    p="$1"
                                                    borderRadius="$full"
                                                >
                                                    <Icon as={TrashIcon} color="$red700" size="sm" />
                                                </Box>
                                            </Pressable>
                                        </HStack>
                                    </HStack>
                                </HStack>
                            </Box>
                        </Pressable>
                    </Box>
                ))}
            </ScrollView>

            <Fab
                size="lg"
                placement="bottom right"
                bgColor="$yellow500"
                onPress={() => navigation.navigate("StackNav", { screen: "PembayaranFormScreen" })}
            >
                <FabIcon as={AddIcon} />
            </Fab>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading size="lg">Hapus Pembayaran</Heading>
                        <Pressable onPress={() => setDeleteDialogOpen(false)}>
                            <Icon as={CloseIcon} />
                        </Pressable>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text>
                            Apakah Anda yakin ingin menghapus pembayaran reguler ini?
                            Semua jadwal pembayaran selanjutnya akan dibatalkan.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button
                            variant="outline"
                            action="secondary"
                            mr="$3"
                            onPress={() => setDeleteDialogOpen(false)}
                        >
                            <ButtonText>Batal</ButtonText>
                        </Button>
                        <Button
                            action="negative"
                            bgColor="$red600"
                            onPress={handleDeletePayment}
                        >
                            <ButtonText>Hapus</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SafeAreaCustom>
    )
}

export { PembayaranScreen }