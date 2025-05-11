import { formatThousand } from "@components/formatRibuan"
import { IconCustom } from "@components/iconCustom"
import { InputDefault } from "@components/input/inputDefault"
import { View, Text, VStack, HStack, Box } from "@gluestack-ui/themed"
import React, { useEffect, useState } from "react"
import { TouchableOpacity, Vibration } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather"
import Sound from 'react-native-sound'
import { playBeep } from "@utils/soundUtils"

interface FormAddInterface {
    handleClose: () => void;
    input: string;
    images: { uri: string; base64: string }[];
    handleImage: () => void;
    handleCamera: () => void;
    setCatatan: (value: string) => void;
    setInput: (value: string | ((prev: string) => string)) => void;
    setShowModal: (value: boolean | ((prev: boolean) => boolean)) => void;
    funcSave: () => void;
    catatan: string;
    date?: string;
    showRekening?: boolean;
    soundEnabled?: boolean;
    vibrationEnabled?: boolean;
}

const PadFormAdd: React.FC<FormAddInterface> = ({
    handleClose,
    handleCamera,
    handleImage,
    input,
    images,
    setCatatan,
    setInput,
    setShowModal,
    funcSave,
    catatan,
    date,
    showRekening,
    soundEnabled = true,
    vibrationEnabled = true
}) => {
    const [sounds, setSounds] = useState<{ [key: string]: Sound | null }>({
        button: null,
        save: null,
        delete: null,
        equal: null
    });

    const [soundsLoaded, setSoundsLoaded] = useState(false);

    // Initialize sounds
    useEffect(() => {
        // Enable playback in silent mode
        Sound.setCategory('Playback');

        // Using simple beep sounds from the app bundle
        // We're using simple code examples for different tones
        const buttonSound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load button sound', error);
            } else {
                setSounds(prev => ({ ...prev, button: buttonSound }));
            }
        });

        const saveSound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load save sound', error);
            } else {
                // Configure a different sound property
                saveSound.setVolume(0.8);
                setSounds(prev => ({ ...prev, save: saveSound }));
            }
        });

        const deleteSound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load delete sound', error);
            } else {
                // Configure a different sound property
                deleteSound.setPitch(0.8); // Lower pitch for delete
                setSounds(prev => ({ ...prev, delete: deleteSound }));
            }
        });

        const equalSound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load equal sound', error);
            } else {
                // Configure a different sound property
                equalSound.setPitch(1.2); // Higher pitch for equal
                setSounds(prev => ({ ...prev, equal: equalSound }));
            }
        });

        setSoundsLoaded(true);

        // Cleanup sounds when component unmounts
        return () => {
            Object.values(sounds).forEach(sound => {
                if (sound) sound.release();
            });
        };
    }, []);

    // Function to play sound based on button type
    const playSound = (type: string) => {
        if (!soundEnabled || !soundsLoaded) return;

        let soundToPlay = sounds.button;

        switch (type) {
            case 'save':
                soundToPlay = sounds.save;
                break;
            case 'DEL':
            case 'AC':
                soundToPlay = sounds.delete;
                break;
            case '=':
                soundToPlay = sounds.equal;
                break;
        }

        if (soundToPlay) {
            // Reset the sound to the beginning (in case it was playing)
            soundToPlay.stop();
            soundToPlay.play((success) => {
                if (!success) {
                    console.log('Sound playback failed');
                }
            });
        }
    };

    // Function to trigger vibration based on button type
    const triggerVibration = (type: string) => {
        if (!vibrationEnabled) return;

        switch (type) {
            case 'save':
                Vibration.vibrate(100); // Longer vibration for save
                break;
            case 'DEL':
            case 'AC':
                Vibration.vibrate(50); // Simpler vibration pattern for delete actions
                break;
            case '=':
                Vibration.vibrate(80); // Medium vibration for equals
                break;
            default:
                Vibration.vibrate(20); // Short vibration for number buttons
        }
    };

    const handlePress = (value: string) => {
        // Play sound and trigger vibration
        playSound(value);
        triggerVibration(value);

        if (value === "=") {
            if (input === "" || input === "0") {
                setInput("0");
            } else {
                try {
                    const result = eval(input);
                    setInput(result.toString());
                } catch (error) {
                    setInput("Error");
                }
            }
        } else if (value === "AC") {
            setInput("");
        } else if (value === "DEL") {
            setInput((prev) => (typeof prev === "string" ? prev.slice(0, -1) : ""));
        } else if (value === "today") {
            setShowModal(true);
        } else if (value === "save") {
            funcSave();
        } else {
            setInput((prev) => {
                if (typeof prev !== "string") return value;
                const lastChar = prev.slice(-1);
                if ((value === "+" || value === "-") && (lastChar === "+" || lastChar === "-")) {
                    return prev;
                }
                return prev + value;
            });
        }
    };

    const buttons = [
        ["7", "8", "9", "today"],
        ["4", "5", "6", "+-"],
        ["1", "2", "3", "="],
        ["AC", "0", "DEL", "save"],
    ];

    return (
        <View height={'52%'} bgColor="$secondary100">
            <VStack paddingHorizontal={16} paddingVertical={16} space="md">
                <HStack justifyContent="space-between" alignItems="center">
                    <View>
                        {showRekening &&
                            <TouchableOpacity onPress={() => { handleClose(); playBeep() }}>
                                <Box padding={6} bgColor="$secondary200" borderRadius={10}>
                                    <IconCustom As={Ionicons} name="wallet-outline" size={20} />
                                </Box>
                            </TouchableOpacity>
                        }

                    </View>
                    <Text color="black" size="lg">{formatThousand(input) || "0"}</Text>
                </HStack>
                <Box padding={6} borderRadius={10} bgColor="white" >
                    <HStack justifyContent="space-between" alignItems="center" marginHorizontal={10}>
                        <HStack alignItems="center">
                            <Text size="xs">Catatan: </Text>
                            <InputDefault value={catatan} changeText={(text) => setCatatan(text)} variant="outline" width={'77%'} borderColor="transparent" />
                        </HStack>

                        <TouchableOpacity onPress={() => { images.length > 0 ? handleImage() : handleCamera(); playBeep(); }}>
                            <IconCustom As={Ionicons} name="camera-outline" size={20} />
                            {images.length > 0 && <View width={20} height={20} borderRadius={'$full'} bgColor="$yellow300" alignItems="center" position="absolute" right={-10}>
                                <Text size="xs">{images.length}</Text>
                            </View>}
                        </TouchableOpacity>
                    </HStack>
                </Box>
                <View>
                    <VStack space="md">
                        {buttons.map((row, rowIndex) => (
                            <HStack key={rowIndex} justifyContent="space-around">
                                {row.map((button) => (
                                    button === "+-" ? (
                                        <View key={button} style={{
                                            backgroundColor: "#ddd",
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '22%',
                                            borderRadius: 10,
                                            overflow: 'hidden'
                                        }}>
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'center',
                                                    paddingVertical: 10,
                                                    borderRightWidth: 1,
                                                    borderRightColor: "#ccc"
                                                }}
                                                onPress={() => handlePress("+")}
                                            >
                                                <Text>+</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'center',
                                                    paddingVertical: 10,
                                                }}
                                                onPress={() => handlePress("-")}
                                            >
                                                <Text>-</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : button === 'DEL' ? (
                                        <TouchableOpacity
                                            key={button}
                                            style={{
                                                backgroundColor: "#ddd",
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '22%',
                                                borderRadius: 10,
                                                flexDirection: "row",
                                                padding: 10
                                            }}
                                            onPress={() => handlePress("DEL")}
                                        >
                                            <Feather name="delete" size={20} color="black" />
                                        </TouchableOpacity>)
                                        : button === 'save' ? (
                                            <TouchableOpacity
                                                key={button}
                                                style={{
                                                    backgroundColor: "#4CAF50",
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '22%',
                                                    borderRadius: 10,
                                                    flexDirection: "row",
                                                    padding: 10
                                                }}
                                                onPress={() => handlePress("save")}
                                            >
                                                <Ionicons name="checkmark-outline" size={20} color="white" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                key={button}
                                                style={{
                                                    backgroundColor: "#ddd",
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '22%',
                                                    borderRadius: 10,
                                                    padding: 10
                                                }}
                                                onPress={() => handlePress(button)}
                                            >
                                                {button === "today" ? (
                                                    <HStack space="xs" alignItems="center">
                                                        <IconCustom name="calendar" size={14} color="#eab308" As={Ionicons} />
                                                        <Text fontSize={8} color="#eab308">{date}</Text>
                                                    </HStack>
                                                ) : (
                                                    <Text>{button}</Text>
                                                )}
                                            </TouchableOpacity>
                                        )
                                ))}
                            </HStack>
                        ))}
                    </VStack>
                </View>
            </VStack>
        </View>
    )
}

export { PadFormAdd }