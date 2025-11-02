import { View, Image, Text, Dimensions, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { config } from "@/constants/config";
import Input from "@/components/Input";
import RememberMeToggle from "@/components/RememberMeToggle";
import Button from "@/components/Button";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "@/redux/actions/userActions";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const getImageDimensions = () => {
  const IMAGE_WIDTH = height > 850 ? width * 0.5 : width * 0.4;
  const IMAGE_HEIGHT = IMAGE_WIDTH * 0.9;
  return { IMAGE_WIDTH, IMAGE_HEIGHT };
};

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Index = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { IMAGE_WIDTH, IMAGE_HEIGHT } = getImageDimensions();

  const dispatch = useDispatch<any>();
  const loading = useSelector((state: any) => state.user.loading);

  const isDark = colorScheme === "dark";
  // const activityIndicator = isDark ? "#EDEDED" : "#1C1C1C"; 

  const handleSubmit = async (values: LoginFormValues) => {
    const res = await dispatch(loginAction(values));
    console.log("Login response:", res);
    Alert.alert("Login Response", JSON.stringify(res));


    if (res?.error?.success === false) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: res?.error?.error?.message,
      });
    } else if (res?.success === true) {
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: res?.message,
      });
      router.push("/");
    } else {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "An unexpected error occurred. Please try again.",
      });
    }
  }
  // const changeColor = () => {
  //   setColorScheme(colorScheme === "dark" ? "light" : "dark");
  // };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <View className="flex gap-4 pt-7 pl-6 pr-6 h-screen bg-background">
      <View className="flex justify-center items-center w-20 h-20 p-2 mx-auto rounded-3xl overflow-hidden bg-loginSigcnupImageBg">
        <Image
          source={config.loginSignupImageBg}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View className="flex gap-5">
            <View className="flex gap-3">
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
                textValue={values.email}
                onChangeText={handleChange("email")}
              />
              {touched.email && errors.email && (
                <Text className="text-red-500 text-xs">{errors.email}</Text>
              )}

              <Input
                label="Password"
                type="password"
                icon="lock-closed-outline"
                placeholder="******"
                textValue={values.password}
                onChangeText={handleChange("password")}
              />
              {touched.password && errors.password && (
                <Text className="text-red-500 text-xs">{errors.password}</Text>
              )}

              <RememberMeToggle />
            </View>

            <View className="flex gap-2">
              <Button text={loading ? <ActivityIndicator color={"#fff"} /> : 'Sign In'} onPress={handleSubmit} />

              <View className="flex flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-textPrimary" />
                <Text className="text-sm text-center color-textPrimary mx-3">
                  OR
                </Text>
                <View className="flex-1 h-[1px] bg-textPrimary" />
              </View>

              <SocialLoginButtons />

              <View className="flex-row justify-center items-center">
                <Text className="text-sm font-semibold color-textPrimary">
                  Don’t have an account?
                </Text>
                <TouchableOpacity onPress={handleSignup}>
                  <Text className="text-sm font-semibold text-orange-500 ml-1">
                    Signup
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* <View
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
            </View> */}
          </View>
        )}
      </Formik>
    </View>
  );
};

export default Index;