import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const SocialLoginButtons = () => {
  return (
    <View className="flex w-full flex-wrap gap-3 flex-row justify-between">
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg rounded-xl py-4 px-4 items-center justify-center w-[48%]"
      >
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="logo-google" size={22} color="#444" />
          <Text className="text-black text-base font-semibold">Google</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg rounded-xl py-4 px-4 items-center justify-center w-[48%]"
      >
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="logo-apple" size={22} color="#444" />
          <Text className="text-black text-base font-semibold">Apple</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;
