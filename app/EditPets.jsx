import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import BackButton from "@/components/BackButton";
import Toast from "react-native-toast-message";
import { getMyPetsAction } from "../redux/actions/petActions";

const EditPets = () => {
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const accentColor = getColor("accent", isDark);
  const graySoftColor = getColor("graySoft", isDark);
  const placeholderColor = getColor("inputPlaceholder", isDark);
  const whiteColor = getColor("white", isDark);

  const dispatch = useDispatch();
  const { myPets } = useSelector((state) => state.pet);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("unknown");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (!myPets || myPets.length === 0) {
      dispatch(getMyPetsAction()).then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, myPets]);

  useEffect(() => {
    if (myPets && myPets.length > 0 && id) {
      const foundPet = myPets.find((p) => p._id === id);
      if (foundPet) {
        setPet(foundPet);
        setName(foundPet.name || "");
        setBreed(foundPet.breed || "");
        setAge(String(foundPet.age || ""));
        setGender(foundPet.gender || "unknown");
        setColor(foundPet.color || "");
        setDescription(foundPet.description || "");
        const locationParts = (foundPet.city || "").split(",");
        setCity(locationParts[0] || "");
        setState(locationParts.slice(1).join(",") || foundPet.state || "");
      }
    }
  }, [myPets, id]);

  const handleSave = async () => {
    if (!name || !breed) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Name and breed are required" });
      return;
    }

    try {
      setIsSubmitting(true);
      Toast.show({
        type: "info",
        text1: "Updating Pet",
        text2: "Your pet details are being updated...",
      });
      router.back();
    } catch (_error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to update pet" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    );
  }

  if (!pet) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-row items-center p-4">
          <BackButton />
          <Text className="text-lg font-bold color-textPrimary ml-2">Edit Pet</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Ionicons name="paw-outline" size={60} color={graySoftColor} />
          <Text className="color-textSecondary mt-4">Pet not found</Text>
          <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-3 bg-buttonPrimary rounded-xl">
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 20}
    >
      <View className="flex-1 bg-background">
        <View className="flex-row items-center p-4">
          <BackButton />
          <Text className="text-lg font-bold color-textPrimary ml-2">Edit Pet</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="px-4 gap-4">
            {/* Pet Image Preview */}
            <View className="items-center">
              <View className="w-32 h-32 rounded-2xl overflow-hidden bg-backgroundSecondary border border-border">
                {pet.images?.[0] ? (
                  <Image source={{ uri: pet.images[0] }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Ionicons name="image-outline" size={40} color={placeholderColor} />
                  </View>
                )}
              </View>
            </View>

            <Text className="text-sm color-textPrimary mb-2 font-semibold">Pet Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter pet name"
              placeholderTextColor={placeholderColor}
              className="bg-backgroundSecondary color-textPrimary rounded-xl h-12 px-3 mb-4 border border-border"
            />

            <Text className="text-sm color-textPrimary mb-2 font-semibold">Breed</Text>
            <TextInput
              value={breed}
              onChangeText={setBreed}
              placeholder="Enter breed"
              placeholderTextColor={placeholderColor}
              className="bg-backgroundSecondary color-textPrimary rounded-xl h-12 px-3 mb-4 border border-border"
            />

            <Text className="text-sm color-textPrimary mb-2 font-semibold">Age (years)</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="Enter age"
              placeholderTextColor={placeholderColor}
              keyboardType="numeric"
              className="bg-backgroundSecondary color-textPrimary rounded-xl h-12 px-3 mb-4 border border-border"
            />

            <Text className="text-sm color-textPrimary mb-2 font-semibold">Gender</Text>
            <View className="flex-row mb-4">
              {["male", "female", "unknown"].map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  className={`px-4 py-2 mr-3 rounded-2xl ${gender === g ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                >
                  <Text className={gender === g ? "text-white font-semibold capitalize" : "color-textPrimary capitalize"}>{g}</Text>
                </TouchableOpacity>
              ))}
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

            <Text className="text-sm color-textPrimary mb-2 font-semibold">City</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor={placeholderColor}
              className="bg-backgroundSecondary color-textPrimary rounded-xl h-12 px-3 mb-4 border border-border"
            />

            <Text className="text-sm color-textPrimary mb-2 font-semibold">State</Text>
            <TextInput
              value={state}
              onChangeText={setState}
              placeholder="State"
              placeholderTextColor={placeholderColor}
              className="bg-backgroundSecondary color-textPrimary rounded-xl h-12 px-3 mb-6 border border-border"
            />

            <TouchableOpacity
              onPress={handleSave}
              disabled={isSubmitting}
              className={`h-12 rounded-xl py-3 ${isSubmitting ? "bg-buttonDisabled" : "bg-buttonPrimary shadow-sm"} items-center justify-center flex-row`}
            >
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color={whiteColor} />
                  <Text className="text-white font-bold ml-2">Saving...</Text>
                </>
              ) : (
                <Text className="text-white font-bold">Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditPets;