import React from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";

const CustomToast = ({ text1, type }) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const background =
        type === "success"
            ? `${getColor("success", isDark)}20`
            : type === "error"
                ? `${getColor("error", isDark)}20`
                : getColor("backgroundSecondary", isDark);

    const color = getColor("textPrimary", isDark);

    return (
        <View
            style={{
                backgroundColor: background,
                borderRadius: 12,
                padding: 14,
                marginHorizontal: 10,
                shadowOpacity: 0.2,
                shadowRadius: 6,
            }}
        >
            <Text style={{ color, fontWeight: "600" }}>{text1}</Text>
        </View>
    );
};

export default CustomToast;
