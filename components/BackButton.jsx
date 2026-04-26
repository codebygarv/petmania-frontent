import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";

interface BackButtonProps {
  onPress?: () => void;
}

const BackButton = ({ onPress }: BackButtonProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const BackButtonColor = isDark ? "#EDEDED" : "#1C1C1C";

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
