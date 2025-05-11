import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { TextHeading } from "@components/textHeading"
import { Button, Avatar, AvatarFallbackText, AvatarImage, Box, ButtonText, Divider, HStack, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ScrollView, Text, View, VStack } from "@gluestack-ui/themed"
import React from "react"
import { TouchableOpacity } from "react-native"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import { useNavigation } from "@react-navigation/native"
import RNFS from 'react-native-fs';
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { UserStore } from "@config/store"
import { downloadBackupFile, getBackupList } from "./detailPengaturan/backupScreen/utils"
const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { user, setUser } = UserStore();
    const [showRestoreModal, setShowRestoreModal] = React.useState(false);
    const [latestBackupId, setLatestBackupId] = React.useState<string | null>(null);
    const [accessToken, setAccessToken] = React.useState<string | null>(null);

    GoogleSignin.configure({
        webClientId: '238776374047-v21j7phidrna3la85s5p73qkemiu7n1e.apps.googleusercontent.com',
        offlineAccess: true,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
    });



    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('Login berhasil:', userInfo);
            if (userInfo.data) {
                setUser(userInfo.data.user);
            } else {
                console.error('userInfo.data is null');
            }

        } catch (error) {
            console.error('Gagal login atau restore:', error);
        }
    };

    const logoutFromGoogle = async () => {
        try {
            await GoogleSignin.signOut(); // Logout dari Google
            setUser(null); // Kosongkan state user
            console.log('Logout berhasil');
        } catch (error) {
            console.error('Gagal logout:', error);
        }
    };

    console.log('user', user)

    return (
        <SafeAreaCustom>
            <ScrollView>
                <Box paddingHorizontal={16} bgColor="$yellow300" justifyContent="center" height={200} borderBottomEndRadius={50} borderBottomStartRadius={50}>
                    <VStack space="xs">
                        <HStack alignItems="center" space="xl">
                            <Avatar size="lg" borderWidth={2} borderColor="white">
                                <AvatarFallbackText>SS</AvatarFallbackText>
                                <AvatarImage
                                    alt="image"

                                    source={{
                                        uri: user?.photo ?? "https://www.rukita.co/stories/wp-content/uploads/2022/04/foto-kucing-oren.jpg",
                                    }}
                                />
                            </Avatar>
                            <VStack>
                                <TextHeading>{user !== null ? user.name : 'Dummy'}</TextHeading>
                                {user !== null && <Text>ID: {user.id}</Text>}

                            </VStack>
                        </HStack>
                        <HStack>
                            <TouchableOpacity onPress={user !== null ? logoutFromGoogle : signInWithGoogle}>
                                <Box paddingHorizontal={10} borderRadius={50} bgColor="$white">
                                    <HStack alignItems="center" space="xs">
                                        <IconCustom As={Ionicons} name="logo-google" />
                                        <Text size="xs">{user !== null ? 'Logout' : 'Login google'}</Text>
                                    </HStack>

                                </Box>
                            </TouchableOpacity>
                        </HStack>
                    </VStack>
                </Box>
                <View paddingHorizontal={16}>
                    <TouchableOpacity>
                        <Box padding={16} bgColor="$secondary50" top={-40} borderRadius={10}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space="md">
                                    <IconCustom As={FontAwesome6} name="crown" size={25} color="#fde047" style={{ top: -3 }} />
                                    <TextHeading size="lg">Anggota Premium</TextHeading>
                                </HStack>
                                <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                            </HStack>
                        </Box>
                    </TouchableOpacity>
                    <VStack space="md" top={-20}>
                        <TouchableOpacity>
                            <Box padding={10} bgColor="$secondary50" borderRadius={10}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack alignItems="center" space="md">
                                        <IconCustom As={AntDesign} name="like1" size={20} color="#fde047" style={{ top: -3 }} />
                                        <Text size="sm">Rekomendasikan ke teman</Text>
                                    </HStack>
                                    <IconCustom As={Ionicons} name="chevron-forward-outline" size={20} color="#fde047" />
                                </HStack>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Box padding={10} bgColor="$secondary50" borderRadius={10}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack alignItems="center" space="md">
                                        <IconCustom As={Ionicons} name="star" size={20} color="#fde047" style={{ top: -3 }} />
                                        <Text size="sm">Nilai Aplikasi</Text>
                                    </HStack>
                                    <IconCustom As={Ionicons} name="chevron-forward-outline" size={20} color="#fde047" />
                                </HStack>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Box padding={10} bgColor="$secondary50" borderRadius={10}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack alignItems="center" space="md">
                                        <IconCustom As={Entypo} name="block" size={20} color="#fde047" style={{ top: -3 }} />
                                        <Text size="sm">Blokir Iklan</Text>
                                    </HStack>
                                    <IconCustom As={Ionicons} name="chevron-forward-outline" size={20} color="#fde047" />
                                </HStack>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'PengaturanScreen' })}>
                            <Box padding={10} bgColor="$secondary50" borderRadius={10}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack alignItems="center" space="md">
                                        <IconCustom As={FontAwesome6} name="gear" size={20} color="#fde047" style={{ top: -3 }} />
                                        <Text size="sm">Pengaturan</Text>
                                    </HStack>
                                    <IconCustom As={Ionicons} name="chevron-forward-outline" size={20} color="#fde047" />
                                </HStack>
                            </Box>
                        </TouchableOpacity>
                    </VStack>
                </View>
            </ScrollView>
            <Modal isOpen={showRestoreModal} onClose={() => setShowRestoreModal(false)}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>Restore Backup</ModalHeader>
                    <ModalBody>
                        <Text>Ada backup data di akun kamu. Ingin melakukan restore sekarang?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="solid"
                            bgColor="$green600"
                            onPress={async () => {
                                if (latestBackupId && accessToken) {
                                    await downloadBackupFile(latestBackupId, accessToken);
                                }
                                setShowRestoreModal(false);
                            }}
                        >
                            <ButtonText>Restore</ButtonText>
                        </Button>
                        <Button variant="outline" onPress={() => setShowRestoreModal(false)} ml="$2">
                            <ButtonText>Lewati</ButtonText>
                        </Button>
                    </ModalFooter>
                    <ModalCloseButton />
                </ModalContent>
            </Modal>

        </SafeAreaCustom>
    )
}

export { ProfileScreen };