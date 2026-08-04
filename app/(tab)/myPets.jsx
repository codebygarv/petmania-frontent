import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";
import { useDispatch, useSelector } from "react-redux";
import { getMyPetsAction, markPetAdoptedAction, deleteMyPetAction } from "../../redux/actions/petActions";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const getBackgroundColor = (index, isDark) => {
  const lightColors = [
    "bg-cyan-100", "bg-indigo-100", "bg-purple-100", "bg-green-100",
    "bg-pink-100", "bg-orange-100", "bg-yellow-100", "bg-blue-100",
    "bg-teal-100", "bg-sky-100", "bg-rose-100", "bg-gray-100", "bg-lime-100"
  ];
  const darkColors = [
    "dark:bg-cyan-900/30", "dark:bg-indigo-900/30", "dark:bg-purple-900/30", "dark:bg-green-900/30",
    "dark:bg-pink-900/30", "dark:bg-orange-900/30", "dark:bg-yellow-900/30", "dark:bg-blue-900/30",
    "dark:bg-teal-900/30", "dark:bg-sky-900/30", "dark:bg-rose-900/30", "dark:bg-gray-900/30", "dark:bg-lime-900/30"
  ];
  return `${lightColors[index % lightColors.length]} ${darkColors[index % darkColors.length]}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const MyPets = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const accentColor = getColor("accent", isDark);
  const graySoftColor = getColor("graySoft", isDark);

  const dispatch = useDispatch();
  const { myPets, myPetsLoading } = useSelector((state) => state.pet);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [refreshing, setRefreshing] = useState(false);

  const isIdentityVerified = Boolean(
    userInfo?.userVerified || userInfo?.isAdharVerified || userInfo?.isAadhaarVerified
  );

  useEffect(() => {
    dispatch(getMyPetsAction());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getMyPetsAction());
    setRefreshing(false);
  };

  const handleMarkAdopted = (petId) => {
    Alert.alert(
      "Mark as Adopted",
      "Are you sure this pet has been adopted?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Adopted",
          onPress: () => {
            dispatch(markPetAdoptedAction(petId)).then((res) => {
              if (res?.success) {
                Toast.show({ type: "success", text1: "Success", text2: "Pet marked as adopted" });
                dispatch(getMyPetsAction());
              } else {
                Toast.show({ type: "error", text1: "Error", text2: res?.error?.message || "Failed to update" });
              }
            });
          },
        },
      ]
    );
  };

  const handleDeletePet = (petId) => {
    Alert.alert(
      "Delete Pet",
      "Are you sure you want to delete this pet listing? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteMyPetAction(petId)).then((res) => {
              if (res?.success) {
                Toast.show({ type: "success", text1: "Deleted", text2: "Pet listing has been removed" });
                dispatch(getMyPetsAction());
              } else {
                Toast.show({ type: "error", text1: "Error", text2: res?.error?.message || "Failed to delete" });
              }
            });
          },
        },
      ]
    );
  };

  const handleAddPet = () => {
    if (!isIdentityVerified) {
      const isRecheck =
        userInfo?.verificationStatus === "recheck_requested" ||
        (userInfo?.verificationRejectReason && !isIdentityVerified);

      Toast.show({
        type: "error",
        text1: isRecheck ? "Re-check Required" : "Identity Verification Required",
        text2: isRecheck
          ? "Admin requested a re-check of your profile. Please check your email and update your details."
          : userInfo?.adharCardFrontImage
          ? "Your Aadhaar is pending admin verification before you can add pets."
          : "Please verify your Aadhaar in Edit Profile before adding pets for adoption.",
      });
      router.push("/EditProfile");
      return;
    }
    router.push("/AddPets");
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accentColor} />
        }
      >
        <View className="flex gap-4 pt-7 pl-6 pr-6">
          <View className="flex flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold color-textPrimary">
              My Pets
            </Text>
            <TouchableOpacity
              onPress={handleAddPet}
              className={`px-4 py-2 rounded-xl flex-row items-center ${isIdentityVerified ? 'bg-buttonPrimary' : 'bg-backgroundSecondary border border-border'}`}
            >
              <Ionicons
                name={isIdentityVerified ? "add" : "lock-closed-outline"}
                size={18}
                color={isIdentityVerified ? "white" : graySoftColor}
              />
              <Text className={`font-semibold ml-1 ${isIdentityVerified ? 'text-white' : 'color-textSecondary'}`}>
                Add Pet
              </Text>
            </TouchableOpacity>
          </View>

          {myPetsLoading && !refreshing ? (
            <ActivityIndicator size="large" color={accentColor} className="mt-10" />
          ) : !myPets || myPets.length === 0 ? (
            <View className="items-center justify-center mt-16">
              <Ionicons name="paw-outline" size={70} color={graySoftColor} />
              <Text className="color-textSecondary mt-4 text-center font-medium text-base">
                You haven&apos;t added any pets yet.
              </Text>
              <Text className="color-textSecondary opacity-80 mt-1 text-center text-sm">
                Start by adding your first pet for adoption.
              </Text>
              <TouchableOpacity
                onPress={handleAddPet}
                className="mt-6 px-6 py-3 bg-buttonPrimary rounded-xl flex-row items-center justify-center"
              >
                {!isIdentityVerified && (
                  <Ionicons name="lock-closed-outline" size={18} color="white" style={{ marginRight: 6 }} />
                )}
                <Text className="text-white font-semibold">Add Your First Pet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            myPets.map((pet, index) => {
              const petImage = pet.images && pet.images.length > 0 ? { uri: pet.images[0] } : require("../../assets/images/icon.png");
              const location = `${pet.city || ''}, ${pet.state || ''}`;

              return (
                <View key={pet._id} className="mb-4">
                  <View className={`rounded-3xl p-4 ${getBackgroundColor(index, isDark)} border border-border`}>
                    <View className="flex-row items-center">
                      <View className="w-24 h-24 rounded-2xl overflow-hidden mr-4">
                        <Image
                          source={petImage}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>

                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="font-bold text-lg color-textPrimary">
                            {pet.name}
                          </Text>
                          {pet.isAdopted ? (
                            <View className="px-2 py-1 bg-green-500/20 rounded-full">
                              <Text className="text-xs text-green-600 font-medium">Adopted</Text>
                            </View>
                          ) : pet.isApproved ? (
                            <View className="px-2 py-1 bg-green-500/10 rounded-full">
                              <Text className="text-xs text-green-500 font-medium">Approved</Text>
                            </View>
                          ) : (
                            <View className="px-2 py-1 bg-yellow-500/10 rounded-full">
                              <Text className="text-xs text-yellow-500 font-medium">Pending</Text>
                            </View>
                          )}
                        </View>

                        <Text className="text-sm color-textSecondary mb-1 capitalize">
                          {pet.type} • {pet.breed}
                        </Text>

                        <View className="flex-row items-center mb-1">
                          <Ionicons name="time-outline" size={14} color={graySoftColor} />
                          <Text className="text-xs ml-1 color-textSecondary">
                            {pet.age} years
                          </Text>
                        </View>

                        <View className="flex-row items-center mb-1">
                          <Ionicons name="location-outline" size={14} color={accentColor} />
                          <Text className="text-xs ml-1 color-textSecondary">
                            {location || "Location not set"}
                          </Text>
                        </View>

                        <Text className="text-xs color-textSecondary opacity-80 mt-1">
                          Added {formatDate(pet.createdAt)}
                        </Text>
                      </View>
                    </View>

                    {/* Action buttons */}
                    {!pet.isAdopted && (
                      <View className="flex-row justify-end mt-3 pt-3 border-t border-border gap-2">
                        <TouchableOpacity
                          onPress={() => router.push(`/EditPets?id=${pet._id}`)}
                          className="px-4 py-2 bg-blue-500/10 rounded-xl flex-row items-center"
                        >
                          <Ionicons name="create-outline" size={16} color={getColor("link", isDark)} />
                          <Text className="text-xs text-blue-500 font-medium ml-1">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeletePet(pet._id)}
                          className="px-4 py-2 bg-red-500/10 rounded-xl flex-row items-center"
                        >
                          <Ionicons name="trash-outline" size={16} color={getColor("error", isDark)} />
                          <Text className="text-xs text-red-500 font-medium ml-1">Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleMarkAdopted(pet._id)}
                          className="px-4 py-2 bg-green-500/10 rounded-xl flex-row items-center"
                        >
                          <Ionicons name="checkmark-circle-outline" size={16} color={getColor("success", isDark)} />
                          <Text className="text-xs text-green-600 font-medium ml-1">Mark Adopted</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MyPets;