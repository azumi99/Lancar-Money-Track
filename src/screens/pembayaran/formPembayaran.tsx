import { InputDefault } from "@components/input/inputDefault"
import SafeAreaCustom from "@components/safeArea"
import { SelectComponent } from "@components/select"
import { ScrollView, View, VStack, Button, ButtonText, HStack, Text, Box } from "@gluestack-ui/themed"
import { DateModal } from "@screens/add/componenets/pickDateModal"
import React, { useState, useEffect } from "react"
import { ShowToast } from "@components/toast"
import { useNavigation, useRoute } from "@react-navigation/native"
import { AddPembayaranRegular, GetPembayaranRegularById, UpdatePembayaranRegular } from "@screens/pembayaran/model"
import { SheetPickRekening } from "@screens/add/componenets/sheetPickRekening"
import { useDefaultOpenRek, useKategoriStorePemasukan, useKategoriStorePengeluaran, useRekeningData, useSelectedKategori } from "@config/store"
import { IconCustom } from "@components/iconCustom"
import Ionicons from "react-native-vector-icons/Ionicons"

const PembayaranFormScreen = () => {
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const pembayaranId = route.params?.pembayaranId
    const isEditing = !!pembayaranId

    // Form state
    const [namaPembayaran, setNamaPembayaran] = useState('')
    const [frekuensi, setFrekuensi] = useState('Bulanan')
    const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10))
    const [jumlah, setJumlah] = useState("")
    const [jenis, setJenis] = useState('pengeluaran')
    const useKategoriByJenis = (jenis: string) => {
        const pemasukanStore = useKategoriStorePemasukan();
        const pengeluaranStore = useKategoriStorePengeluaran();

        const storeKategori = jenis === 'pemasukan' ? pemasukanStore : pengeluaranStore;

        return {
            kategori: storeKategori.kategori,
            setKategori: storeKategori.setKategori,
        }
    }
    const [batasJumlahKali, setBatasJumlahKali] = useState("0") // 0 means unlimited
    const { rekening } = useRekeningData();
    const defaultSelect = rekening.find(value => value.is_default);
    const [selectedRekening, setSelectedRekening] = useState<number | undefined>(defaultSelect?.key);
    const [rekeningTf, setRekeningTf] = useState("")
    const [catatan, setCatatan] = useState("")
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [showActionsheet, setShowActionsheet] = useState(false)
    const handleClose = () => setShowActionsheet(!showActionsheet)
    const { defaultHandle, setHandleDefault } = useDefaultOpenRek();
    const rekeningValue = rekening.find(value => value.key === selectedRekening);
    const [matauang, setMatauang] = useState(rekeningValue ? rekeningValue?.matauang : "")
    const { selectedIndex, setSelectedIndex } = useSelectedKategori();
    const { kategori, setKategori } = useKategoriByJenis(jenis)
    const dataKategori = kategori.find((item) => item.key == selectedIndex);

    const frekuensiData = [
        { label: "Harian", value: "Harian" },
        { label: "Mingguan", value: "Mingguan" },
        { label: "Bulanan", value: "Bulanan" },
        { label: "Tahunan", value: "Tahunan" },
    ]

    const jenisData = [
        { label: "Pemasukan", value: "pemasukan" },
        { label: "Pengeluaran", value: "pengeluaran" },
    ]


    const batasData = [
        { label: "Tidak Terbatas", value: "0" },
        { label: "1 kali", value: "1" },
        { label: "2 kali", value: "2" },
        { label: "3 kali", value: "3" },
        { label: "5 kali", value: "5" },
        { label: "10 kali", value: "10" },
        { label: "12 kali", value: "12" },
        { label: "24 kali", value: "24" },
        { label: "36 kali", value: "36" },
        { label: "48 kali", value: "48" },
        { label: "60 kali", value: "60" },
    ]

    useEffect(() => {
        if (isEditing) {
            const loadPembayaran = async () => {
                try {
                    const pembayaran = await GetPembayaranRegularById(pembayaranId)
                    if (pembayaran) {
                        setNamaPembayaran(pembayaran.nama_pembayaran)
                        setFrekuensi(pembayaran.frekuensi)
                        setTanggal(pembayaran.tanggal_mulai)
                        setJumlah(pembayaran.jumlah.toString())
                        setJenis(pembayaran.jenis)
                        setBatasJumlahKali(pembayaran.batas_jumlah_kali?.toString() || "0")
                        setSelectedIndex(pembayaran.id_kategori.toString())
                        setSelectedRekening(pembayaran.id_rekening)
                        setCatatan(pembayaran.catatan)
                        setMatauang(pembayaran.matauang || "")
                    }
                } catch (error) {
                    console.error("Error loading pembayaran:", error)
                    ShowToast("Gagal memuat data pembayaran")
                }
            }

            loadPembayaran()
        }
    }, [pembayaranId, isEditing])

    const getFormattedDate = () => {
        const date = new Date(tanggal);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'short' });
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const handleSave = async () => {

        if (!namaPembayaran) {
            ShowToast("Nama pembayaran harus diisi")
            return
        }

        if (!jumlah || parseInt(jumlah) <= 0) {
            ShowToast("Jumlah harus diisi dengan nilai positif")
            return
        }

        if (!kategori) {
            ShowToast("Kategori harus dipilih")
            return
        }

        if (!rekening) {
            ShowToast("Rekening harus dipilih")
            return
        }

        if (jenis === 'transfer' && !rekeningTf) {
            ShowToast("Rekening tujuan harus dipilih untuk transfer")
            return
        }

        try {
            const jumlahValue = parseInt(jumlah)
            const batasValue = batasJumlahKali === "0" ? null : parseInt(batasJumlahKali)
            const kategoriValue = parseInt(selectedIndex)
            const rekeningValue = selectedRekening
            const rekeningTfValue = rekeningTf ? parseInt(rekeningTf) : null
            const rekVal = rekening.find(value => value.key === selectedRekening);
            const matauangVal = rekVal?.matauang;

            if (isEditing) {
                await UpdatePembayaranRegular(
                    pembayaranId,
                    namaPembayaran,
                    frekuensi,
                    tanggal,
                    jumlahValue,
                    batasValue,
                    jenis,
                    kategoriValue,
                    rekeningValue,
                    rekeningTfValue,
                    catatan,
                    matauangVal
                )
                ShowToast("Pembayaran reguler berhasil diperbarui")
            } else {
                await AddPembayaranRegular(
                    namaPembayaran,
                    frekuensi,
                    tanggal,
                    jumlahValue,
                    batasValue,
                    jenis,
                    kategoriValue,
                    rekeningValue,
                    rekeningTfValue,
                    catatan,
                    matauangVal
                )
                ShowToast("Pembayaran reguler berhasil ditambahkan")
            }

            navigation.goBack()
        } catch (error) {
            console.error("Error saving pembayaran:", error)
            ShowToast("Gagal menyimpan pembayaran reguler")
        }
    }

    return (
        <SafeAreaCustom>
            <ScrollView>
                <View mb={50}>
                    <VStack space="xl" paddingHorizontal={16} marginVertical={16}>
                        <Text fontSize="$xl" fontWeight="$bold">
                            {isEditing ? "Edit Pembayaran Reguler" : "Tambah Pembayaran Reguler"}
                        </Text>

                        <InputDefault
                            changeText={(value) => setNamaPembayaran(value)}
                            value={namaPembayaran}
                            label="Nama Pembayaran"
                            placeHolder="Masukkan nama pembayaran"
                        />

                        <SelectComponent
                            valueChange={setFrekuensi}
                            data={frekuensiData}
                            label="Frekuensi Pembayaran"
                            selectDefault={frekuensi}
                        />

                        <InputDefault
                            value={getFormattedDate()}
                            label="Tanggal mulai pembayaran"
                            changeText={() => { }}
                            onFocus={() => setIsDatePickerOpen(true)}
                            readonly={true}
                        />

                        <InputDefault
                            changeText={(value) => setJumlah(value.replace(/[^0-9]/g, ''))}
                            value={jumlah}
                            label="Jumlah (Setiap kali)"
                            fieldInput="numeric"
                            placeHolder="Masukkan jumlah"
                        />

                        <SelectComponent
                            valueChange={setBatasJumlahKali}
                            data={batasData}
                            label="Batas jumlah kali"
                            selectDefault={batasJumlahKali}
                        />

                        <SelectComponent
                            valueChange={setJenis}
                            data={jenisData}
                            label="Jenis"
                            selectDefault={jenis}
                        />

                        <InputDefault
                            value={dataKategori ? dataKategori.title : ""}
                            showIcon={dataKategori ? true : false}
                            iconElement={<Box borderRadius={'$full'} padding={7} bgColor="$yellow300" alignItems="center"><IconCustom As={Ionicons} name={dataKategori?.kategoriIcon} /></Box>}
                            label="Kategori"
                            changeText={() => { }}
                            onFocus={() => navigation.navigate('StackNav', { screen: 'AddScreen', params: { regular: true, jenis: jenis } })}
                            readonly={true}
                        />

                        <InputDefault
                            value={rekeningValue ? rekeningValue.name : ""}
                            label="Rekening"
                            changeText={() => { }}
                            onFocus={handleClose}
                            readonly={true}
                        />

                        <InputDefault
                            changeText={(value) => setCatatan(value)}
                            value={catatan}
                            label="Catatan"
                            placeHolder="Tambahkan catatan (opsional)"
                        // multiline={true}
                        // numberOfLines={3}
                        />

                        <HStack space="md" justifyContent="flex-end" mt={4}>
                            <Button
                                variant="outline"
                                onPress={() => navigation.goBack()}
                                borderColor="$coolGray300"
                            >
                                <ButtonText color="$coolGray600">Batal</ButtonText>
                            </Button>

                            <Button
                                onPress={handleSave}
                                bgColor="$yellow500"
                            >
                                <ButtonText>Simpan</ButtonText>
                            </Button>
                        </HStack>
                    </VStack>
                </View>
            </ScrollView>
            <SheetPickRekening selectedRekening={selectedRekening} showActionsheet={showActionsheet} handleClose={handleClose} handleToggle={defaultHandle} setHandleToggle={setHandleDefault} setSelectedRekening={(value) => setSelectedRekening(value)} />
            <DateModal
                showModal={isDatePickerOpen}
                setShowModal={setIsDatePickerOpen}
                getFormatedDate={getFormattedDate()}
                setDate={setTanggal}
                date={tanggal}
            />
        </SafeAreaCustom>
    )
}

export { PembayaranFormScreen }