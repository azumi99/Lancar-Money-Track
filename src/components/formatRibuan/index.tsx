import { Text, Switch } from "@gluestack-ui/themed";
import React from "react";
import { create } from "zustand";

export const useThousandSeparatorStore = create<{
    isActive: boolean;
    toggleActive: () => void;
}>((set) => ({
    isActive: true,
    toggleActive: () => set((state) => ({ isActive: !state.isActive }))
}));

export const formatThousand = (value: string | number): string => {
    const { isActive } = useThousandSeparatorStore.getState();
    if (typeof value === "string" && value.trim() === "") return "";

    let formattedValue = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return isActive ? formattedValue : value.toString();
};

interface ThousandSeparatorProps {
    number: string | number;
    style?: object;
}

const ThousandSeparator: React.FC<ThousandSeparatorProps> = ({ number, style }) => {
    const { isActive, toggleActive } = useThousandSeparatorStore();

    return (
        <>
            <Text style={style}>{formatThousand(number)}</Text>
        </>
    );
};

export default ThousandSeparator;
