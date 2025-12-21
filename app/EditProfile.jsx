import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    Image,
    Platform,
    KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState(null);

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        const loadUser = async () => {
            try {
                const stored = await AsyncStorage.getItem("user");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setUser(parsed);
                    setName(parsed?.name || "");
                    setPhone(parsed?.phone || "");
                    setAddress(parsed?.address || "");
                    setImage(parsed?.image || null);
                }
            } catch (e) {
                console.warn(e);
            }
        };

        loadUser();
    }, []);

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) return;

            const options = { allowsEditing: true, quality: 0.6 };
            if (ImagePicker.MediaType) options.mediaTypes = ImagePicker.MediaType.Images;
            else if (ImagePicker.MediaTypeOptions) options.mediaTypes = ImagePicker.MediaTypeOptions.Images;

            const result = await ImagePicker.launchImageLibraryAsync(options);
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            }
        } catch (e) {
            console.warn(e);
        }
    };

    const handleSave = async () => {
        try {
            const updated = { ...(user || {}), name: name.trim(), phone, address };
            if (image) updated.image = image;
            await AsyncStorage.setItem("user", JSON.stringify(updated));
            setUser(updated);
            Toast.show({ type: "success", text1: "Profile Saved", text2: "Your profile was updated." });
            router.back();
        } catch (e) {
            Toast.show({ type: "error", text1: "Save Failed", text2: "Could not update profile." });
        }
    };

    const getInitials = () => {
        const text = name?.trim() || user?.email?.split("@")[0] || "U";
        const a = text.charAt(0)?.toUpperCase() || "U";
        const b = text.charAt(1)?.toUpperCase() || "";
        return a + b;
    };

    return (
        <View className="flex-1 bg-background">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <View className="flex-row items-center mb-4 px-4 pt-6">
                        <Pressable className="p-2" onPress={() => router.back()}>
                            <BackButton />
                        </Pressable>
                        <Text className="text-lg font-bold color-textPrimary ml-2">Edit Profile</Text>
                    </View>

                    <View className="px-6">
                        <View className="items-center mb-6">
                            <Pressable onPress={pickImage} className="w-28 h-28 rounded-full overflow-hidden items-center justify-center bg-buttonPrimary mb-3">
                                {image ? (
                                    <Image source={{ uri: image }} className="w-28 h-28" resizeMode="cover" />
                                ) : (
                                    <Text className="text-white font-bold text-3xl">{getInitials()}</Text>
                                )}
                            </Pressable>
                            <Pressable onPress={pickImage} className="py-2 px-4 rounded-full bg-backgroundSecondary">
                                <Text className="color-textPrimary">Change Photo</Text>
                            </Pressable>
                        </View>

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Full Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter full name"
                            placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                            className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4"
                        />

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Email</Text>
                        <TextInput
                            value={user?.email || ""}
                            editable={false}
                            selectTextOnFocus={false}
                            placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                            className="bg-backgroundSecondary color-textPrimary rounded-xl h-12 px-3 mb-4 opacity-80"
                        />

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Phone</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Phone number"
                            keyboardType="phone-pad"
                            placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                            className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4"
                        />

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Address</Text>
                        <TextInput
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Address"
                            placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                            className="bg-backgroundSecondary rounded-xl h-28 px-3 py-3 mb-6 text-base"
                            multiline
                        />

                        <Pressable onPress={handleSave} className="h-12 rounded-2xl bg-buttonPrimary items-center justify-center mb-8">
                            <Text className="text-white font-bold">Save Changes</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default EditProfile;