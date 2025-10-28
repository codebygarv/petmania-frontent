import { View, Text } from "react-native";
import React, { useState } from "react";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import { useColorScheme } from "nativewind";
import Button from "@/components/Button";

const forgotPasswordChange = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const { toggleColorScheme } = useColorScheme();

  const changeColor = () => {
    toggleColorScheme();
  };
  return (
    <View className="flex gap-4 pt-7 pl-6 pr-6 h-screen bg-background">
      <View className="flex flex-row align-center">
        <BackButton />
        <Text className="text-center mx-20 color-textPrimary my-auto color-textPrimary font-semibold text-xl">
          Forgot Password
        </Text>
      </View>

      <View className="gap-5">
        <Text className="color-textSecondary text-sm leading-6">
          After Verifying Your identity Now you can Change Password.
        </Text>

        <View className="gap-4">
          <Input
            type="password"
            placeholder="Enter your new password"
            icon="lock-closed-outline"
            textValue={formData.newPassword}
            onChangeText={(value) =>
              setFormData({ ...formData, newPassword: value })
            }
          />
          <Input
            type="password"
            placeholder="Enter Your confirm new password"
            icon="lock-closed-outline"
            textValue={formData.confirmNewPassword}
            onChangeText={(value) =>
              setFormData({ ...formData, confirmNewPassword: value })
            }
          />
        </View>
        <Button text="Verify Now" onPress={changeColor} />
      </View>
    </View>
  );
};

export default forgotPasswordChange;
