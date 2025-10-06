import { View, Image, Text, Dimensions } from "react-native";
import React, { useState } from "react";
import { config } from "@/constants/config";
import Input from "@/components/Input";
import RememberMeToggle from "@/components/RememberMeToggle";
import Button from "@/components/Button";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import { useColorScheme } from "nativewind";
import { Alert } from "react-native";

const { width, height } = Dimensions.get("window");

const getImageDimensions = () => {
  const IMAGE_WIDTH = height > 850 ? width * 0.5 : width * 0.4;
  const IMAGE_HEIGHT = IMAGE_WIDTH * 0.9;
  return { IMAGE_WIDTH, IMAGE_HEIGHT };
};
const Index = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { IMAGE_WIDTH, IMAGE_HEIGHT } = getImageDimensions();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const changeColor = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    console.log(formData);
    Alert.alert("Form Submitted", JSON.stringify(formData, null, 2));
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
      <View className="flex gap-5">
        <View className="flex gap-3 ">
          <Text className="text-3xl text-center font-semibold color-textPrimary">
            Welcome Back!
          </Text>
          <Text className="text-sm text-center opacity-55 color-textSecondary">
            Let&apos;s Join Again
          </Text>
        </View>
        <View className="flex gap-4">
          <Input
            label="Email or username"
            icon="mail-outline"
            placeholder="abc@gmail.com"
            textValue={formData.email}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
          />
          <Input
            label="Password"
            type="password"
            icon="lock-closed-outline"
            placeholder="******"
            textValue={formData.password}
            onChangeText={(value) => setFormData({ ...formData, password: value })}
          />
          <RememberMeToggle />
        </View>
        <View className="flex gap-2">
          <Button text="Sign In" onPress={changeColor} />
          <View className="flex flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-textPrimary" />
            <Text className="text-sm text-center color-textPrimary mx-3">OR</Text>
            <View className="flex-1 h-[1px] bg-textPrimary" />
          </View>

          <SocialLoginButtons />
          <Text className="text-center color-textPrimary text-sm font-semibold">
            Don&apos;t Have an Account{"  "}
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

export default Index;
