import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

const SocialLoginButtons = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const googleIconColor = isDark ? "#EDEDED" : "#1C1C1C";
  const appleIconColor = isDark ? "#EDEDED" : "#1C1C1C";

  return (
    <View className="flex w-full flex-wrap gap-3 flex-row justify-between">

      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg dark:bg-SocialBgDark rounded-xl py-4 px-4 items-center justify-center w-[48%]"
      >
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="logo-google" size={22} color={googleIconColor} />
          <Text className="text-textPrimary dark:text-textPrimaryDark text-base font-semibold">
            Google
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg dark:bg-SocialBgDark rounded-xl py-4 px-4 items-center justify-center w-[48%]"
      >
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="logo-apple" size={22} color={appleIconColor} />
          <Text className="text-textPrimary dark:text-textPrimaryDark text-base font-semibold">
            Apple
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;
