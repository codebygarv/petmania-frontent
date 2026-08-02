import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";

const RememberMeToggle = ({
  onToggle,
  onForgotPassword,
}) => {
  const [remember, setRemember] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleToggle = () => {
    const newValue = !remember;
    setRemember(newValue);
    onToggle?.(newValue);
  };

  const handleForgotPassword = () => {
    onForgotPassword?.();
    router.push("/forgotPassword");
  };

  return (
    <View className="flex flex-row justify-between items-center mt-1">
      {/* Left Side: Toggle + Label */}
      <View className="flex flex-row items-center">
        <Switch
          trackColor={{ false: getColor("border", isDark), true: getColor("accent", isDark) }}
          thumbColor={getColor("white", isDark)}
          ios_backgroundColor={getColor("border", isDark)}
          onValueChange={handleToggle}
          value={remember}
        />
        <Text className="ml-2 text-base font-medium color-textPrimary">
          Remember me
        </Text>
      </View>

      {/* Right Side: Forgot Password */}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text className="text-[14px] font-semibold color-buttonPrimary">
          Forgot password?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RememberMeToggle;
