import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps {
  label?: string;
  type?: "text" | "password";
  textValue?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  label = "Email or username",
  type = "text",
  textValue = "",
  icon = "mail-outline",
  placeholder = "",
}) => {
  const [value, setValue] = useState(textValue);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-row items-center bg-white rounded-2xl border border-gray-200 overflow-hidden w-full ">
      {/* Left Icon Section */}
      <View className="p-4 border-r border-gray-200 justify-center items-center">
        <Ionicons name={icon} size={22} color="#444" />
      </View>

      {/* Text Section */}
      <View className="flex-1 px-4 py-3">
        <Text className="text-gray-400 text-sm mb-1">{label}</Text>
        <TextInput
          className="text-black text-base font-semibold p-0 m-0 outline-none"
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={type === "password" && !showPassword}
          value={value}
          onChangeText={setValue}
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
            color="#444"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;
