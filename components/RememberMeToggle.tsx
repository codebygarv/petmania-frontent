import { Link, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";

interface RememberMeToggleProps {
  onToggle?: (remember: boolean) => void;
  onForgotPassword?: () => void;
}

const RememberMeToggle: React.FC<RememberMeToggleProps> = ({
  onToggle,
  onForgotPassword,
}) => {
  const [remember, setRemember] = useState(false);

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
          trackColor={{ false: "#D1D5DB", true: "#34D399" }} // gray-300 / green-400
          thumbColor={remember ? "#f9f9f9" : "#f4f3f4"} // green-500 / white
          ios_backgroundColor="#D1D5DB"
          onValueChange={handleToggle}
          value={remember}
        />
        <Text className="ml-2 text-base font-medium color-textPrimary">
          Remember me
        </Text>
      </View>

      {/* Right Side: Forgot Password */}
      <Link href="/forgotPassword">
        <TouchableOpacity onPress={handleForgotPassword} >
          <Text className="text-[14px] font-semibold color-textOrange">
            Forgot password?
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default RememberMeToggle;
