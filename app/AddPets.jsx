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
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { createPetAction } from "@/redux/actions/petActions";
import { getColor } from "@/constants/color";

const DOG_BREEDS = [
    "Labrador Retriever", "German Shepherd", "Golden Retriever", "Beagle",
    "Bulldog", "Poodle", "Rottweiler", "Shih Tzu", "Pug", "Doberman",
    "Siberian Husky", "Cocker Spaniel", "Pomeranian", "Great Dane",
    "Indian Pariah", "Rajapalayam", "Mudhol Hound", "Chihuahua", "Boxer",
    "Mixed Breed", "Other"
];

const CAT_BREEDS = [
    "Persian", "Siamese", "Maine Coon", "British Shorthair", "Ragdoll",
    "Bengal", "Sphynx", "Abyssinian", "Scottish Fold", "Russian Blue",
    "Himalayan", "Burmese", "Indian Domestic", "Mixed Breed", "Other"
];

const AddPets = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const accentColor = getColor("accent", isDark);
    const placeholderColor = getColor("inputPlaceholder", isDark);
    const primaryTextColor = getColor("textPrimary", isDark);
    const secondaryTextColor = getColor("textSecondary", isDark);

    const [images, setImages] = useState([]);
    const [name, setName] = useState("");
    const [petType, setPetType] = useState("dog");
    const [breed, setBreed] = useState("");
    const [customBreed, setCustomBreed] = useState("");
    const [gender, setGender] = useState("unknown");
    const [color, setColor] = useState("");
    const [age, setAge] = useState("");
    const [description, setDescription] = useState("");
    const [lastVaccinationDate, setLastVaccinationDate] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);

    const isIdentityVerified = Boolean(
        userInfo?.isAdharVerified || userInfo?.isAadhaarVerified || userInfo?.userVerified
    );

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
        if (!userInfo?.isVerified) {
            Toast.show({
                type: "error",
                text1: "Email Not Verified",
                text2: "Please verify your email address first"
            });
            return;
        }

        if (!isIdentityVerified) {
            Toast.show({
                type: "error",
                text1: "Identity Verification Required",
                text2: "Please complete Aadhaar/identity verification in your profile before adding a pet"
            });
            return;
        }

        const selectedBreed = breed === "Other" ? customBreed.trim() : breed;
        if (!name.trim() || !selectedBreed || !location.trim()) {
            Toast.show({ type: "error", text1: "Validation Error", text2: "Please fill all required fields (Name, Breed, Location)" });
            return;
        }
        if (images.length === 0) {
            Toast.show({ type: "error", text1: "Validation Error", text2: "Please add at least one photo" });
            return;
        }
        if (age && (isNaN(Number(age)) || Number(age) < 0 || Number(age) > 30)) {
            Toast.show({ type: "error", text1: "Validation Error", text2: "Age must be between 0 and 30 years" });
            return;
        }

        try {
            setIsSubmitting(true);

            const base64Images = images.map(img => `data:image/jpeg;base64,${img.base64}`);

            const locationParts = location.split(',').map(p => p.trim());
            const city = locationParts[0] || "Unknown";
            const state = locationParts[1] || "Unknown";

            const payload = {
                images: base64Images,
                name: name.trim(),
                type: petType,
                breed: selectedBreed,
                gender: gender,
                color: color || "Unknown",
                age: age ? Number(age) : 0,
                description: description,
                lastVaccinationDate: lastVaccinationDate || null,
                city: city,
                state: state,
                country: locationParts[2] || "Unknown",
                pincode: "000000",
            };

            const res = await dispatch(createPetAction(payload));

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

    const currentBreeds = petType === "dog" ? DOG_BREEDS : CAT_BREEDS;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}
        >
            <View className="flex-1 bg-background px-4 pt-6">
                <View className="flex-row items-center mb-4">
                    <BackButton />
                    <Text className="text-lg font-bold color-textPrimary ml-2">Add Pet for Adoption</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Verification Warning Banner if identity is not verified */}
                    {!isIdentityVerified && (
                        <Pressable
                            onPress={() => router.push("/EditProfile")}
                            className="rounded-2xl p-4 mb-4 flex-row items-center border"
                            style={{
                                backgroundColor: `${getColor("warning", isDark)}15`,
                                borderColor: `${getColor("warning", isDark)}40`,
                            }}
                        >
                            <Ionicons name="shield-outline" size={24} color={getColor("warning", isDark)} />
                            <View className="ml-3 flex-1">
                                <Text className="text-sm font-bold" style={{ color: getColor("warning", isDark) }}>
                                    Identity Verification Required
                                </Text>
                                <Text className="text-xs mt-0.5" style={{ color: secondaryTextColor }}>
                                    Your Aadhaar / Identity must be verified before listing pets. Tap here to complete verification in Edit Profile.
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={getColor("warning", isDark)} />
                        </Pressable>
                    )}

                    <Text className="text-sm color-textPrimary mb-2">Photos</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                        {images.length === 0 ? (
                            <Pressable
                                onPress={pickImage}
                                className="h-40 w-40 rounded-2xl bg-backgroundSecondary items-center justify-center mr-3 border border-border"
                            >
                                <Ionicons name="image-outline" size={36} color={primaryTextColor} />
                                <Text className="text-xs mt-2 color-textSecondary">Add Photo</Text>
                            </Pressable>
                        ) : (
                            images.map((img, i) => (
                                <View key={i} className="mr-3">
                                    <Image source={{ uri: img.uri }} className="h-40 w-40 rounded-2xl" resizeMode="cover" />
                                    <Pressable
                                        onPress={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 bg-backgroundSecondary rounded-full p-1 border border-border"
                                    >
                                        <Ionicons name="close" size={16} color={accentColor} />
                                    </Pressable>
                                </View>
                            ))
                        )}

                        {images.length < 2 && (
                            <Pressable onPress={pickImage} className="h-40 w-40 rounded-2xl bg-backgroundSecondary items-center justify-center border border-dashed border-border">
                                <Ionicons name="add" size={28} color={primaryTextColor} />
                                <Text className="text-xs mt-2 color-textSecondary opacity-70">Add Photo</Text>
                            </Pressable>
                        )}
                    </ScrollView>

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Pet Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter pet name"
                        placeholderTextColor={placeholderColor}
                        className="bg-backgroundSecondary color-textPrimary rounded-xl h-12 px-3 mb-4 border border-border"
                    />

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Pet Type</Text>
                    <View className="flex-row mb-4">
                        <Pressable
                            onPress={() => {
                                setPetType("dog");
                                setBreed("");
                                setCustomBreed("");
                            }}
                            className={`px-4 py-2 mr-3 rounded-2xl ${petType === "dog" ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                        >
                            <Text className={petType === "dog" ? "text-white font-semibold" : "color-textPrimary"}>Dog</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                setPetType("cat");
                                setBreed("");
                                setCustomBreed("");
                            }}
                            className={`px-4 py-2 rounded-2xl ${petType === "cat" ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                        >
                            <Text className={petType === "cat" ? "text-white font-semibold" : "color-textPrimary"}>Cat</Text>
                        </Pressable>
                    </View>

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Breed</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-3"
                        contentContainerStyle={{ gap: 8, paddingRight: 8 }}
                    >
                        {currentBreeds.map((b) => {
                            const isSelected = breed === b;
                            return (
                                <Pressable
                                    key={b}
                                    onPress={() => {
                                        setBreed(b);
                                        if (b !== "Other") {
                                            setCustomBreed("");
                                        }
                                    }}
                                    className={`px-3.5 py-2 rounded-full border ${isSelected ? "bg-buttonPrimary border-buttonPrimary" : "bg-backgroundSecondary border-border"}`}
                                >
                                    <Text className={`text-xs font-semibold ${isSelected ? "text-white" : "color-textPrimary"}`}>
                                        {b}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>

                    {breed === "Other" && (
                        <TextInput
                            value={customBreed}
                            onChangeText={setCustomBreed}
                            placeholder="Type custom breed name"
                            placeholderTextColor={placeholderColor}
                            className="bg-backgroundSecondary color-textPrimary rounded-xl h-12 px-3 mb-4 border border-border"
                        />
                    )}

                    {breed !== "" && breed !== "Other" && (
                        <Text className="text-xs mb-3 font-medium" style={{ color: accentColor }}>
                            Selected Breed: {breed}
                        </Text>
                    )}

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Age (years)</Text>
                    <TextInput
                        value={age}
                        onChangeText={setAge}
                        placeholder="Enter age in years"
                        placeholderTextColor={placeholderColor}
                        keyboardType="numeric"
                        className="bg-backgroundSecondary color-textPrimary rounded-xl h-12 px-3 mb-4 border border-border"
                    />

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Gender</Text>
                    <View className="flex-row mb-4">
                        <Pressable
                            onPress={() => setGender("male")}
                            className={`px-4 py-2 mr-3 rounded-2xl ${gender === "male" ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                        >
                            <Text className={gender === "male" ? "text-white font-semibold" : "color-textPrimary"}>Male</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setGender("female")}
                            className={`px-4 py-2 mr-3 rounded-2xl ${gender === "female" ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                        >
                            <Text className={gender === "female" ? "text-white font-semibold" : "color-textPrimary"}>Female</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setGender("unknown")}
                            className={`px-4 py-2 rounded-2xl ${gender === "unknown" ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                        >
                            <Text className={gender === "unknown" ? "text-white font-semibold" : "color-textPrimary"}>Unknown</Text>
                        </Pressable>
                    </View>

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Color</Text>
                    <TextInput
                        value={color}
                        onChangeText={setColor}
                        placeholder="Enter color"
                        placeholderTextColor={placeholderColor}
                        className="bg-backgroundSecondary color-textPrimary rounded-xl h-12 px-3 mb-4 border border-border"
                    />

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Description</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description"
                        placeholderTextColor={placeholderColor}
                        multiline
                        numberOfLines={3}
                        className="bg-backgroundSecondary color-textPrimary rounded-xl h-20 px-3 mb-4 border border-border"
                    />

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Last Vaccination Date</Text>
                    <Pressable
                        onPress={() => setShowDatePicker(true)}
                        className="bg-backgroundSecondary border border-border"
                        style={{
                            borderRadius: 12,
                            paddingHorizontal: 14,
                            paddingVertical: 12,
                            marginBottom: 4,
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 48
                        }}
                    >
                        <Text style={{
                            fontSize: 14,
                            color: lastVaccinationDate ? primaryTextColor : placeholderColor,
                            flex: 1
                        }}>
                            {lastVaccinationDate || "Select date"}
                        </Text>
                        <Ionicons name="calendar-outline" size={20} color={secondaryTextColor} />
                    </Pressable>

                    {showDatePicker && (
                        <DateTimePicker
                            value={lastVaccinationDate ? new Date(lastVaccinationDate) : new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                if (event.type === 'dismissed') {
                                    setShowDatePicker(false);
                                    return;
                                }
                                const currentDate = selectedDate || new Date();
                                setShowDatePicker(Platform.OS === 'ios');
                                const year = currentDate.getFullYear();
                                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                                const day = String(currentDate.getDate()).padStart(2, '0');
                                setLastVaccinationDate(`${year}-${month}-${day}`);
                            }}
                            maximumDate={new Date()}
                        />
                    )}

                    <Text className="text-sm color-textPrimary mb-2 font-semibold mt-4">Tags</Text>
                    <View className="flex-row items-center mb-4">
                        <View className="px-3 py-1 rounded-full bg-backgroundSecondary border border-border mr-3">
                            <Text className="text-xs color-textSecondary">Adoption</Text>
                        </View>
                    </View>

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Location</Text>
                    <View className="flex-row items-center bg-backgroundSecondary rounded-xl h-12 mb-4 border border-border">
                        <TextInput
                            value={location}
                            onChangeText={setLocation}
                            placeholder="City, State"
                            placeholderTextColor={placeholderColor}
                            style={{ color: primaryTextColor }}
                            className="flex-1 px-3 h-12"
                        />
                        <Pressable onPress={getLocation} className="px-4 justify-center items-center h-full" disabled={locationLoading}>
                            {locationLoading ? <ActivityIndicator size="small" color={accentColor} /> : <Ionicons name="locate" size={20} color={accentColor} />}
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={onSubmit}
                        disabled={isSubmitting}
                        className={`h-12 rounded-xl py-3 ${isSubmitting ? 'bg-buttonDisabled' : 'bg-buttonPrimary shadow-sm'} items-center justify-center mb-8 flex-row`}
                    >
                        {isSubmitting ? (
                            <>
                                <ActivityIndicator size="small" color={getColor("white", isDark)} />
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