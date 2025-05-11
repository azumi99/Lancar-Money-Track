import React, { useEffect, useState } from "react";
import {
    VStack, Text, Button, ButtonText, HStack, ScrollView, Spinner, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Icon, Heading,
    CloseIcon,
    View
} from "@gluestack-ui/themed";
import { backupDatabaseToDrive, deleteBackupFile, downloadBackupFile, getBackupList } from "./utils"; // Pastikan untuk mengimport downloadBackupFile
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { DeleteConfirm } from "@components/modalConfirm/deleteConfirm";
import { ShowToast } from "@components/toast";
import { UserStore } from "@config/store";


const BackupScreen = () => {
    const [loading, setLoading] = useState(false);
    const { user } = UserStore();
    const [loadingStore, setLoadingStore] = useState(false);
    const [backupList, setBackupList] = useState<any[]>([]);
    const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false); // Untuk modal konfirmasi restore
    const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null); // ID backup yang dipilih untuk restore
    const [showAlertDialog, setShowAlertDialog] = React.useState(false)
    // Fungsi untuk melakukan backup ke Google Drive
    const handleBackup = async () => {
        setLoading(true);
        const time = await backupDatabaseToDrive();
        if (time) setLastBackupTime(time);
        await fetchBackupList();
        setLoading(false);
    };

    // Fungsi untuk mengambil daftar backup dari Google Drive
    const fetchBackupList = async () => {
        const list = await getBackupList();
        setBackupList(list);
        if (list?.length) {
            setLastBackupTime(list[0].createdTime);
        }
    };

    // Fungsi untuk handle restore file dari backup
    const handleRestore = async (backupId: string) => {
        setShowModal(false)
        const token = (await GoogleSignin.getTokens()).accessToken;
        try {
            setLoadingStore(true);
            await downloadBackupFile(backupId, token); // Gantilah dengan token akses yang valid
            console.log('Restore selesai');
            setShowModal(false); // Menutup modal setelah restore
        } catch (error) {
            console.error('Proses restore gagal:', error);
        } finally {
            setLoadingStore(false);
            setShowModal(false)
            ShowToast('Restore berhasil')
        }
    };

    const handleDelete = async (backupId: string) => {
        const token = (await GoogleSignin.getTokens()).accessToken;
        try {
            await deleteBackupFile(backupId, token);
            await fetchBackupList();
        } catch (error) {
            console.error("Gagal menghapus backup:", error);
        } finally {
            setShowModal(false);
            ShowToast('Backup dihapus')
        }
    };

    useEffect(() => {
        fetchBackupList();
    }, []);

    return (
        <ScrollView>
            {user !== null ? <VStack space="lg" p="$5" pt="$8">
                <Text fontSize="$xl" fontWeight="bold">Backup Database</Text>
                <Text>Simpan data terbaru ke Google Drive</Text>

                <Button onPress={handleBackup} bg="$yellow500" borderRadius="$full" mt="$4">
                    {loading ? <Spinner color="$white" /> : <ButtonText color="$black">Backup Sekarang</ButtonText>}
                </Button>

                {lastBackupTime && (
                    <VStack mt="$6" space="sm">
                        <Text fontWeight="bold">Backup Terakhir:</Text>
                        <Text>{new Date(lastBackupTime).toLocaleString()}</Text>
                    </VStack>
                )}

                {backupList.length > 0 && (
                    <VStack mt="$8" space="sm">
                        <Text fontWeight="bold" mb="$2">Daftar Backup:</Text>
                        {backupList.map((item, index) => (
                            <HStack key={index} justifyContent="space-between" borderBottomWidth={1} borderColor="$gray200" py="$2">
                                <VStack>
                                    <Text size="xs">{item.name}</Text>
                                    <Text size="xs" >{new Date(item.createdTime).toLocaleString()}</Text>
                                    <HStack space="xs">
                                        <Button size="xs" onPress={() => { setSelectedBackupId(item.id); setShowModal(true); }} bg="$yellow500" borderRadius="$full">
                                            <ButtonText>{loadingStore ? <Spinner color="$white" /> : 'Restore'}</ButtonText>
                                        </Button>
                                        <HStack>
                                            <Button size="xs" onPress={() => { setSelectedBackupId(item.id); setShowAlertDialog(true); }} bg="$red500" borderRadius="$full">
                                                <ButtonText color="$white">Hapus</ButtonText>
                                            </Button>
                                        </HStack>
                                    </HStack>

                                </VStack>
                                {/* Tombol Restore */}

                            </HStack>
                        ))}
                    </VStack>
                )}
            </VStack> :
                <VStack flex={1} alignItems="center" justifyContent="center">
                    <Text>Silahkan login terlebih dahulu</Text>
                </VStack>
            }

            <DeleteConfirm showAlertDialog={showAlertDialog} setShowAlertDialog={setShowAlertDialog} title={"Apakah anda yakin akan menghapus?"} actionConfirm={() => selectedBackupId && handleDelete(selectedBackupId)} />
            {/* Modal Konfirmasi Restore */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">Konfirmasi Restore</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text>
                            Apakah Anda yakin ingin memulihkan backup ini? Proses ini akan mengembalikan data ke kondisi saat backup terakhir.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            action="secondary"
                            mr="$3"
                            onPress={() => {
                                setShowModal(false);
                            }}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            size="sm"
                            action="positive"
                            borderWidth='$0'
                            onPress={() => selectedBackupId && handleRestore(selectedBackupId)}
                        >
                            <ButtonText>Restore</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </ScrollView>
    );
};

export { BackupScreen };
