import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Linking, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import BackButton from "@/components/BackButton";
import Toast from "react-native-toast-message";
import { getPetsAction, getMyPetsAction } from "../redux/actions/petActions";
import { toggleFavouriteAction } from "../redux/actions/userActions";

const PetDetails = () => {
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const accentColor = getColor("accent", isDark);

  const dispatch = useDispatch();
  const { pets, myPets } = useSelector((state) => state.pet);
  const { userInfo, favourites } = useSelector((state) => state.user);
  const [pet, setPet] = useState(null);

  useEffect(() => {
    if (!pets || pets.length === 0) {
      dispatch(getPetsAction());
    }
    if (!myPets || myPets.length === 0) {
      dispatch(getMyPetsAction());
    }
  }, [dispatch, pets, myPets]);

  useEffect(() => {
    const allPets = [...(pets || []), ...(myPets || [])];
    if (allPets.length > 0 && id) {
      const foundPet = allPets.find((p) => p._id === id);
      if (foundPet) {
        setPet(foundPet);
      }
    }
  }, [pets, myPets, id]);

  const isFavorite = favourites?.some((fav) => fav._id === pet?._id);
  const isOwnPet = pet?.userId?._id === userInfo?._id || pet?.userId === userInfo?._id;

  const handleToggleFavorite = () => {
    if (!pet) return;
    dispatch(toggleFavouriteAction(pet._id));
  };

  const handleContactOwner = () => {
    if (!pet?.userId?.phoneNumber) {
      Toast.show({
        type: "info",
        text1: "Contact Info",
        text2: "Phone number not available for this owner",
      });
      return;
    }
    const phone = pet.userId.phoneNumber;
    if (Platform.OS === "ios") {
      Linking.openURL(`sms:${phone}`);
    } else {
      Linking.openURL(`sms:${phone}?body=Hi, I'm interested in your pet ${pet.name} for adoption. Is it still available?`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!pet) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-row items-center p-4">
          <BackButton />
          <Text className="text-lg font-bold color-textPrimary ml-2">Pet Details</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={accentColor} />
          <Text className="text-gray-500 mt-4">Loading pet details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View className="flex-row items-center p-4 absolute top-0 left-0 right-0 z-10">
          <BackButton />
          <Text className="text-lg font-bold color-textPrimary ml-2">Pet Details</Text>
        </View>

        {/* Pet Images */}
        <View className="h-80 bg-neutral-200">
          {pet.images && pet.images.length > 0 ? (
            <Image
              source={{ uri: pet.images[0] }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-neutral-300 items-center justify-center">
              <Ionicons name="image-outline" size={60} color="#9ca3af" />
            </View>
          )}
        </View>

        <View className="p-4">
          {/* Pet Name & Favorite */}
          <View className="flex flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold color-textPrimary">{pet.name}</Text>
              <Text className="text-base color-textSecondary mt-1 capitalize">
                {pet.type} • {pet.breed}
              </Text>
            </View>
            <TouchableOpacity onPress={handleToggleFavorite} className="p-2">
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={28}
                color={isFavorite ? "#E0583D" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>

          {/* Status Badges */}
          <View className="flex flex-row gap-2 mt-3">
            {pet.isAdopted ? (
              <View className="px-3 py-1 bg-green-500/10 rounded-full">
                <Text className="text-xs text-green-600 font-medium">Adopted</Text>
              </View>
            ) : pet.isApproved ? (
              <View className="px-3 py-1 bg-green-500/10 rounded-full">
                <Text className="text-xs text-green-500 font-medium">Available</Text>
              </View>
            ) : (
              <View className="px-3 py-1 bg-yellow-500/10 rounded-full">
                <Text className="text-xs text-yellow-500 font-medium">Pending Approval</Text>
              </View>
            )}
          </View>

          {/* Quick Info Grid */}
          <View className="flex flex-row flex-wrap gap-3 mt-5">
            <View className="flex items-center bg-backgroundSecondary rounded-xl px-4 py-3 min-w-[100px]">
              <Ionicons name="time-outline" size={20} color={accentColor} />
              <Text className="text-xs text-gray-500 mt-1">Age</Text>
              <Text className="text-base font-semibold color-textPrimary">{pet.age} yrs</Text>
            </View>
            <View className="flex items-center bg-backgroundSecondary rounded-xl px-4 py-3 min-w-[100px]">
              <Ionicons name="male-female-outline" size={20} color={accentColor} />
              <Text className="text-xs text-gray-500 mt-1">Gender</Text>
              <Text className="text-base font-semibold color-textPrimary capitalize">{pet.gender}</Text>
            </View>
            <View className="flex items-center bg-backgroundSecondary rounded-xl px-4 py-3 min-w-[100px]">
              <Ionicons name="location-outline" size={20} color={accentColor} />
              <Text className="text-xs text-gray-500 mt-1">Location</Text>
              <Text className="text-base font-semibold color-textPrimary capitalize">{pet.city || "-"}</Text>
            </View>
          </View>

          {/* Description */}
          {pet.description && (
            <View className="mt-5">
              <Text className="text-base font-semibold color-textPrimary mb-2">About</Text>
              <Text className="text-sm color-textSecondary leading-5">{pet.description}</Text>
            </View>
          )}

          {/* Vaccination Info */}
          {pet.lastVaccinationDate && (
            <View className="mt-5 bg-backgroundSecondary rounded-xl p-4">
              <View className="flex flex-row items-center gap-2">
                <Ionicons name="shield-checkmark-outline" size={20} color={accentColor} />
                <Text className="text-sm font-medium color-textPrimary">Vaccination Up to Date</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Last vaccinated: {formatDate(pet.lastVaccinationDate)}
              </Text>
            </View>
          )}

          {/* Owner Info */}
          <View className="mt-5">
            <Text className="text-base font-semibold color-textPrimary mb-3">Owner Information</Text>
            <View className="bg-backgroundSecondary rounded-xl p-4">
              <View className="flex flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-full bg-buttonPrimary items-center justify-center">
                  <Text className="text-white font-bold text-lg">
                    {pet.userId?.name?.[0]?.toUpperCase() || "U"}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium color-textPrimary">
                    {pet.userId?.name || "Unknown"}
                  </Text>
                  {pet.userId?.phoneNumber && (
                    <Text className="text-xs text-gray-500 mt-0.5">
                      {pet.userId.phoneNumber}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Listed Date */}
          <View className="mt-4">
            <Text className="text-xs text-gray-400">
              Listed on {formatDate(pet.createdAt)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {!pet.isAdopted && !isOwnPet && (
        <View className="p-4 bg-background border-t border-neutral-200">
          <TouchableOpacity
            onPress={handleContactOwner}
            className="bg-buttonPrimary rounded-xl py-4 flex-row items-center justify-center"
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-2 text-base">Contact Owner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PetDetails;