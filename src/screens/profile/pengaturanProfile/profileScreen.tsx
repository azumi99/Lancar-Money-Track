import SafeAreaCustom from "@components/safeArea"
import { UserStore } from "@config/store"
import {
    View,
    Avatar,
    AvatarFallbackText,
    AvatarImage,
    VStack,
    Text,
    Button,
    ButtonText,
    HStack,
    ScrollView,
    Divider,
    Input,
    InputField,
} from "@gluestack-ui/themed"
import React, { useState } from "react"

const EditProfileScreen = () => {
    const { user, setUser } = UserStore();
    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState(user?.name ?? "");

    const handleSave = () => {
        if (newName.trim() !== "" && user) {
            setUser({
                id: user.id,
                name: newName,
                email: user.email ?? "",
                photo: user.photo ?? null,
                familyName: user.familyName ?? null,
                givenName: user.givenName ?? null,
            });
            setEditMode(false);
        }
    };

    return (
        <SafeAreaCustom>
            <ScrollView backgroundColor="$yellow50">
                <VStack px="$5" py="$10" space="xl" alignItems="center" backgroundColor="$yellow50">
                    {/* Avatar */}
                    <Avatar size="2xl" borderWidth={3} borderColor="$yellow500" bgColor="white" shadowColor="black" shadowOffset={{ width: 0, height: 1 }} shadowOpacity={0.15} shadowRadius={5}>
                        <AvatarFallbackText>SS</AvatarFallbackText>
                        <AvatarImage
                            alt="image"
                            source={{
                                uri: user?.photo ?? "https://www.rukita.co/stories/wp-content/uploads/2022/04/foto-kucing-oren.jpg",
                            }}
                        />
                    </Avatar>

                    {/* Display or Edit Mode */}
                    {!editMode ? (
                        <>
                            <Text fontSize="$2xl" fontWeight="bold" color="$yellow800">
                                {user?.name ?? "Nama Pengguna"}
                            </Text>
                            <Text fontSize="$md">
                                {user?.email ?? "email@example.com"}
                            </Text>
                            <Button
                                size="md"
                                mt="$4"
                                borderRadius="$full"
                                backgroundColor="$yellow500"

                                onPress={() => setEditMode(true)}
                            >
                                <ButtonText color="white">Edit Profil</ButtonText>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Input w="100%" mt="$2" bgColor="white" borderColor="$yellow400" borderRadius={50}>
                                <InputField
                                    value={newName}
                                    onChangeText={setNewName}
                                    placeholder="Masukkan nama baru"
                                    fontSize="$md"
                                />
                            </Input>
                            <HStack space="md" mt="$4">
                                <Button backgroundColor="$yellow600" borderRadius="$full" onPress={handleSave}>
                                    <ButtonText color="white">Simpan</ButtonText>
                                </Button>
                                <Button variant="outline" borderColor="$yellow600" borderRadius="$full" onPress={() => {
                                    setNewName(user?.name ?? "");
                                    setEditMode(false);
                                }}>
                                    <ButtonText color="$yellow700">Batal</ButtonText>
                                </Button>
                            </HStack>
                        </>
                    )}

                    <Divider my="$6" w="100%" bg="$yellow200" />

                    {/* Info Detail */}
                    <VStack w="100%" space="lg" bgColor="white" p="$5" borderRadius="$xl" shadowColor="black" shadowOpacity={0.05} shadowRadius={10}>
                        <HStack justifyContent="space-between">
                            <Text color="$gray500">Nama Lengkap</Text>
                            <Text fontWeight="medium" color="$black">{user?.name ?? "-"}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text color="$gray500">Email</Text>
                            <Text fontWeight="medium" color="$black">{user?.email ?? "-"}</Text>
                        </HStack>
                    </VStack>
                </VStack>
            </ScrollView>
        </SafeAreaCustom>
    );
};

export { EditProfileScreen };
