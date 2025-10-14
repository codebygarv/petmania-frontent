import { View, Text } from "react-native";
import React, { useState } from "react";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useColorScheme } from "nativewind";

const resetPassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const { toggleColorScheme } = useColorScheme();

  const changeColor = () => {
    toggleColorScheme();
  };
  return (
    <View className="flex gap-5 pt-7 pl-6 pr-6 h-screen bg-background">
      <View className="flex flex-row align-center">
        <BackButton />
        <Text className="text-center mx-20 color-textPrimary my-auto color-textPrimary font-semibold text-xl">
          Reset Password
        </Text>
      </View>
      <View className="gap-5">
        <Text className="color-textSecondary text-sm leading-6">
          You can reset Password by enter old password and new passowrd .
        </Text>

        <View className="gap-4">
          <Input
            label="Email"
            placeholder="Enter Your Old password"
            icon="lock-closed-outline"
            textValue={formData.oldPassword}
            onChangeText={(value) =>
              setFormData({ ...formData, oldPassword: value })
            }
          />
          <Input
            label="Email"
            placeholder="Enter Your Old password"
            icon="lock-closed-outline"
            textValue={formData.newPassword}
            onChangeText={(value) =>
              setFormData({ ...formData, newPassword: value })
            }
          />
          <Input
            label="Email"
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

export default resetPassword;
