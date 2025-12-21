import React from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "nativewind";

export const toastConfig = {
    custom: ({ text1, type }: any) => {
        const { colorScheme } = useColorScheme();
        const isDark = colorScheme === "dark";

        const background =
            type === "success"
                ? isDark ? "#14532D" : "#BBF7D0"
                : type === "error"
                    ? isDark ? "#7F1D1D" : "#FCA5A5"
                    : isDark
                        ? "#1E293B"
                        : "#fcfbfbff";

        const color = isDark ? "#1C1C1C" : "#fcfbfbff";

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
    },
};
