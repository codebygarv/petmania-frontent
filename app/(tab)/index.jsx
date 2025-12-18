import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const [user, setUser] = useState(null);

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

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning 🌅";
    if (hour < 18) return "Good Afternoon ☀️";
    return "Good Evening 🌙";
  };

  return (
    <View className="flex gap-4 pt-7 pl-6 pr-6 h-screen bg-background">
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
      <View>
      </View>
    </View>
  );
};

export default Index;
