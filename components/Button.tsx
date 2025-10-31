import { Text, TouchableOpacity } from "react-native";
import React from "react";

interface ButtonProps {
  text: React.ReactNode;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-buttonPrimary rounded-xl py-4 px-8 shadow-md items-center justify-center"
    >
      <Text className="text-white text-base font-semibold">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
