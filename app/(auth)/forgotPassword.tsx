import { View, Text } from "react-native";
import React, { useState } from "react";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useColorScheme } from "nativewind";

const forgotPassword = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [formData, setFormData] = useState({
    email: "",
  });

  const changeColor = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <View className="flex gap-4 pt-7 pl-6 pr-6 h-screen bg-background">
      <View className="flex flex-row align-center">
        <BackButton />
        <Text className="text-center mx-20 color-textPrimary my-auto color-textPrimary font-semibold text-xl">
          Forgot Password
        </Text>
      </View>
      <View className="flex gap-4">
        <View className="flex gap-3 mt-4">
          <Text className=" color-textSecondary text-sm leading-6">
            We'll send you a 4 digit code on your email to reset your password.
            By continuing, you agree to our Terms of Service and Privacy Policy.
            We respect your privacy and will only use your email for password
            reset purposes. If you don't receive an email within 5 minutes,
            please check your spam folder or contact our support team.
          </Text>

          <View className="flex gap-4">
            <Input
              label="Email"
              placeholder="abc@gmail.com"
              textValue={formData.email}
              onChangeText={(value) =>
                setFormData({ ...formData, email: value })
              }
            />

            <Button text="Send" onPress={changeColor} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default forgotPassword;
