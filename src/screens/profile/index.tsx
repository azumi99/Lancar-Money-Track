import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { TextHeading } from "@components/textHeading"
import { Avatar, AvatarFallbackText, AvatarImage, Box, Divider, HStack, ScrollView, Text, View, VStack } from "@gluestack-ui/themed"
import React from "react"
import { TouchableOpacity } from "react-native"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import { useNavigation } from "@react-navigation/native"
const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    return (
        <SafeAreaCustom>
            <ScrollView>
                <Box paddingHorizontal={16} bgColor="$yellow300" justifyContent="center" height={200} borderBottomEndRadius={50} borderBottomStartRadius={50}>
                    <HStack alignItems="center" space="xl">
                        <Avatar size="lg" borderWidth={2} borderColor="white">
                            <AvatarFallbackText>SS</AvatarFallbackText>
                            <AvatarImage
                                alt="image"

                                source={{
                                    uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
                                }}
                            />
                        </Avatar>
                        <VStack>
                            <TextHeading>Ilham Bintang</TextHeading>
                            <Text>ID: 183479</Text>
                        </VStack>
                    </HStack>
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
                    <VStack space="lg">
                        <TouchableOpacity>
                            <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack alignItems="center" space="md">
                                        <IconCustom As={AntDesign} name="like1" size={25} color="#fde047" style={{ top: -3 }} />
                                        <Text size="lg">Rekomendasikan ke teman</Text>
                                    </HStack>
                                    <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                                </HStack>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack alignItems="center" space="md">
                                        <IconCustom As={Ionicons} name="star" size={25} color="#fde047" style={{ top: -3 }} />
                                        <Text size="lg">Nilai Aplikasi</Text>
                                    </HStack>
                                    <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                                </HStack>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack alignItems="center" space="md">
                                        <IconCustom As={Entypo} name="block" size={25} color="#fde047" style={{ top: -3 }} />
                                        <Text size="lg">Blokir Iklan</Text>
                                    </HStack>
                                    <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                                </HStack>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'PengaturanScreen' })}>
                            <Box padding={16} bgColor="$secondary50" borderRadius={10}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack alignItems="center" space="md">
                                        <IconCustom As={FontAwesome6} name="gear" size={25} color="#fde047" style={{ top: -3 }} />
                                        <Text size="lg">Pengaturan</Text>
                                    </HStack>
                                    <IconCustom As={Ionicons} name="chevron-forward-outline" size={25} color="#fde047" />
                                </HStack>
                            </Box>
                        </TouchableOpacity>
                    </VStack>
                </View>
            </ScrollView>
        </SafeAreaCustom>
    )
}

export { ProfileScreen };