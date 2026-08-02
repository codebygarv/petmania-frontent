import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    Image,
    TextInput,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    TouchableOpacity,
    FlatList,
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

// ──────────────────────────────────────────────
// Breed definitions per pet type
// ──────────────────────────────────────────────
const DOG_BREEDS = [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "Poodle",
    "Bulldog",
    "Beagle",
    "Siberian Husky",
    "Pomeranian",
    "Rottweiler",
    "Doberman",
    "Shih Tzu",
    "Pug",
    "Dachshund",
    "Border Collie",
    "Australian Shepherd",
    "Maltese",
    "Chihuahua",
    "Great Dane",
    "Boxer",
    "Saint Bernard",
    "Indian Pariah",
    "Mixed / Other",
];

const CAT_BREEDS = [
    "Persian",
    "Maine Coon",
    "Siamese",
    "Ragdoll",
    "Bengal",
    "British Shorthair",
    "Abyssinian",
    "Scottish Fold",
    "Sphynx",
    "Russian Blue",
    "Birman",
    "Himalayan",
    "Burmese",
    "American Shorthair",
    "Indian Street Cat (Desi)",
    "Mixed / Other",
];

// ──────────────────────────────────────────────
// BreedPicker component — modal bottom-sheet style
// ──────────────────────────────────────────────
const BreedPicker = ({ value, breeds, isDark, onSelect }) => {
    const [open, setOpen] = useState(false);
    const primaryTextColor = getColor("textPrimary", isDark);
    const placeholderColor = getColor("inputPlaceholder", isDark);
    const accentColor = getColor("accent", isDark);
    const bgColor = getColor("background", isDark);
    const bgSecondary = getColor("backgroundSecondary", isDark);
    const borderColor = getColor("border", isDark);

    return (
        <>
            <Pressable
                onPress={() => setOpen(true)}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: bgSecondary,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor,
                    height: 48,
                    paddingHorizontal: 12,
                    marginBottom: 16,
                }}
            >
                <Text
                    style={{
                        flex: 1,
                        color: value ? primaryTextColor : placeholderColor,
                        fontSize: 14,
                    }}
                    numberOfLines={1}
                >
                    {value || "Select breed"}
                </Text>
                <Ionicons name="chevron-down" size={18} color={placeholderColor} />
            </Pressable>

            <Modal visible={open} animationType="slide" transparent>
                <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View
                        style={{
                            backgroundColor: bgColor,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            maxHeight: "65%",
                            paddingTop: 16,
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 12 }}>
                            <Text style={{ fontSize: 16, fontWeight: "700", color: primaryTextColor }}>
                                Select Breed
                            </Text>
                            <TouchableOpacity onPress={() => setOpen(false)}>
                                <Ionicons name="close" size={22} color={primaryTextColor} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={breeds}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => {
                                const selected = item === value;
                                return (
                                    <TouchableOpacity
                                        onPress={() => { onSelect(item); setOpen(false); }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingHorizontal: 20,
                                            paddingVertical: 14,
                                            borderBottomWidth: 1,
                                            borderBottomColor: borderColor,
                                            backgroundColor: selected ? `${accentColor}15` : "transparent",
                                        }}
                                    >
                                        <Text style={{ flex: 1, color: selected ? accentColor : primaryTextColor, fontWeight: selected ? "600" : "400", fontSize: 14 }}>
                                            {item}
                                        </Text>
                                        {selected && <Ionicons name="checkmark" size={18} color={accentColor} />}
                                    </TouchableOpacity>
                                );
                            }}
                            contentContainerStyle={{ paddingBottom: 32 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};

// ──────────────────────────────────────────────
// Main AddPets screen
// ──────────────────────────────────────────────
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

    // Reset breed when pet type changes
    const handlePetTypeChange = (type) => {
        setPetType(type);
        setBreed("");
    };

    const breedList = useMemo(
        () => (petType === "dog" ? DOG_BREEDS : CAT_BREEDS),
        [petType]
    );

    // ─── Verification Check ───────────────────────
    const isEmailVerified = userInfo?.isVerified === true;
    const isAdharVerified = userInfo?.isAdharVerified === true;
    const canAddPet = isEmailVerified && isAdharVerified;

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

    // Get the current Location
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

    // Submit the Pet Data
    const onSubmit = async () => {
        if (!canAddPet) {
            Toast.show({ type: "error", text1: "Verification Required", text2: "Please verify your email and Aadhaar to add a pet" });
            return;
        }

        if (!name || !breed || !location) {
            Toast.show({ type: "error", text1: "Validation Error", text2: "Please fill all required fields" });
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
                name,
                type: petType,
                breed,
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
            console.log(res);

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
                    <BackButton />
                    <Text className="text-lg font-bold color-textPrimary ml-2">Add Pet for Adoption</Text>
                </View>

                {/* ── Verification Required Banner ─────────────── */}
                {!canAddPet && (
                    <View
                        className="rounded-xl p-3 mb-4 border"
                        style={{
                            backgroundColor: `${getColor("warning", isDark)}15`,
                            borderColor: `${getColor("warning", isDark)}40`,
                        }}
                    >
                        <View className="flex-row items-start">
                            <Ionicons name="shield-checkmark-outline" size={20} color={getColor("warning", isDark)} />
                            <View className="ml-2 flex-1">
                                <Text className="font-semibold text-sm mb-0.5" style={{ color: getColor("warning", isDark) }}>
                                    Verification Required
                                </Text>
                                <Text className="text-xs" style={{ color: getColor("warning", isDark) }}>
                                    {!isEmailVerified
                                        ? "Your email is not verified. Please verify your email first."
                                        : "Your Aadhaar is not verified. Please submit your Aadhaar details to list a pet."}
                                </Text>
                                <Pressable
                                    onPress={() => router.push("/EditProfile")}
                                    className="mt-2 self-start px-3 py-1 rounded-full"
                                    style={{ backgroundColor: `${getColor("warning", isDark)}30` }}
                                >
                                    <Text className="text-xs font-semibold" style={{ color: getColor("warning", isDark) }}>
                                        Go to Edit Profile →
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                )}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    style={!canAddPet ? { opacity: 0.5 } : undefined}
                    pointerEvents={!canAddPet ? "none" : "auto"}
                >
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
                            onPress={() => handlePetTypeChange("dog")}
                            className={`px-4 py-2 mr-3 rounded-2xl ${petType === "dog" ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                        >
                            <Text className={petType === "dog" ? "text-white font-semibold" : "color-textPrimary"}>Dog</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => handlePetTypeChange("cat")}
                            className={`px-4 py-2 rounded-2xl ${petType === "cat" ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                        >
                            <Text className={petType === "cat" ? "text-white font-semibold" : "color-textPrimary"}>Cat</Text>
                        </Pressable>
                    </View>

                    <Text className="text-sm color-textPrimary mb-2 font-semibold">Breed</Text>
                    <BreedPicker
                        value={breed}
                        breeds={breedList}
                        isDark={isDark}
                        onSelect={setBreed}
                    />

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
                        disabled={isSubmitting || !canAddPet}
                        className={`h-12 rounded-xl py-3 ${isSubmitting || !canAddPet ? 'bg-buttonDisabled' : 'bg-buttonPrimary shadow-sm'} items-center justify-center mb-8 flex-row`}
                    >
                        {isSubmitting ? (
                            <>
                                <ActivityIndicator size="small" color={getColor("white", isDark)} />
                                <Text className="text-white font-bold ml-2">Saving Pet...</Text>
                            </>
                        ) : (
                            <Text className="text-white font-bold">
                                {canAddPet ? "Create Listing" : "Verification Required"}
                            </Text>
                        )}
                    </Pressable>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

export default AddPets;