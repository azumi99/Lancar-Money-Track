import { SuaraOnOff } from "@config/store";
import Sound from "react-native-sound";


let beepSound: Sound | null = null;
let soundLoaded = false;

export const initSound = () => {
    if (soundLoaded) return;

    Sound.setCategory("Playback");

    beepSound = new Sound("beep.mp3", Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log("Failed to load beep sound", error);
        } else {
            soundLoaded = true;
        }
    });
};

export const playBeep = () => {
    const { suara } = SuaraOnOff.getState();

    if (!suara || !soundLoaded || !beepSound) return;

    beepSound.stop(() => {
        beepSound?.play((success) => {
            if (!success) {
                console.log("Sound playback failed");
            }
        });
    });
};
