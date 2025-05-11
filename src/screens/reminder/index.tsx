import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { AddIcon, AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, Box, Button, ButtonText, EditIcon, Fab, FabIcon, HStack, ScrollView, Text, TrashIcon, View, VStack } from "@gluestack-ui/themed"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { DeleteReminder, GetReminders, InterfaceReminder, ToggleReminderCompletion } from "@screens/reminder/model"
import { ShowToast } from "@components/toast"
import { Swipeable } from "react-native-gesture-handler"
import { requestNotificationPermission, scheduleReminderNotification } from "@screens/reminder/utils"
import PushNotification from 'react-native-push-notification';

const ReminderScreen = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const [reminders, setReminders] = useState<InterfaceReminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedReminderId, setSelectedReminderId] = useState<number | null>(null);

    useEffect(() => {
        if (isFocused) {
            loadReminders();
        }
        requestNotificationPermission()
    }, [isFocused]);

    const loadReminders = async () => {
        try {
            setLoading(true);
            const data = await GetReminders();
            setReminders(data);

            data.forEach(reminder => {

                scheduleReminderNotification(reminder);

            });

        } catch (error) {
            console.error('Error loading reminders:', error);
            ShowToast('Gagal memuat data pengingat');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        navigation.navigate('StackNav', {
            screen: "FormReminderScreen",
            params: { reminderId: id }
        });
    };

    const handleDelete = async () => {
        if (selectedReminderId) {
            try {
                await DeleteReminder(selectedReminderId);
                loadReminders();
                PushNotification.cancelLocalNotifications({ id: selectedReminderId.toString() });
            } catch (error) {
                console.error('Error deleting reminder:', error);
                ShowToast('Gagal menghapus pengingat');
            }
            setShowDeleteAlert(false);
        }
    };

    const confirmDelete = (id: number) => {
        setSelectedReminderId(id);
        setShowDeleteAlert(true);
    };


    return (
        <SafeAreaCustom>
            {loading ? (
                <View flex={1} justifyContent="center" alignItems="center">
                    <Text>Memuat data...</Text>
                </View>
            ) : (
                <>
                    <ScrollView paddingVertical={16}>
                        <VStack space="xs">
                            {reminders.length > 0 ? (
                                reminders.map((reminder) => (
                                    <Swipeable
                                        key={reminder.id}
                                        renderRightActions={() => (
                                            <TouchableOpacity
                                                onPress={() => confirmDelete(reminder.id || 0)}

                                            >
                                                <Box alignItems="center" bgColor="$red400" width={80} justifyContent="center" height={'$full'}>
                                                    <TrashIcon size="lg" color="white" />
                                                </Box>
                                            </TouchableOpacity>
                                        )}
                                    >
                                        <View bg="$secondary100" paddingVertical={10} paddingHorizontal={16}>
                                            <HStack justifyContent="space-between" alignItems="center">
                                                <TouchableOpacity
                                                    onPress={() => handleEdit(reminder.id || 0)}
                                                    style={{ flex: 1 }}
                                                >
                                                    <HStack space="md" alignItems="center">
                                                        <VStack>
                                                            <Text
                                                                fontSize={16}
                                                                textDecorationLine={reminder.isCompleted ? "line-through" : "none"}
                                                            >
                                                                {reminder.name}
                                                            </Text>
                                                            <Text fontSize={12} color="$gray600">{reminder.frequency}</Text>
                                                        </VStack>
                                                    </HStack>
                                                </TouchableOpacity>
                                                <HStack space="md" alignItems="center">
                                                    <Text>{reminder.time}</Text>
                                                </HStack>
                                            </HStack>
                                        </View>
                                    </Swipeable>
                                ))
                            ) : (
                                <View padding={16} alignItems="center">
                                    <Text>Belum ada pengingat. Tambahkan pengingat baru.</Text>
                                </View>
                            )}
                        </VStack>
                    </ScrollView>
                    <Fab
                        size="lg"
                        placement="bottom right"
                        bgColor="$yellow500"
                        onPress={() => navigation.navigate('StackNav', { screen: "FormReminderScreen" })}
                    >
                        <FabIcon as={AddIcon} />
                    </Fab>

                    {/* Delete Confirmation Dialog */}
                    <AlertDialog isOpen={showDeleteAlert} onClose={() => setShowDeleteAlert(false)}>
                        <AlertDialogBackdrop />
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <Text size="lg" fontWeight="bold">Hapus Pengingat</Text>
                            </AlertDialogHeader>
                            <AlertDialogBody>
                                <Text>Apakah Anda yakin ingin menghapus pengingat ini? Tindakan ini tidak dapat dibatalkan.</Text>
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button
                                    variant="outline"
                                    action="secondary"
                                    mr="$3"
                                    onPress={() => setShowDeleteAlert(false)}
                                >
                                    <ButtonText>Batal</ButtonText>
                                </Button>
                                <Button
                                    bg="$error600"
                                    action="negative"
                                    onPress={handleDelete}
                                >
                                    <ButtonText>Hapus</ButtonText>
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
        </SafeAreaCustom>
    )
}

export { ReminderScreen }