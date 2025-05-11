import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { Box, Button, ButtonText, CloseIcon, Heading, HStack, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ScrollView, Switch, Text, Textarea, TextareaInput, View, VStack } from "@gluestack-ui/themed"
import React, { useState } from "react"
import { Linking, TouchableOpacity } from "react-native"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import Fontisto from "react-native-vector-icons/Fontisto"
import Octicons from "react-native-vector-icons/Octicons"
import { useNavigation } from "@react-navigation/native"
import { useThousandSeparatorStore } from "@components/formatRibuan"
import { SuaraOnOff, useCurrency, UserStore } from "@config/store"
import { ShowToast } from "@components/toast"
import { send, EmailJSResponseStatus } from '@emailjs/react-native';
import axios from "axios"

const PengaturanScreen = () => {
    const navigation = useNavigation<any>();
    const { isActive, toggleActive } = useThousandSeparatorStore();
    console.log('togle', isActive)
    const { currency } = useCurrency();
    const { suara, setSuara } = SuaraOnOff();
    const defaultCurrency = currency.find(value => value.is_default);
    const { user } = UserStore();

    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState('');

    // const handleSendFeedback = () => {
    //     const subject = 'Umpan Balik Aplikasi';
    //     const body = `Dari: ${user?.email}%0D%0A%0D%0A${encodeURIComponent(feedback)}`;
    //     const mailto = `mailto:lancarapak@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    //     Linking.openURL(mailto);
    //     setShowModal(false);
    // };



    const SERVICE_ID = 'service_0rm0dm8';
    const TEMPLATE_ID = 'template_skfuj2q';
    const PUBLIC_KEY = 'hbxFwIZ04oqvO-XqF';

    const handleSendFeedback = async () => {
        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service_id: SERVICE_ID,
                    template_id: TEMPLATE_ID,
                    user_id: PUBLIC_KEY,
                    template_params: {
                        name: user?.name || 'Unknown User',
                        email: user?.email || 'unknown@example.com',
                        message: 'This is a static message',
                    },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`EmailJS API Error: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            console.log('SUCCESS!', result);
        } catch (err) {
            console.log('ERROR', err);
        }
    };











    return (
        <SafeAreaCustom>
            <ScrollView marginVertical={16}>
                <VStack space="xs">
                    <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'EditProfileScreen' })}>
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="person" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="sm">Profil</Text>
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
                                    <Text size="sm">Pengaturan kategori</Text>
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
                                    <Text size="sm">Mata uang</Text>
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
                                    <Text size="sm">Tema</Text>
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
                                    <Text size="sm">Pemisah Ribuan</Text>
                                </HStack>

                                <Switch size="md" value={isActive} onToggle={toggleActive} />

                            </HStack>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="logo-soundcloud" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="sm">Efek Suara</Text>
                                </HStack>

                                <Switch size="md" value={suara} onToggle={setSuara} />

                            </HStack>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'RekeningScreen' })}>
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="wallet-outline" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="sm">Rekening</Text>
                                </HStack>
                                <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                            </HStack>
                        </Box>
                    </TouchableOpacity>


                </VStack>

                <VStack space="xs" mt={20}>
                    <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'TermsAndConditions' })}>
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="document-text-outline" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="sm">Syarat & Ketentuan</Text>
                                </HStack>
                                <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                            </HStack>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'PrivacyPolicyScreen' })}>
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="shield-checkmark-outline" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="sm">Kebijakan Privasi</Text>
                                </HStack>
                                <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                            </HStack>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('mailto:lancarapak@gmail.com')}>
                        <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={Ionicons} name="mail-open-outline" size={25} color="#fde047" style={{ top: -3 }} />
                                    <Text size="sm">Umpan Balik</Text>
                                </HStack>
                                <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                            </HStack>
                        </Box>
                    </TouchableOpacity>
                </VStack>
            </ScrollView>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">Umpan Balik</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text mb="$2">Tulis masukan atau saran kamu:</Text>

                        <Textarea
                            size="md"
                            isReadOnly={false}
                            isInvalid={false}
                            isDisabled={false}
                            h={100}

                        >
                            <TextareaInput value={feedback} onChangeText={setFeedback} placeholder="Your text goes here..." />
                        </Textarea>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            action="secondary"
                            mr="$3"
                            onPress={() => setShowModal(false)}
                        >
                            <ButtonText>Batal</ButtonText>
                        </Button>
                        <Button
                            size="sm"
                            action="positive"
                            borderWidth='$0'
                            onPress={handleSendFeedback}
                        >
                            <ButtonText>Kirim</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </SafeAreaCustom>
    )
}

export { PengaturanScreen }