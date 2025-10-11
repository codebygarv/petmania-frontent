import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface InputProps {
  label?: string;
  type?: "text" | "password";
  textValue?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
  onChangeText?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  label = "Email or username",
  type = "text",
  textValue = "",
  icon = "mail-outline",
  placeholder = "",
  onChangeText,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const iconColor = isDark ? "#EDEDED" : "#1C1C1C";
  const placeholderColor = isDark ? "#757575" : "#9A9A9A";

  return (
    <View className="flex-row items-center rounded-2xl border border-inputBorder overflow-hidden w-full">
      {/* Left Icon */}
      {icon && (
        <View className="p-4 border-r border-inputBorder justify-center items-center">
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
      )}

      {/* Text Field */}
      <View className="flex-1 px-4 py-3">
        <Text className="text-inputPlaceholder  text-sm mb-1">{label}</Text>
        <TextInput
          className="text-base font-semibold p-0 m-0 outline-none color-textPrimary"
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          secureTextEntry={type === "password" && !showPassword}
          value={textValue}
          onChangeText={onChangeText}
        />
      </View>

      {/* Password Visibility Toggle */}
      {type === "password" && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="px-4"
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={22}
            color={iconColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;
