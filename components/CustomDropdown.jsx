import React, { useState } from "react";
import { View, Text, Pressable, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";

const CustomDropdown = ({ label, value, options, onSelect, placeholder }) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const [visible, setVisible] = useState(false);

    const accentColor = getColor("accent", isDark);
    const textColor = getColor("textPrimary", isDark);
    const secondaryColor = getColor("textSecondary", isDark);
    const bgColor = getColor("background", isDark);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <View className="mb-4">
            <Text className="text-sm color-textPrimary mb-2 font-semibold">{label}</Text>
            <Pressable
                onPress={() => setVisible(true)}
                className="flex-row items-center justify-between bg-backgroundSecondary border border-border rounded-xl h-12 px-3"
            >
                <Text style={{ color: selectedOption ? textColor : secondaryColor }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Ionicons name="chevron-down" size={20} color={secondaryColor} />
            </Pressable>

            <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={() => setVisible(false)}>
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-background rounded-t-3xl p-6 h-[50%]">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold color-textPrimary">Select {label}</Text>
                            <Pressable onPress={() => setVisible(false)}>
                                <Ionicons name="close" size={24} color={secondaryColor} />
                            </Pressable>
                        </View>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => {
                                        onSelect(item.value);
                                        setVisible(false);
                                    }}
                                    className={`py-3 px-4 border-b border-border flex-row justify-between items-center ${value === item.value ? "bg-buttonPrimary/10 rounded-lg border-b-0" : ""}`}
                                >
                                    <Text className={value === item.value ? "font-bold color-buttonPrimary" : "color-textPrimary"}>
                                        {item.label}
                                    </Text>
                                    {value === item.value && (
                                        <Ionicons name="checkmark" size={20} color={accentColor} />
                                    )}
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CustomDropdown;
