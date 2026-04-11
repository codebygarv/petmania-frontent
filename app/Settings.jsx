import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfileAction, deleteAccountAction } from "@/redux/actions/userActions";
import BackButton from "@/components/BackButton";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getColor } from "@/constants/color";

const SettingsItem = ({ icon, title, type = "switch", value, onValueChange, isDark, danger }) => {
    const textColor = danger ? "text-error" : "text-textPrimary";
    const iconColor = danger ? getColor("error", isDark) : getColor("graySoft", isDark);

    return (
        <View className="flex-row items-center justify-between py-3.5 px-4 bg-backgroundSecondary rounded-xl mb-2.5">
            <View className="flex-row items-center">
                <Ionicons name={icon} size={22} color={iconColor} style={{ marginRight: 12 }} />
                <Text className={`text-base font-medium ${textColor}`}>{title}</Text>
            </View>
            {type === "switch" && (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: isDark ? "#444" : "#ccc", true: getColor("accent", isDark) }}
                    thumbColor={"#f4f3f4"}
                />
            )}
            {type === "arrow" && (
                <Ionicons name="chevron-forward" size={20} color={iconColor} />
            )}
        </View>
    );
};

const Settings = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const { colorScheme, setColorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const [settings, setSettings] = useState({
        theme: userInfo?.settings?.theme || "system",
    });

    const handleThemeChange = (newTheme) => {
        setSettings(prev => ({ ...prev, theme: newTheme }));
        if (newTheme !== 'system') setColorScheme(newTheme);

        const updatedSettings = {
            settings: {
                theme: newTheme,
                language: "en"
            }
        };
        dispatch(updateUserProfileAction(updatedSettings));
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to permanently delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive", onPress: async () => {
                        const res = await dispatch(deleteAccountAction());
                        if (res?.success) {
                            await AsyncStorage.clear();
                            Toast.show({ type: "success", text1: "Account Deleted" });
                            router.replace("/(auth)");
                        } else {
                            Toast.show({ type: "error", text1: "Failed", text2: res?.error || "Could not delete account" });
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
            <View className="flex gap-4 pt-7 pl-6 pr-6 h-screen bg-background">
                <View className="flex flex-row align-center">
                    <BackButton />
                    <Text className="text-center ml-24 color-textPrimary my-auto font-semibold text-xl">
                        Settings
                    </Text>
                </View>

                {/* Appearance */}
                <View className="mb-6">
                    <Text className="text-[13px] font-semibold text-textSecondary mb-3 ml-1 uppercase">
                        Appearance
                    </Text>
                    <View className="flex-row gap-2.5 mb-2.5">
                        {['light', 'dark', 'system'].map((th) => {
                            const isSelected = settings.theme === th;
                            return (
                                <TouchableOpacity
                                    key={th}
                                    onPress={() => handleThemeChange(th)}
                                    className={`flex-1 py-3 rounded-xl items-center ${isSelected ? 'bg-buttonPrimary' : 'bg-backgroundSecondary'}`}
                                >
                                    <Text className={`text-sm font-semibold capitalize ${isSelected ? 'text-white' : 'text-textSecondary'}`}>
                                        {th}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Danger Zone */}
                <View>
                    <Text className="text-[13px] font-semibold text-textSecondary mb-3 ml-1 uppercase ">
                        Account Deletion
                    </Text>
                    <TouchableOpacity onPress={handleDeleteAccount}>
                        <SettingsItem
                            icon="trash-outline"
                            title="Delete Account"
                            type="arrow"
                            isDark={isDark}
                            danger
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Settings;
