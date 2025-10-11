import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";

const BackButton = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const BackButton = isDark ? "#EDEDED" : "#1C1C1C";

  const goToBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <TouchableOpacity onPress={goToBack}>
      <View className="bg-SocialBg dark:bg-SocialBgDark rounded-lg  items-center justify-center w-[40px] h-[40px]">
        <Ionicons name="chevron-back-outline" size={30} color={BackButton} />
      </View>
    </TouchableOpacity>
  );
};

export default BackButton;
