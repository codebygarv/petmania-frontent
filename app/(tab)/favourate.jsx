import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { config } from "@/constants/config";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";
import { useDispatch, useSelector } from "react-redux";
import { getFavouritesAction, toggleFavouriteAction } from "../../redux/actions/userActions";

const getBackgroundColor = (index) => {
  const colors = [
    "bg-cyan-100", "bg-indigo-100", "bg-purple-100", "bg-green-100",
    "bg-pink-100", "bg-orange-100", "bg-yellow-100", "bg-blue-100",
    "bg-teal-100", "bg-sky-100", "bg-rose-100", "bg-gray-100", "bg-lime-100"
  ];
  return colors[index % colors.length];
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-US', options);
};

const favourate = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const accentColor = getColor("accent", isDark);
  const graySoftColor = getColor("graySoft", isDark);

  const dispatch = useDispatch();
  const { favourites, loading } = useSelector((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getFavouritesAction());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getFavouritesAction());
    setRefreshing(false);
  };

  const handleToggleFavourite = (petId) => {
    dispatch(toggleFavouriteAction(petId));
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
          <Text className="text-2xl font-bold color-textPrimary mb-2">
            Favorite Pets
          </Text>

          {loading && !refreshing ? (
            <ActivityIndicator size="large" color={accentColor} className="mt-10" />
          ) : !favourites || favourites.length === 0 ? (
            <View className="items-center justify-center mt-10">
              <Ionicons name="heart-dislike-outline" size={60} color={graySoftColor} />
              <Text className="text-gray-500 mt-4 text-center">
                You haven't favorited any pets yet.
              </Text>
            </View>
          ) : (
            favourites.map((pet, index) => {
              const petImage = pet.images && pet.images.length > 0 ? { uri: pet.images[0] } : config.dog1;
              const location = `${pet.city || ''}, ${pet.country || ''}`;

              return (
                <View key={pet._id} className="mb-4">
                  <View className={`rounded-3xl p-4 ${getBackgroundColor(index)} flex-row items-center`}>
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
                        <TouchableOpacity onPress={() => handleToggleFavourite(pet._id)}>
                          <Ionicons name="heart" size={24} color={accentColor} />
                        </TouchableOpacity>
                      </View>
                      
                      <Text className="text-sm text-gray-600 mb-1 capitalize">
                        {pet.type} • {pet.breed}
                      </Text>
                      
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="time-outline" size={14} color={graySoftColor} />
                        <Text className="text-xs ml-1 text-gray-500">
                          {pet.age} years
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="location-outline" size={14} color={accentColor} />
                        <Text className="text-xs ml-1 text-gray-500">
                          {location}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-xs text-gray-400">
                          {formatDate(pet.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default favourate;
