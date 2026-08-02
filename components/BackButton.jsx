import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";
import { getColor } from "@/constants/color";

const BackButton = ({ onPress }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const BackButtonColor = getColor("textPrimary", isDark);

  const goToBack = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <TouchableOpacity onPress={goToBack}>
      <View className="rounded-lg  items-center justify-center w-[40px] h-[40px]">
        <Ionicons name="chevron-back-outline" size={30} color={BackButtonColor} />
      </View>
    </TouchableOpacity>
  );
};

export default BackButton;
