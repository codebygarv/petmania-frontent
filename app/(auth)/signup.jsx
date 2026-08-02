import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { config } from "@/constants/config";
import Input from "@/components/Input";
import Button from "@/components/Button";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { signupAction } from "@/redux/actions/userActions";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getColor } from "@/constants/color";


const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const Signup = () => {
  const { colorScheme } = useColorScheme();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  const isDark = colorScheme === "dark";

  const handleSubmit = async (values) => {
    const res = await dispatch(signupAction(values)); // sending the data to the backend
    console.log("values", values);
    console.log("res", JSON.stringify(res));

    if (res?.success === true || res?.data?.success === true) {
      Toast.show({
        type: 'success',
        text1: 'Signup Successful',
        text2: 'We have sent a verification code to your email.'
      });
      await AsyncStorage.setItem('email', values.email);
      router.push("/verification?type=register");
    } else {
      const errorMsg =
        (typeof res?.error?.message === 'string' && res.error.message) ||
        res?.error?.message?.error?.message ||
        res?.error?.error?.message ||
        res?.error?.message?.message ||
        (typeof res?.error === 'string' && res.error) ||
        'Registration failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: errorMsg
      });
    }

  };

  const handleLogin = () => {
    router.push("/(auth)");
  };

  return (
    <View className="flex gap-4 pt-7 pl-6 pr-6 h-screen bg-background">
      {/* Top Icon */}
      <View className="flex justify-center items-center w-20 h-20 p-2 mx-auto rounded-3xl overflow-hidden bg-loginSigcnupImageBg">
        <Image
          source={config.loginSignupImageBg}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      {/* Formik Setup */}
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
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
            {/* Header */}
            <View className="flex gap-3">
              <Text className="text-3xl text-center font-semibold color-textPrimary">
                Create Account
              </Text>
              <Text className="text-sm text-center opacity-55 color-textSecondary">
                Let&apos;s get started!
              </Text>
            </View>

            {/* Input Fields */}
            <View className="flex gap-4">
              <Input
                label="Email"
                icon="mail-outline"
                placeholder="Enter your email"
                textValue={values.email}
                onChangeText={handleChange("email")}
              />
              {touched.email && errors.email && (
                <Text className="text-error text-xs">{errors.email}</Text>
              )}

              <Input
                label="Password"
                type="password"
                icon="lock-closed-outline"
                placeholder="Enter password"
                textValue={values.password}
                onChangeText={handleChange("password")}
              />
              {touched.password && errors.password && (
                <Text className="text-error text-xs">{errors.password}</Text>
              )}

              <Input
                label="Confirm Password"
                type="password"
                icon="lock-closed-outline"
                placeholder="Confirm your password"
                textValue={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text className="text-error text-xs">
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            {/* Signup Button */}
            <View className="flex gap-2">
              <Button
                text={loading ? <ActivityIndicator color={getColor("white", isDark)} /> : 'Sign Up'}
                onPress={handleSubmit}
                disabled={!!(errors.email || errors.password || errors.confirmPassword) || loading}
              />

              {/* Divider */}
              <View className="flex flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-border" />
                <Text className="text-xs text-center color-textSecondary font-semibold mx-3">
                  OR
                </Text>
                <View className="flex-1 h-[1px] bg-border" />
              </View>

              {/* Social Buttons */}
              <SocialLoginButtons />

              {/* Navigate to Login */}
              <View className="flex-row justify-center items-center">
                <Text className="text-sm font-semibold color-textPrimary">
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text className="text-sm font-semibold color-buttonPrimary ml-1">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms & Conditions */}
            <Text className="color-textSecondary text-center text-[11px] leading-6">
              By registering, you accept our Terms & Conditions and Privacy
              Policy.
            </Text>
          </View>
        )}
      </Formik>

      {/* Bottom Image */}
      {/* <View
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
      </View> */}
    </View>
  );
};

export default Signup;
