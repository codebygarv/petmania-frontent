import { View, Image, Text, Dimensions } from "react-native";
import React from "react";
import { config } from "@/constants/config";
import Input from "@/components/Input";
import RememberMeToggle from "@/components/RememberMeToggle";
import Button from "@/components/Button";
import SocialLoginButtons from "@/components/SocialLoginButtons";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width * 0.5; // 90% of screen width
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.9;
const index = () => {
  return (
    <View className="flex gap-6 pt-7 pl-6 pr-6 h-screen bg-background">
      <View className="flex justify-center items-center w-20 h-20 p-2 mx-auto rounded-3xl overflow-hidden bg-loginSigcnupImageBg">
        <Image
          source={config.loginSignupImageBg}
          // className="h-[100%] w-[100%]"
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <View className="flex gap-5">
        <View className="flex gap-3  color-textPrimary">
          <Text className="text-3xl text-center font-semibold">
            Welcome Back!
          </Text>
          <Text className="text-sm text-center opacity-55">
            Let&apos;s Join Again
          </Text>
        </View>
        <View className="flex gap-4">
          <Input
            label="Email or username"
            icon="mail-outline"
            placeholder="abc@gmail.com"
          />
          <Input
            label="Password"
            type="password"
            icon="lock-closed-outline"
            placeholder="abc@gmail.com"
          />
          <RememberMeToggle />
        </View>
        <View className="flex gap-2">
          <Button text="Sign In" />
          <View className="flex flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="text-sm text-center text-gray-500 mx-3">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          <SocialLoginButtons />
          <Text className="text-center text-sm font-semibold">
            Don&apos;t Have an Account{" "}
            <Text className="text-sm font-semibold text-orange-500">
              signup
            </Text>
          </Text>
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
          source={config.LoginBottomImage}
          style={{ width: "100%", height: "100%", borderRadius: 24 }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default index;
