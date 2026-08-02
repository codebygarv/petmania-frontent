import { View, Text, Pressable, ScrollView, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";
import * as Location from "expo-location";
import { config } from "@/constants/config";
import { useFocusEffect, router } from "expo-router";
import Search from "@/components/Search";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { getPetsAction } from "@/redux/actions/petActions";
import { getUserDetailsAction, toggleFavouriteAction, getFavouritesAction } from "@/redux/actions/userActions";
import HomeSkeleton from "@/components/HomeSkeleton/HomeSkeleton";
import EmptyState from "@/components/EmptyState";
import { PET_CATEGORIES } from "@/constants/petTypes";
import { Modal } from "react-native";
import DogIcon from "@/components/icons/DogIcon";
import CatIcon from "@/components/icons/CatIcon";
import BirdIcon from "@/components/icons/BirdIcon";
import RabbitIcon from "@/components/icons/RabbitIcon";
import FishIcon from "@/components/icons/FishIcon";
import HamsterIcon from "@/components/icons/HamsterIcon";
import HorseIcon from "@/components/icons/HorseIcon";

const Index = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userInfo: user, favourites } = useSelector((state) => state.user);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSearch, setShowSearch] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [petData, setPetData] = useState([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterGender, setFilterGender] = useState("all");
  const [filterAge, setFilterAge] = useState("all");
  const dispatch = useDispatch();

  const accentColor = getColor("accent", isDark);
  const whiteColor = getColor("white", isDark);

  const fetchUserDetails = useCallback(async () => {
    await dispatch(getUserDetailsAction());
    await dispatch(getFavouritesAction());
  }, [dispatch]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleToggleFavourite = (petId) => {
    dispatch(toggleFavouriteAction(petId));
  };


  const fetchPets = useCallback(async (city, category = activeCategory, gender = filterGender, age = filterAge) => {
    try {
      setPetsLoading(true);

      let minAge = undefined;
      let maxAge = undefined;
      if (age === "baby") { minAge = 0; maxAge = 1; }
      else if (age === "young") { minAge = 1; maxAge = 3; }
      else if (age === "adult") { minAge = 3; maxAge = 30; }

      const res = await dispatch(getPetsAction({ city, type: category, gender, minAge, maxAge }));

      if (res && res.pets) {
        const mapPet = (p, idx) => ({
          id: p._id,
          name: p.name,
          distance: p.city ? `${p.city}` : "Near you",
          image: p.images && p.images.length > 0 ? { uri: p.images[0] } : config.dog1,
          bg: ['bg-pink-100', 'bg-blue-100', 'bg-orange-100', 'bg-green-100'][idx % 4]
        });

        setPetData(res.pets.map(mapPet));
      }
    } catch (err) {
      console.error("Error fetching pets", err);
    } finally {
      setPetsLoading(false);
    }
  }, [dispatch, activeCategory, filterGender, filterAge]);

  useFocusEffect(
    useCallback(() => {
      if (location?.city) {
        fetchPets(location.city);
      } else if (!locationLoading && !location) {
        fetchPets('');
      }
    }, [location, locationLoading, fetchPets])
  );



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

  const fetchLocation = async (isRetry = false) => {
    try {
      setLocationLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationPermissionDenied(true);
        if (isRetry) {
          Toast.show({
            type: "error",
            text1: "Permission Denied",
            text2: "Location is Not allowed.",
          });
        }
        return;
      }
      
      setLocationPermissionDenied(false);

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
  };

  useEffect(() => {
    fetchLocation(false);
  }, []);



  return (
    <View className="flex-1 bg-background overflow-hidden">
      {showSearch ? (
        <Search onClose={() => setShowSearch(false)} />
      ) : (
        <View className="flex gap-4 pt-7 pl-6 pr-6">
          <View className="flex flex-row items-center justify-between">
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                className="w-10 h-10 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="flex justify-center items-center w-10 h-10 rounded-2xl overflow-hidden bg-buttonPrimary">
                <Text className="text-white font-bold text-sm">
                  {getUserInitials()}
                </Text>
              </View>
            )}
            {
              locationLoading ? (
                <View className="flex-1 flex-row px-4 items-center justify-center">
                  <ActivityIndicator size="small" color={accentColor} />
                </View>
              ) : locationPermissionDenied ? (
                <View className="flex-1 flex-row px-4 items-center justify-center">
                  <Pressable 
                    onPress={() => fetchLocation(true)}
                    className="bg-buttonPrimary px-3 py-1 rounded-full items-center justify-center"
                  >
                    <Text className="text-white text-xs font-bold">Allow Location</Text>
                  </Pressable>
                </View>
              ) : location?.city && (
                <View className="flex-1 flex-row px-4 items-center justify-center">
                  <Ionicons name="location-outline" size={20} color={accentColor} />
                  <Text className="font-bold text-xl color-textPrimary ml-1 text-center flex-shrink text-wrap">
                    {location?.city}
                  </Text>
                </View>
              )
            }
            <View className="flex-row items-center">
              <Pressable
                onPress={() => setShowFilters(true)}
                className="flex justify-center items-center w-10 h-10 p-1 rounded-2xl overflow-hidden bg-backgroundSecondary border border-border mr-2"
              >
                <Ionicons name="options" size={20} color={accentColor} />
              </Pressable>
              <Pressable
                onPress={() => setShowSearch(true)}
                className="flex justify-center items-center w-10 h-10 p-1 rounded-2xl overflow-hidden bg-loginSigcnupImageBg"
              >
                <Ionicons name="search-outline" size={20} color={whiteColor} />
              </Pressable>
            </View>
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
            <View className="flex flex-row mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {PET_CATEGORIES.map((categ, index) => {
                  const isActive = activeCategory === categ.id;
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        setActiveCategory(categ.id);
                        if (location?.city) fetchPets(location.city, categ.id);
                        else fetchPets('', categ.id);
                      }}
                      className="mr-4 items-center"
                    >
                      <View
                        className={`h-16 w-16 rounded-3xl items-center justify-center
                ${isActive ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                      >
                        {categ.id === "dog" ? (
                          <DogIcon width={32} height={32} color={isActive ? whiteColor : accentColor} />
                        ) : categ.id === "cat" ? (
                          <CatIcon width={32} height={32} color={isActive ? whiteColor : accentColor} />
                        ) : categ.id === "bird" ? (
                          <BirdIcon width={32} height={32} color={isActive ? whiteColor : accentColor} />
                        ) : categ.id === "rabbit" ? (
                          <RabbitIcon width={32} height={32} color={isActive ? whiteColor : accentColor} />
                        ) : categ.id === "fish" ? (
                          <FishIcon width={32} height={32} color={isActive ? whiteColor : accentColor} />
                        ) : categ.id === "hamster" ? (
                          <HamsterIcon width={32} height={32} color={isActive ? whiteColor : accentColor} />
                        ) : categ.id === "horse" ? (
                          <HorseIcon width={32} height={32} color={isActive ? whiteColor : accentColor} />
                        ) : (
                           <Ionicons name={categ.icon} size={28} color={isActive ? whiteColor : accentColor} />
                        )}
                      </View>
                      <Text
                        className={`text-xs text-center mt-2 font-semibold
                ${isActive ? "color-textPrimary" : "color-textSecondary"}`}
                      >
                        {categ.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View className="flex flex-row flex-wrap justify-between mt-6">
              {locationLoading ? (
                <View className="flex-1 flex-row gap-3 px-4 items-center justify-center">
                  <Text className="text-lg font-medium color-textSecondary opacity-80">Loading location...</Text>
                </View>
              ) :
                (petsLoading ? (
                  <HomeSkeleton />
                ) : petData?.length === 0 ? (
                  <EmptyState
                    title="No Pets Found"
                    description="There are no pets available matching your criteria. Try changing your category or filters!"
                    icon="paw-outline"
                  />
                ) : (
                  petData?.map((pet) => (
                    <View key={pet.id} className="w-[48%] mb-4">
                      <View className={`rounded-3xl p-2 ${pet.bg} ${isDark ? 'opacity-90' : ''} border border-border`}>
                        <Pressable
                          className="absolute top-2 right-2 z-10 p-1"
                          onPress={() => handleToggleFavourite(pet.id)}
                        >
                          <Ionicons
                            name={favourites?.some(fav => fav._id === pet.id) ? "heart" : "heart-outline"}
                            size={20}
                            color={accentColor}
                          />
                        </Pressable>

                        <Pressable onPress={() => router.push(`/PetDetails?id=${pet.id}`)}>
                          <Image
                            source={pet.image}
                            className="w-full h-40 rounded-2xl"
                            resizeMode="cover"
                          />
                        </Pressable>
                      </View>

                      <View className="mt-2 text-center text-wrap overflow-hidden">
                        <Text className="font-bold text-base color-textPrimary h-6">
                          {pet.name}
                        </Text>

                        <View className="flex flex-row items-center mt-1">
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color={accentColor}
                          />
                          <Text className="text-xs ml-1 color-textSecondary overflow-hidden line-clamp-1 w-[80%]">
                            {pet.distance}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background rounded-t-3xl p-6 h-[60%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold color-textPrimary">Filters</Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={getColor("textSecondary", isDark)} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-sm font-semibold color-textPrimary mb-3">Gender</Text>
              <View className="flex-row gap-3 mb-6">
                {["all", "male", "female"].map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => setFilterGender(g)}
                    className={`px-4 py-2 rounded-2xl ${filterGender === g ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                  >
                    <Text className={`font-semibold capitalize ${filterGender === g ? "text-white" : "color-textPrimary"}`}>{g}</Text>
                  </Pressable>
                ))}
              </View>

              <Text className="text-sm font-semibold color-textPrimary mb-3">Age</Text>
              <View className="flex-row flex-wrap gap-3 mb-6">
                {[
                  { id: "all", label: "Any Age" },
                  { id: "baby", label: "Baby (< 1 yr)" },
                  { id: "young", label: "Young (1-3 yrs)" },
                  { id: "adult", label: "Adult (3+ yrs)" },
                ].map((a) => (
                  <Pressable
                    key={a.id}
                    onPress={() => setFilterAge(a.id)}
                    className={`px-4 py-2 rounded-2xl mb-2 ${filterAge === a.id ? "bg-buttonPrimary" : "bg-backgroundSecondary border border-border"}`}
                  >
                    <Text className={`font-semibold ${filterAge === a.id ? "text-white" : "color-textPrimary"}`}>{a.label}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View className="flex-row gap-4 mt-auto">
              <Pressable
                onPress={() => {
                  setFilterGender("all");
                  setFilterAge("all");
                }}
                className="flex-1 py-3 rounded-2xl bg-backgroundSecondary border border-border items-center"
              >
                <Text className="font-bold color-textPrimary">Reset</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowFilters(false);
                  if (location?.city) fetchPets(location.city);
                  else fetchPets('');
                }}
                className="flex-1 py-3 rounded-2xl bg-buttonPrimary items-center"
              >
                <Text className="font-bold text-white">Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Index;
