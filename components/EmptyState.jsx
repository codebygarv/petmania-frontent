import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";

const EmptyState = ({
  icon = "paw-outline",
  title,
  description,
  buttonText,
  onButtonPress,
  containerStyle,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const accentColor = getColor("accent", isDark);

  return (
    <View
      style={[{ alignItems: "center", justifyContent: "center", padding: 40 }, containerStyle]}
      className="bg-backgroundSecondary rounded-3xl"
    >
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        <Ionicons name={icon} size={48} color={accentColor} />
      </View>
      <Text className="text-xl font-bold color-textPrimary text-center mb-2">
        {title}
      </Text>
      <Text className="text-base color-textSecondary text-center leading-6 mb-8">
        {description}
      </Text>
      {buttonText && onButtonPress && (
        <TouchableOpacity
          onPress={onButtonPress}
          activeOpacity={0.8}
          className="bg-buttonPrimary px-8 py-3 rounded-2xl shadow-md"
        >
          <Text className="text-white font-bold text-base">{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
