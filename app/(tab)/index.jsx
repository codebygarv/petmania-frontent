import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import BackButton from "@/components/BackButton";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { config } from "@/constants/config";
import { useFocusEffect } from "expo-router";
import Search from "@/components/Search";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { getPetsAction } from "@/redux/actions/petActions";

const Index = () => {
  const [user, setUser] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("dog");
  const [showSearch, setShowSearch] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [petData, setPetData] = useState({ dog: [], cat: [] });
  const [petsLoading, setPetsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    };
    loadUser();
  }, []);

  const fetchPets = async (city) => {
    try {
      setPetsLoading(true);

      const res = await dispatch(getPetsAction(city));

      if (res && res.pets) {
        const fetchedDogs = res.pets.filter(p => (p.type || '').toLowerCase() === 'dog');
        const fetchedCats = res.pets.filter(p => (p.type || '').toLowerCase() === 'cat');

        const mapPet = (p, idx) => ({
          id: p._id,
          name: p.name,
          distance: p.city ? `${p.city}` : "Near you",
          image: p.images && p.images.length > 0 ? { uri: p.images[0] } : config.dog1,
          bg: ['bg-pink-100', 'bg-blue-100', 'bg-orange-100', 'bg-green-100'][idx % 4]
        });

        setPetData({
          dog: fetchedDogs.map(mapPet),
          cat: fetchedCats.map(mapPet)
        });
      }
    } catch (err) {
      console.error("Error fetching pets", err);
    } finally {
      setPetsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (location?.city) {
        fetchPets(location.city);
      } else if (!locationLoading && !location) {
        fetchPets('');
      }
    }, [location?.city, locationLoading])
  );

  const categories = [
    { name: "dog", ImageSrc: config.categoryDogImage },
    { name: "Cat", ImageSrc: config.categoryCatImage },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning 🌤️";
    if (hour < 18) return "Good Afternoon 🌞";
    if (hour < 22) return "Good Evening 🌇";
    return "Good Night 🌌";
  };

  const getUserInitials = () => {
    if (!user) return "U";

    let text = "";
    if (user.name) {
      text = user.name.trim();
    } else if (user.email) {
      text = user.email.split("@")[0].trim();
    } else {
      return "U";
    }

    if (text.length === 0) return "U";

    const firstChar = text.charAt(0).toUpperCase();
    const firstChar2 = text.charAt(1).toUpperCase();

    return firstChar + firstChar2;
  };

  useEffect(() => {
    (async () => {
      // Request permission
      try {
        setLocationLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Toast.show({
            type: "error",
            text1: "Permission Denied",
            text2: "Location permission is required to access this feature.",
          });
          return;
        }

        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation({ coords: loc.coords });

        if (loc && loc.coords) {
          const address = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          setLocation({
            coords: loc.coords,
            city: address[0]?.city || null,
            country: address[0]?.country?.trim() || null,
          });
        }
      } catch (err) {
        console.error("Location error:", err);
        Toast.show({
          type: "error",
          text1: "Location Error",
          text2: err?.message || "Unable to get location.",
        });
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  return (
    <View className="flex-1 bg-background overflow-hidden">
      {showSearch ? (
        <Search onClose={() => setShowSearch(false)} />
      ) : (
        <View className="flex gap-4 pt-7 pl-6 pr-6">
          <View className="flex flex-row items-center justify-between">
            <View className="flex justify-center items-center w-10 h-10 rounded-2xl overflow-hidden bg-buttonPrimary">
              <Text className="text-white font-bold text-sm">
                {getUserInitials()}
              </Text>
            </View>
            {
              location?.city && (
                <View className="flex-1 flex-row px-4 items-center justify-center">
                  <Ionicons name="location-outline" size={20} color={"#E0583D"} />
                  <Text className="font-bold text-xl color-textPrimary ml-1 text-center flex-shrink text-wrap">
                    {location?.city}
                  </Text>
                </View>
              )
            }
            <Pressable
              onPress={() => setShowSearch(true)}
              className="flex justify-center items-center w-10 h-10 p-1 rounded-2xl overflow-hidden bg-loginSigcnupImageBg"
            >
              <Ionicons name="search-outline" size={20} color={"#000"} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="flex pt-5 gap-1">
              <Text className="text-lg font-medium color-textSecondary opacity-80">
                Hi, {user?.name || user?.email?.split("@")[0]?.split("+")[0]?.trim() || "Guest"}
              </Text>
              <Text className="text-4xl font-extrabold color-textPrimary mb-5 tracking-tight">
                {getGreeting()}
              </Text>
            </View>
            <View className="flex flex-row">
              {categories.map((categ, index) => {
                const isActive = index === activeIndex;

                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setActiveIndex(index);
                      setActiveCategory(categ.name.toLowerCase());
                    }}
                    className="mr-6 items-center"
                  >
                    <View
                      className={`h-24 w-16 rounded-full items-center justify-center
              ${isActive ? "bg-buttonPrimary" : "bg-backgroundSecondary"}`}
                    >
                      <View className="h-10 w-10 bg-white rounded-full items-center justify-center">
                        <Image
                          source={categ.ImageSrc}
                          className="h-6 w-6"
                          resizeMode="contain"
                        />
                      </View>
                      <Text
                        className={`text-xs text-center mt-2
                ${isActive ? "text-white" : "text-gray-600"}`}
                      >
                        {categ.name}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View className="flex flex-row flex-wrap justify-between mt-6">
              {petsLoading ? (
                <View className="w-full py-10 items-center">
                  <Text className="color-textPrimary">Loading pets near you...</Text>
                </View>
              ) : petData[activeCategory]?.length === 0 ? (
                <View className="w-full py-10 items-center">
                  <Text className="color-textSecondary">No pets found in your area. Add some!</Text>
                </View>
              ) : (
                petData[activeCategory]?.map((pet) => (
                  <View key={pet.id} className="w-[48%] mb-4">
                    <View className={`rounded-3xl p-4 ${pet.bg}`}>
                      <View className="absolute top-3 right-3 z-10">
                        <Ionicons name="heart" size={18} color="#E0583D" />
                      </View>

                      <Image
                        source={pet.image}
                        className="w-full h-28"
                        resizeMode="contain"
                      />
                    </View>

                    <View className="mt-2 text-center text-wrap overflow-hidden">
                      <Text className="font-bold text-base color-textPrimary h-6">
                        {pet.name}
                      </Text>

                      <View className="flex flex-row items-center mt-1">
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color="#E0583D"
                        />
                        <Text className="text-xs ml-1 ext-gray-500 overflow-hidden line-clamp-1 w-[80%]">
                          {pet.distance}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Index;
