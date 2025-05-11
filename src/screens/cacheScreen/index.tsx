import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, Text, VStack, Heading, HStack, Divider } from '@gluestack-ui/themed';

const ResetCacheScreen = () => {
    const [cacheKeys, setCacheKeys] = useState<string[]>([]);
    const [cacheCount, setCacheCount] = useState(0);
    const [cacheSize, setCacheSize] = useState(0); // in bytes

    const getCacheInfo = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            setCacheKeys(Array.from(keys));
            setCacheCount(keys.length);

            let totalSize = 0;
            for (const key of keys) {
                const value = await AsyncStorage.getItem(key);
                if (value) {
                    totalSize += key.length + value.length; // size in bytes (approx)
                }
            }
            setCacheSize(totalSize);
        } catch (e) {
            console.error(e);
        }
    };

    const clearAppCache = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert('Berhasil', 'Cache aplikasi berhasil direset!');
            getCacheInfo();
        } catch (e) {
            console.error(e);
            Alert.alert('Gagal', 'Terjadi kesalahan saat mereset cache.');
        }
    };

    // Format size ke KB/MB
    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
    };

    useEffect(() => {
        getCacheInfo();
    }, []);

    return (
        <Box flex={1} p="$4" bg="$backgroundLight">
            <VStack space="lg">
                <Heading size="lg">Informasi Cache</Heading>
                <Text fontSize="$md">Jumlah item cache: {cacheCount}</Text>
                <Text fontSize="$md">Total cache: {formatSize(cacheSize)}</Text>

                <Divider my="$2" />

                <ScrollView style={{ maxHeight: 200 }}>
                    {cacheKeys.length === 0 ? (
                        <Text>Tidak ada cache tersimpan.</Text>
                    ) : (
                        cacheKeys.map((key, index) => (
                            <HStack key={index} justifyContent="space-between" py="$1">
                                <Text>{key}</Text>
                            </HStack>
                        ))
                    )}
                </ScrollView>

                <Button
                    size="lg"
                    bg="$yellow300"
                    borderRadius="$2xl"
                    onPress={clearAppCache}
                >
                    <Text fontWeight="bold">Reset Cache</Text>
                </Button>
            </VStack>
        </Box>
    );
};

export { ResetCacheScreen };
