import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfileAction, deleteAccountAction } from "@/redux/actions/userActions";
import BackButton from "@/components/BackButton";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsItem = ({ icon, title, type = "switch", value, onValueChange, isDark, danger }) => {
    const textColor = danger ? "#E0583D" : (isDark ? "#e0e0e0" : "#1a1a1a");
    const iconColor = danger ? "#E0583D" : (isDark ? "#a0a0a0" : "#555");
    const bg = isDark ? "#1e1e1e" : "#f5f5f5";

    return (
        <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            paddingVertical: 14, paddingHorizontal: 16, backgroundColor: bg,
            borderRadius: 12, marginBottom: 10
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={icon} size={22} color={iconColor} style={{ marginRight: 12 }} />
                <Text style={{ fontSize: 16, fontWeight: '500', color: textColor }}>{title}</Text>
            </View>
            {type === "switch" && (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: isDark ? "#444" : "#ccc", true: "#E0583D" }}
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
        pushNotifications: userInfo?.settings?.notifications?.push ?? true,
        emailNotifications: userInfo?.settings?.notifications?.email ?? true,
        theme: userInfo?.settings?.theme || "system",
    });

    const handleToggle = async (key) => {
        const newValue = !settings[key];
        setSettings(prev => ({ ...prev, [key]: newValue }));

        const updatedSettings = {
            settings: {
                notifications: {
                    push: key === 'pushNotifications' ? newValue : settings.pushNotifications,
                    email: key === 'emailNotifications' ? newValue : settings.emailNotifications
                },
                theme: settings.theme,
                language: "en"
            }
        };

        dispatch(updateUserProfileAction(updatedSettings));
    };

    const handleThemeChange = (newTheme) => {
        setSettings(prev => ({ ...prev, theme: newTheme }));
        if (newTheme !== 'system') setColorScheme(newTheme);

        const updatedSettings = {
            settings: {
                notifications: {
                    push: settings.pushNotifications,
                    email: settings.emailNotifications
                },
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

    const bg = isDark ? '#121212' : '#ffffff';

    return (
        <ScrollView style={{ flex: 1, backgroundColor: bg }} showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                        <BackButton />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: isDark ? '#e0e0e0' : '#1a1a1a', marginLeft: 12 }}>
                        Settings
                    </Text>
                </View>

                {/* Notifications */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#888', marginBottom: 12, marginLeft: 4, textTransform: 'uppercase' }}>
                        Notifications
                    </Text>
                    <SettingsItem
                        icon="notifications-outline"
                        title="Push Notifications"
                        value={settings.pushNotifications}
                        onValueChange={() => handleToggle('pushNotifications')}
                        isDark={isDark}
                    />
                    <SettingsItem
                        icon="mail-outline"
                        title="Email Notifications"
                        value={settings.emailNotifications}
                        onValueChange={() => handleToggle('emailNotifications')}
                        isDark={isDark}
                    />
                </View>

                {/* Appearance */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#888', marginBottom: 12, marginLeft: 4, textTransform: 'uppercase' }}>
                        Appearance
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                        {['light', 'dark', 'system'].map((th) => (
                            <TouchableOpacity
                                key={th}
                                onPress={() => handleThemeChange(th)}
                                style={{
                                    flex: 1, paddingVertical: 12, borderRadius: 12,
                                    alignItems: 'center',
                                    backgroundColor: settings.theme === th ? '#E0583D' : (isDark ? '#1e1e1e' : '#f5f5f5'),
                                }}
                            >
                                <Text style={{
                                    fontSize: 14, fontWeight: '600',
                                    color: settings.theme === th ? '#fff' : (isDark ? '#aaa' : '#555'),
                                    textTransform: 'capitalize'
                                }}>
                                    {th}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#E0583D', marginBottom: 12, marginLeft: 4, textTransform: 'uppercase' }}>
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
