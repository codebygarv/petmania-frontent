import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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


  return (
    <View className="flex-row items-center rounded-2xl border border-inputBorder overflow-hidden w-full ">
      {/* Left Icon Section */}
      <View className="p-4 border-r border-inputBorder justify-center items-center">
        <Ionicons name={icon} size={22} className="color-inputIconColor" />
      </View>

      {/* Text Section */}
      <View className="flex-1 px-4 py-3">
        <Text className="text-inputPlaceholder text-sm mb-1">{label}</Text>
        <TextInput
          className=" text-base font-semibold p-0 m-0 outline-none"
          placeholder={placeholder}
          secureTextEntry={type === "password" && !showPassword}
          value={textValue}
          onChangeText={onChangeText}
        />
      </View>

      {/* Password Eye Toggle */}
      {type === "password" && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="px-4"
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={22}
            className="color-inputIconColor"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;
