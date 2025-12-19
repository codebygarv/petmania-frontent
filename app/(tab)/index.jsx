import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "@/constants/config";

const Index = () => {
  const [user, setUser] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("dog");

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

  const petData = {
    dog: [
      {
        id: 1,
        name: "Samantha",
        distance: "2.5 km",
        image: config.dog1,
        bg: "bg-pink-100",
      },
      {
        id: 2,
        name: "Rocky",
        distance: "1.2 km",
        image: config.dog2,
        bg: "bg-blue-100",
      },
      {
        id: 3,
        name: "Bruno",
        distance: "3.0 km",
        image: config.dog3,
        bg: "bg-orange-100",
      },
      {
        id: 4,
        name: "Max",
        distance: "0.8 km",
        image: config.dog4,
        bg: "bg-green-100",
      },
      {
        id: 5,
        name: "Charlie",
        distance: "2.1 km",
        image: config.dog5,
        bg: "bg-purple-100",
      },
      {
        id: 6,
        name: "Buddy",
        distance: "1.6 km",
        image: config.dog6,
        bg: "bg-yellow-100",
      },
      {
        id: 7,
        name: "Oscar",
        distance: "4.2 km",
        image: config.dog7,
        bg: "bg-red-100",
      },
      {
        id: 8,
        name: "Leo",
        distance: "3.5 km",
        image: config.dog8,
        bg: "bg-indigo-100",
      },
      {
        id: 9,
        name: "Cooper",
        distance: "0.9 km",
        image: config.dog9,
        bg: "bg-teal-100",
      },
      {
        id: 10,
        name: "Bailey",
        distance: "2.8 km",
        image: config.dog10,
        bg: "bg-cyan-100",
      },
    ],

    cat: [
      {
        id: 11,
        name: "Kitty",
        distance: "3.1 km",
        image: config.cat1,
        bg: "bg-purple-100",
      },
      {
        id: 12,
        name: "Milo",
        distance: "1.8 km",
        image: config.cat2,
        bg: "bg-yellow-100",
      },
      {
        id: 13,
        name: "Luna",
        distance: "2.6 km",
        image: config.cat3,
        bg: "bg-pink-100",
      },
      {
        id: 14,
        name: "Oliver",
        distance: "0.7 km",
        image: config.cat4,
        bg: "bg-blue-100",
      },
      {
        id: 15,
        name: "Bella",
        distance: "4.0 km",
        image: config.cat5,
        bg: "bg-green-100",
      },
      {
        id: 16,
        name: "Simba",
        distance: "1.4 km",
        image: config.cat6,
        bg: "bg-orange-100",
      },
      {
        id: 17,
        name: "Chloe",
        distance: "2.2 km",
        image: config.cat7,
        bg: "bg-red-100",
      },
      {
        id: 18,
        name: "Nala",
        distance: "3.8 km",
        image: config.cat8,
        bg: "bg-indigo-100",
      },
      {
        id: 19,
        name: "Coco",
        distance: "0.5 km",
        image: config.cat9,
        bg: "bg-teal-100",
      },
      {
        id: 20,
        name: "Shadow",
        distance: "2.9 km",
        image: config.cat10,
        bg: "bg-cyan-100",
      },
    ],
  };

  const categories = [
    { name: "dog", ImageSrc: config.categoryDogImage },
    { name: "Cat", ImageSrc: config.categoryCatImage },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning 🌅";
    if (hour < 18) return "Good Afternoon ☀️";
    return "Good Evening 🌙";
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex gap-4 pt-7 pl-6 pr-6">
          <View className="flex flex-row items-center">
            <View className="flex justify-center items-center w-10 h-10 p-1 rounded-2xl overflow-hidden bg-loginSigcnupImageBg">
              <Image
                source={
                  {
                    // uri: "",
                  }
                }
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <Text className="text-center mx-20 text-xl color-textPrimary">
              <Ionicons name="location-outline" size={20} color={"#E0583D"} />
              <Text className="font-bold">Kurukshetra</Text>,IN
            </Text>

            <View className="flex justify-center items-center w-10 h-10 p-1 rounded-2xl overflow-hidden bg-loginSigcnupImageBg">
              <Ionicons name="search-outline" size={20} color={"#000"} />
            </View>
          </View>

          <View className="flex gap-4 pt-5">
            <Text className="text-xl font-bold color-textPrimary">
              Hi {user?.email?.split("@")[0]?.split("+")[0]?.trim()}
            </Text>
            <Text className="text-3xl color-textPrimary ">{getGreeting()}</Text>
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
                  {/* Pill */}
                  <View
                    className={`h-24 w-16 rounded-full items-center justify-center
              ${isActive ? "bg-buttonPrimary" : "bg-backgroundSecondary"}`}
                  >
                    {/* Image circle */}
                    <View className="h-10 w-10 bg-white rounded-full items-center justify-center">
                      <Image
                        source={categ.ImageSrc}
                        className="h-6 w-6"
                        resizeMode="contain"
                      />
                    </View>

                    {/* Text inside pill */}
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
            {petData[activeCategory]?.map((pet) => (
              <View key={pet.id} className="w-[48%] mb-4">
                <View className={`rounded-3xl p-4 ${pet.bg}`}>
                  {/* Heart */}
                  <View className="absolute top-3 right-3">
                    <Ionicons name="heart" size={18} color="#E0583D" />
                  </View>

                  {/* Image */}
                  <Image
                    source={pet.image}
                    className="w-full h-28"
                    resizeMode="contain"
                  />
                </View>

                {/* Info */}
                <View className="mt-2">
                  <Text className="font-bold text-base color-textPrimary">
                    {pet.name}
                  </Text>

                  <View className="flex flex-row items-center mt-1">
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#E0583D"
                    />
                    <Text className="text-xs ml-1 text-gray-500">
                      {pet.distance} Distance
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
