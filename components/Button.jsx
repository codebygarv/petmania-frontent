import { Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import * as Haptics from "expo-haptics";

const Button = ({ text, onPress, disabled = false }) => {
  const handlePress = () => {
    if (!disabled) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress?.();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
      className={`rounded-xl py-4 px-8 shadow-md items-center justify-center ${
        disabled ? "bg-gray-400 dark:bg-gray-600 opacity-60" : "bg-buttonPrimary"
      }`}
    >
      <Text className="text-white text-base font-semibold">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
