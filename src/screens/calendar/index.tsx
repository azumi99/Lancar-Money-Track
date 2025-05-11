import { CurrencyFormatter } from "@components/curencyComponent";
import { formatThousand } from "@components/formatRibuan";
import { IconCustom } from "@components/iconCustom";
import { ModalCustom } from "@components/modalComponent"
import SafeAreaCustom from "@components/safeArea"
import { DateCalenderDetail, DefaultDate, ModalDate } from "@config/store"
import { AddIcon, Button, ButtonText, Fab, FabIcon, FabLabel, HStack, Text, View, VStack } from "@gluestack-ui/themed"
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { CatatanInterface } from "@screens/catatan/dummyData";
import { GetCatatan, InterfaceCatatan } from "@screens/catatan/models/crudCatatan";
import { playBeep } from "@utils/soundUtils";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, Agenda } from "react-native-calendars";
import { getCalendarDateString } from "react-native-calendars/src/services";
import MonthPicker from 'react-native-month-picker';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CalendarScreen = () => {
    const navigation = useNavigation<any>();
    const { modalDate, setModalDate } = ModalDate();
    const { setTitleDate } = DateCalenderDetail();
    const [dates, setDates] = useState(new Date());
    const { date, setDate } = DefaultDate()
    const [data, setData] = useState<InterfaceCatatan[]>([]);
    const year = dates.getFullYear();
    const shortMonth = dates.toLocaleString('default', { month: 'short' });
    const longMonth = dates.toLocaleString('default', { month: 'long' });
    useFocusEffect(
        useCallback(() => {
            setDate(`${shortMonth} ${year}`)
        }, [dates])
    );

    const [selected, setSelected] = useState('');


    const fetchData = async () => {
        try {
            const response = await GetCatatan();
            setData(response);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    const today = moment().format('YYYY-MM-DD');
    const markedDates = data.reduce((acc, value) => {
        const date = value?.tanggal;
        if (!date) return acc;
        if (!acc[date]) {
            acc[date] = {
                marked: true,
                dotColor: 'orange',
                customStyles: {
                    container: { backgroundColor: '#eab308' },
                    text: { color: 'black' }
                },
                notePemasukan: 0,
                notePengeluaran: 0
            };
        }
        if (value.jenis === 'pemasukan') {
            acc[date].notePemasukan += value.jumlah || 0;
        } else if (value.jenis === 'pengeluaran') {
            acc[date].notePengeluaran += value.jumlah || 0;
        }

        return acc;
    }, {});

    markedDates[today] = {
        ...(markedDates[today] || {}),

        dots: [
            {
                key: 'todayDot',
                color: 'blue',
                selectedDotColor: 'blue',
            },
        ],
    };



    return (
        <SafeAreaCustom>
            <View >

                <Calendar
                    monthFormat={'MMMM yyyy'}
                    initialDate={`${dates.getFullYear()}-${dates.getMonth() + 1}-${dates.getDate()}`}
                    markingType={'custom'}
                    markedDates={markedDates}
                    onDayPress={(day) => {
                        console.log('Selected date', day);

                    }}
                    dayComponent={({ date, state, marking }) => {

                        return (
                            <TouchableOpacity onPress={() => {
                                // console.log('Selected date', date);
                                playBeep();
                                const day = new Date(date.dateString);
                                const formattedDate = day.toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                });
                                console.log('Selected date', formattedDate);
                                setTitleDate(formattedDate);
                                navigation.navigate('StackNav', { screen: "DetailCalendar", params: { tanggal: date.dateString } })
                            }}>
                                <View style={{ alignItems: 'center' }}>
                                    <View
                                        style={[
                                            {
                                                width: 40,
                                                height: 40,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 5,
                                            },
                                            marking?.customStyles?.container,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                { textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black' },
                                                marking?.customStyles?.text,
                                            ]}
                                        >
                                            {date.day}
                                        </Text>
                                    </View>
                                    <VStack>
                                        {marking && marking.dots?.map((dot, index) => (
                                            <View
                                                alignSelf="center"
                                                key={index}
                                                style={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: 3,
                                                    backgroundColor: dot.color,

                                                }}
                                            />
                                        ))}
                                        {!marking?.dots &&
                                            marking && (
                                                <VStack>
                                                    <Text size="xs">
                                                        +{formatThousand(marking?.notePemasukan)?.length > 5
                                                            ? formatThousand(marking?.notePemasukan).slice(0, 5) + "..."
                                                            : formatThousand(marking?.notePemasukan)}
                                                    </Text>

                                                    <Text size="xs">
                                                        -{formatThousand(marking?.notePengeluaran)?.length > 5
                                                            ? formatThousand(marking?.notePengeluaran).slice(0, 5) + "..."
                                                            : formatThousand(marking?.notePengeluaran)}
                                                    </Text>


                                                </VStack>
                                            )


                                        }

                                    </VStack>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            <ModalCustom showModal={modalDate} setShowModal={setModalDate} showHeader={true} showFooter={true}
                footer={
                    <HStack alignItems="center" space="md" >
                        <Button onPress={() => { setDates(new Date); setModalDate(false) }} size="sm" borderRadius={10} action="negative" >
                            <ButtonText>Batalkan</ButtonText>
                        </Button>
                        <Button onPress={() => { setDate(`${shortMonth} ${year}`); setModalDate(false); }} size="sm" borderRadius={10} >
                            <ButtonText>Konfirmasi</ButtonText>
                        </Button>
                    </HStack>
                }
                title={`${longMonth} ${year}`}
                styleHeader={{ alignSelf: 'center' }}
            >
                <MonthPicker
                    selectedDate={dates}
                    onMonthChange={(date) => setDates(new Date(date))}
                    maxDate={moment()}
                    minDate={moment('01-01-2010', 'DD-MM-YYYY')}
                    currentMonthTextStyle={{ color: '#eab308' }}
                    selectedBackgroundColor={'#eab308'}
                    nextIcon={<IconCustom As={MaterialCommunityIcons} name="chevron-right" size={25} color="#eab308" />}
                    prevIcon={<IconCustom As={MaterialCommunityIcons} name="chevron-left" size={25} color="#eab308" />}
                />
            </ModalCustom>
            <Fab
                size="lg"
                placement="bottom right"
                bgColor="$yellow500"
                onPress={() => { playBeep(); navigation.navigate('StackNav', { screen: 'AddScreen', params: { name: true } }) }}
            >
                <FabIcon as={AddIcon} />
            </Fab>
        </SafeAreaCustom >
    )
}

export { CalendarScreen }