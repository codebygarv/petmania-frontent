import { Text, TouchableOpacity } from "react-native";
import React from "react";

interface ButtonProps {
  text: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      className={`rounded-xl py-4 px-8 shadow-md items-center justify-center ${
        disabled ? "bg-gray-400 opacity-60" : "bg-buttonPrimary"
      }`}
    >
      <Text className="text-white text-base font-semibold">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
