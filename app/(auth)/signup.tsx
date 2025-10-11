import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useState } from "react";
import { config } from "@/constants/config";
import Input from "@/components/Input";
import Button from "@/components/Button";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";

const { width, height } = Dimensions.get("window");

const getImageDimensions = () => {
  const IMAGE_WIDTH = height > 850 ? width * 0.5 : width * 0.4;
  const IMAGE_HEIGHT = IMAGE_WIDTH * 0.9;
  return { IMAGE_WIDTH, IMAGE_HEIGHT };
};

const signup = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { IMAGE_WIDTH, IMAGE_HEIGHT } = getImageDimensions();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const changeColor = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const handleLogin = () => {
    router.push("/(auth)");
  };

  return (
    <View className="flex gap-4 pt-7 pl-6 pr-6 h-screen bg-background">
      <View className="flex justify-center items-center w-20 h-20 p-2 mx-auto rounded-3xl overflow-hidden bg-loginSigcnupImageBg">
        <Image
          source={config.loginSignupImageBg}
          // className="h-[100%] w-[100%]"
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <View className="flex gap-2">
        <View className="flex gap-3 ">
          <Text className="text-3xl text-center font-semibold color-textPrimary">
            Sign Up
          </Text>
          <Text className="text-sm text-center opacity-55 color-textSecondary">
            Let&apos;s Create an Account
          </Text>
        </View>
        <View className="flex gap-4">
          <Input
            label="Name"
            placeholder="John Doe"
            textValue={formData.name}
            onChangeText={(value) => setFormData({ ...formData, name: value })}
          />
          <Input
            label="Email"
            placeholder="abc@gmail.com"
            textValue={formData.email}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
          />
          <Input
            label="Password"
            placeholder="******"
            textValue={formData.password}
            onChangeText={(value) =>
              setFormData({ ...formData, password: value })
            }
          />
          <Button text="Sign Up" onPress={changeColor} />
        </View>

        <View className="flex flex-row items-center my-4">
          <View className="flex-1 h-[1px] bg-textPrimary" />
          <Text className="text-sm text-center color-textPrimary mx-3">OR</Text>
          <View className="flex-1 h-[1px] bg-textPrimary" />
        </View>

        <SocialLoginButtons />

        <View className="flex-row justify-center items-center">
          <Text className="text-sm font-semibold color-textPrimary">
            Don’t have an account?
          </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text className="text-sm font-semibold text-orange-500 ml-1">
              SignIn
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        className="flex justify-center items-center p-2 mx-auto rounded-3xl overflow-hidden"
        style={{
          width: IMAGE_WIDTH,
          height: IMAGE_HEIGHT,
        }}
      >
        <Image
          source={config.SignupBottomImage}
          style={{ width: "100%", height: "100%", borderRadius: 24 }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default signup;
