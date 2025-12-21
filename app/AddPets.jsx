import React, { useState } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    Image,
    TextInput,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";

const AddPets = () => {
    const [images, setImages] = useState([]);
    const [name, setName] = useState("");
    const [petType, setPetType] = useState("dog");
    const [breed, setBreed] = useState("");
    const [location, setLocation] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerContact, setOwnerContact] = useState("");

      const { colorScheme } = useColorScheme();
      const isDark = colorScheme === "dark";

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) return;

            const options = { allowsEditing: true, quality: 0.6 };
            if (ImagePicker.MediaType) options.mediaTypes = ImagePicker.MediaType.Images;
            else if (ImagePicker.MediaTypeOptions) options.mediaTypes = ImagePicker.MediaTypeOptions.Images;

            const result = await ImagePicker.launchImageLibraryAsync(options);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImages((prev) => [...prev, { uri: result.assets[0].uri }]);
            }
        } catch (e) {
            console.warn(e);
        }
    };

    const onSubmit = () => {
        const payload = { images, name, petType, breed, location, ownerName, ownerContact };
        console.log("Create listing:", payload);
        router.back();
    };

    return (
        <View className="flex-1 bg-background px-4 pt-6">
            <View className="flex-row items-center mb-4">
                <Pressable className="p-2">
                    <BackButton />
                </Pressable>
                <Text className="text-lg font-bold color-textPrimary ml-2">Add Pet for Adoption</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <Text className="text-sm color-textPrimary mb-2">Photos</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    {images.length === 0 ? (
                        <Pressable
                            onPress={pickImage}
                            className="h-40 w-40 rounded-2xl bg-loginSigcnupImageBg items-center justify-center mr-3"
                        >
                            <Ionicons name="image-outline" size={36} color={isDark ? "#e0e0e0ff" : "#1a1a1aff"} />
                            <Text className="text-xs mt-2 color-textPrimary">Add Photo</Text>
                        </Pressable>
                    ) : (
                        images.map((img, i) => (
                            <View key={i} className="mr-3">
                                <Image source={{ uri: img.uri }} className="h-40 w-40 rounded-2xl" resizeMode="cover" />
                                <Pressable
                                    onPress={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1"
                                >
                                    <Ionicons name="close" size={16} color="#E0583D" />
                                </Pressable>
                            </View>
                        ))
                    )}

                    <Pressable onPress={pickImage} className="h-40 w-40 rounded-2xl bg-loginSigcnupImageBg items-center justify-center">
                        <Ionicons name="add" size={28} color={isDark ? "#e0e0e0ff" : "#1a1a1aff"} />
                    </Pressable>
                </ScrollView>

                <Text className="text-sm color-textPrimary mb-2 font-semibold">Pet Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter pet name"
                    placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                    className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4"
                />

                <Text className="text-sm color-textPrimary mb-2 font-semibold">Pet Type</Text>
                <View className="flex-row mb-4">
                    <Pressable
                        onPress={() => setPetType("dog")}
                        className={`px-4 py-2 mr-3 rounded-2xl ${petType === "dog" ? "bg-buttonPrimary" : "bg-backgroundSecondary"}`}
                    >
                        <Text className={"text-white"}>Dog</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setPetType("cat")}
                        className={`px-4 py-2 rounded-2xl ${petType === "cat" ? "bg-buttonPrimary" : "bg-backgroundSecondary"}`}
                    >
                        <Text className={"text-white"}>Cat</Text>
                    </Pressable>
                </View>

                <Text className="text-sm color-textPrimary mb-2 font-semibold">Breed</Text>
                <TextInput
                    value={breed}
                    onChangeText={setBreed}
                    placeholder="Enter breed"
                    placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                    className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4"
                />

                <Text className="text-sm color-textPrimary mb-2 font-semibold">Tags</Text>
                <View className="flex-row items-center mb-4">
                    <View className="px-3 py-1 rounded-full bg-gray-200 mr-3 opacity-60">
                        <Text className="text-xs">Adoption</Text>
                    </View>
                </View>

                <Text className="text-sm color-textPrimary mb-2 font-semibold">Location</Text>
                <Pressable
                    onPress={() => { }}
                    className="flex-row items-center bg-backgroundSecondary rounded-xl h-12 px-3 mb-4"
                >
                    <Ionicons name="location-outline" size={18} color="#E0583D" />
                    <Text className="ml-2 color-textPrimary">{location || "Select location"}</Text>
                </Pressable>

                <Text className="text-sm color-textPrimary mb-2 font-semibold">Owner Details</Text>
                <TextInput
                    value={ownerName}
                    onChangeText={setOwnerName}
                    placeholder="Owner name"
                    placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                    className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-3"
                />
                <TextInput
                    value={ownerContact}
                    onChangeText={setOwnerContact}
                    placeholder="Contact (phone or email)"
                    placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                    className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-6"
                />

                <Pressable onPress={onSubmit} className="h-12 rounded-2xl bg-buttonPrimary items-center justify-center mb-8">
                    <Text className="text-white font-bold">Create Listing</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default AddPets;