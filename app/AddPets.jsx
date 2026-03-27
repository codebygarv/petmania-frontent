import React, { useState } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    Image,
    TextInput,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { config } from "@/constants/config";
import { useDispatch, useSelector } from "react-redux";
import { createPetAction } from "@/redux/actions/petActions";

const AddPets = () => {
    const [images, setImages] = useState([]);
    const [name, setName] = useState("");
    const [petType, setPetType] = useState("dog");
    const [breed, setBreed] = useState("");
    const [location, setLocation] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerContact, setOwnerContact] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    // Pick the Profile Image
    const pickImage = async () => {
        if (images.length >= 2) {
            Toast.show({ type: "info", text1: "Limit reached", text2: "You can only add up to 2 images" });
            return;
        }

        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) return;

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
                quality: 0.6,
                allowsEditing: true
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (!asset.base64) {
                    Toast.show({ type: "error", text1: "Error", text2: "Failed to read image content" });
                    return;
                }
                setImages((prev) => [...prev, { uri: asset.uri, base64: asset.base64 }]);
            }
        } catch (e) {
            console.warn(e);
        }
    };

    // Get the current Location of the User to add the Pet or for the Manual location
    const getLocation = async () => {
        try {
            setLocationLoading(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Toast.show({ type: "error", text1: "Permission Denied", text2: "Location permission is required" });
                return;
            }

            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            if (loc && loc.coords) {
                const address = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                });
                const city = address[0]?.city || address[0]?.district || "Unknown";
                const state = address[0]?.region || "Unknown";
                setLocation(`${city}, ${state}`);
            }
        } catch (error) {
            console.error(error);
            Toast.show({ type: "error", text1: "Error", text2: "Could not fetch location automatically" });
        } finally {
            setLocationLoading(false);
        }
    };

    // Submit the Pet Data to the Backend
    const onSubmit = async () => {
        if (!name || !breed || !location) {
            Toast.show({ type: "error", text1: "Validation Error", text2: "Please fill all required fields" });
            return;
        }
        if (images.length === 0) {
            Toast.show({ type: "error", text1: "Validation Error", text2: "Please add at least one photo" });
            return;
        }

        try {
            setIsSubmitting(true);

            if (userInfo) {
                if (!userInfo.isVerified) {
                    Toast.show({ type: "error", text1: "Error", text2: "Please verify first" });
                    setIsSubmitting(false);
                    return;
                }
            }

            const base64Images = images.map(img => `data:image/jpeg;base64,${img.base64}`);

            const locationParts = location.split(',').map(p => p.trim());
            const city = locationParts[0] || "Unknown";
            const state = locationParts[1] || "Unknown";

            const payload = {
                images: base64Images,
                name,
                type: petType,
                breed,
                city: city,
                state: state,
                country: locationParts[2] || "Unknown",
                pincode: "000000",
                age: 1,
                color: "Unknown",
            };

            const res = await dispatch(createPetAction(payload));
            console.log(res)

            if (res && res.pet) {
                Toast.show({ type: "success", text1: "Success", text2: "Pet added successfully!" });
                router.back();
            } else {
                Toast.show({ type: "error", text1: "Error", text2: res?.error || "Failed to add pet" });
            }
        } catch (error) {
            console.error(error);
            Toast.show({ type: "error", text1: "Error", text2: "Something went wrong" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}
        >
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

                        {images.length < 2 && (
                            <Pressable onPress={pickImage} className="h-40 w-40 rounded-2xl bg-loginSigcnupImageBg items-center justify-center border border-dashed border-gray-400">
                                <Ionicons name="add" size={28} color={isDark ? "#e0e0e0ff" : "#1a1a1aff"} />
                                <Text className="text-xs mt-2 color-textPrimary opacity-70">Add Photo</Text>
                            </Pressable>
                        )}
                    </ScrollView>

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Pet Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter pet name"
                        placeholderTextColor={isDark ? "#888" : "#999"}
                        color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                        className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4 border border-gray-200 dark:border-gray-800"
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
                        placeholderTextColor={isDark ? "#888" : "#999"}
                        color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                        className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4 border border-gray-200 dark:border-gray-800"
                    />

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Tags</Text>
                    <View className="flex-row items-center mb-4">
                        <View className="px-3 py-1 rounded-full bg-gray-200 mr-3 opacity-60">
                            <Text className="text-xs">Adoption</Text>
                        </View>
                    </View>

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Location</Text>
                    <View className="flex-row items-center bg-backgroundSecondary rounded-xl h-12 mb-4 border border-gray-200 dark:border-gray-800">
                        <TextInput
                            value={location}
                            onChangeText={setLocation}
                            placeholder="City, State"
                            placeholderTextColor={isDark ? "#888" : "#999"}
                            color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                            className="flex-1 px-3 h-12"
                        />
                        <Pressable onPress={getLocation} className="px-4 justify-center items-center h-full" disabled={locationLoading}>
                            {locationLoading ? <ActivityIndicator size="small" color="#E0583D" /> : <Ionicons name="locate" size={20} color="#E0583D" />}
                        </Pressable>
                    </View>

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Owner Details</Text>
                    <TextInput
                        value={ownerName}
                        onChangeText={setOwnerName}
                        placeholder="Owner name"
                        placeholderTextColor={isDark ? "#888" : "#999"}
                        color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                        className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-3 border border-gray-200 dark:border-gray-800"
                    />
                    <TextInput
                        value={ownerContact}
                        onChangeText={setOwnerContact}
                        placeholder="Contact (phone or email)"
                        placeholderTextColor={isDark ? "#888" : "#999"}
                        color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                        className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-6 border border-gray-200 dark:border-gray-800"
                    />

                    <Pressable onPress={onSubmit} disabled={isSubmitting} className={`h-12 rounded-xl py-3 ${isSubmitting ? 'bg-gray-400' : 'bg-buttonPrimary shadow-sm'} items-center justify-center mb-8 flex-row`}>
                        {isSubmitting ? (
                            <>
                                <ActivityIndicator size="small" color="#ffffff" />
                                <Text className="text-white font-bold ml-2">Saving Pet...</Text>
                            </>
                        ) : (
                            <Text className="text-white font-bold">Create Listing</Text>
                        )}
                    </Pressable>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

export default AddPets;