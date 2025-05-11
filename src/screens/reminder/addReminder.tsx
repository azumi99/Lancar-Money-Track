import { InputDefault } from "@components/input/inputDefault"
import SafeAreaCustom from "@components/safeArea"
import { SelectComponent } from "@components/select"
import { Box, ScrollView, Text, View, VStack } from "@gluestack-ui/themed"
import { DateModal } from "@screens/add/componenets/pickDateModal"
import React, { useEffect, useState } from "react"
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from "react-native"
import { AddReminder, GetReminderById, UpdateReminder } from "@screens/reminder/model"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ShowToast } from "@components/toast"

const FormReminderScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { reminderId } = route.params || {};

    const [name, setName] = useState("");
    const [frequency, setFrequency] = useState('Sekali sehari')
    const frequencyData = [
        { label: "Sekali", value: "Sekali" },
        { label: "Sekali sehari", value: "Sekali sehari" },
        { label: "Mingguan", value: "Mingguan" },
        { label: "Bulanan", value: "Bulanan" },
    ]
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const getFormattedDate = () => {
        const date = new Date(startDate);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'short' });
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };
    const [time, setTime] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const [notes, setNotes] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Load data if editing
    useEffect(() => {
        if (reminderId) {
            setIsEditing(true);
            loadReminderData();
        }
    }, [reminderId]);

    const loadReminderData = async () => {
        try {
            const reminder = await GetReminderById(reminderId);
            setName(reminder.name);
            setFrequency(reminder.frequency);
            setStartDate(reminder.startDate);

            // Parse time from string to Date object
            const [hours, minutes] = reminder.time.split(' : ').map(Number);
            const timeDate = new Date();
            timeDate.setHours(hours);
            timeDate.setMinutes(minutes);
            setTime(timeDate);

            setNotes(reminder.notes);
        } catch (error) {
            console.error('Error loading reminder:', error);
            ShowToast('Gagal memuat data pengingat');
        }
    };

    const onChange = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowTime(false);
            return;
        }

        if (event.type === 'set') {
            setShowTime(false);
            if (selectedDate) {
                setTime(selectedDate);
            }
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            ShowToast('Nama pengingat tidak boleh kosong');
            return;
        }

        const timeString = `${String(time.getHours()).padStart(2, '0')} : ${String(time.getMinutes()).padStart(2, '0')}`;

        try {
            if (isEditing) {
                await UpdateReminder(reminderId, name, frequency, startDate, timeString, notes);
            } else {
                await AddReminder(name, frequency, startDate, timeString, notes);
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving reminder:', error);
        }
    };

    return (
        <SafeAreaCustom>
            <ScrollView>
                <VStack space="xl" padding={16}>
                    <InputDefault
                        value={name}
                        changeText={(value) => setName(value)}
                        label="Nama pengingat"
                    />
                    <SelectComponent
                        valueChange={setFrequency}
                        data={frequencyData}
                        label="Frekuensi"
                        selectDefault={frequency}
                    />
                    <InputDefault
                        value={getFormattedDate()}
                        label="Tanggal mulai pengingat"
                        changeText={() => { }}
                        onFocus={() => setIsDatePickerOpen(true)}
                        readonly={true}
                    />
                    <InputDefault
                        value={`${String(time.getHours()).padStart(2, '0')} : ${String(time.getMinutes()).padStart(2, '0')}`}
                        label="Waktu"
                        changeText={() => { }}
                        onFocus={() => setShowTime(true)}
                        readonly={true}
                    />
                    {showTime &&
                        <RNDateTimePicker
                            value={time}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    }
                    <InputDefault
                        value={notes}
                        changeText={(value) => setNotes(value)}
                        label="Catatan"
                    />
                    <View mt={20}>
                        <TouchableOpacity onPress={handleSave}>
                            <Box bg="$yellow300" borderRadius={10} py={10}>
                                <Text textAlign="center">{isEditing ? 'Perbarui' : 'Simpan'}</Text>
                            </Box>
                        </TouchableOpacity>
                    </View>
                </VStack>
            </ScrollView>
            <DateModal
                showModal={isDatePickerOpen}
                setShowModal={setIsDatePickerOpen}
                getFormatedDate={getFormattedDate()}
                setDate={setStartDate}
                date={startDate}
            />
        </SafeAreaCustom>
    )
}

export { FormReminderScreen }