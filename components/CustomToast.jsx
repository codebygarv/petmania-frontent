import React from "react";
import { View, Text, useColorScheme } from "react-native";

const CustomToast = ({ text1, type }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const background =
        type === "success"
            ? isDark ? "#1B3A2F" : "#BBF7D0"
            : type === "error"
                ? isDark ? "#3B1C1C" : "#FCA5A5"
                : isDark
                    ? "#1E293B"
                    : "#ffffff";

    const color = isDark ? "#EDEDED" : "#1C1C1C";

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
