import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";

const Input = ({
  label = "Email or username",
  type = "text",
  textValue = "",
  icon = "mail-outline",
  rightIcon = null,
  isVerified = false,
  placeholder = "",
  onChangeText,
  editable = true,
  keyboardType = "default",
  maxLength,
  style,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const iconColor = getColor("textPrimary", isDark);
  const placeholderColor = getColor("inputPlaceholder", isDark);
  const successColor = getColor("success", isDark);

  return (
    <View
      className="flex-row items-center rounded-2xl border border-inputBorder overflow-hidden w-full"
      style={style}
    >
      {/* Left Icon */}
      {icon && (
        <View className="p-4 border-r border-inputBorder justify-center items-center">
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
      )}

      {/* Text Field */}
      <View className="flex-1 px-4 py-3">
        {/* <Text className="text-inputPlaceholder text-sm mb-1">{label}</Text> */}
        <TextInput
          className="text-base font-semibold p-0 m-0 outline-none color-textPrimary"
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          secureTextEntry={type === "password" && !showPassword}
          value={textValue}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      </View>

      {/* Verified Badge */}
      {isVerified && (
        <View className="flex-row items-center px-2.5 py-1 mr-3 rounded-full bg-green-500/10 border border-green-500/30">
          <Ionicons name="checkmark-circle" size={16} color={successColor} />
          <Text className="ml-1 text-xs font-semibold" style={{ color: successColor }}>
            Verified
          </Text>
        </View>
      )}

      {/* Custom Right Icon */}
      {rightIcon && !isVerified && (
        <View className="px-3">
          {typeof rightIcon === "string" ? (
            <Ionicons name={rightIcon} size={20} color={iconColor} />
          ) : (
            rightIcon
          )}
        </View>
      )}

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
