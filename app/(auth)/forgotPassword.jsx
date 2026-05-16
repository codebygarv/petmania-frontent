import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordAction } from "@/redux/actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getColor } from "@/constants/color";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  const handleForgotPassword = async (values) => {
    console.log("Email Submitted:", values.email);

    // Save email to storage for later verification
    await AsyncStorage.setItem("forgotPasswordemail", values.email);

    const res = await dispatch(forgotPasswordAction({ email: values.email }));

    console.log("Forgot Password Response:", res);

    if (res?.error?.success === false) {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: res?.error?.error?.message
      });
    } else if (res?.success === true) {
      Toast.show({
        type: 'success',
        text1: 'Code Sent',
        text2: res?.message
      });
      router.push('/verification?type=forgot-password');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  return (
    <View className="flex gap-4 pt-7 pl-6 pr-6 h-screen bg-background">
      <View className="flex flex-row align-center">
        <BackButton />
        <Text className="text-center mx-20 color-textPrimary my-auto font-semibold text-xl">
          Forgot Password
        </Text>
      </View>

      <View className="flex gap-4">
        <View className="flex gap-3 mt-4">
          <Text className="color-textSecondary text-sm leading-6">
            We'll send you a 4 digit code on your email to reset your password.
          </Text>
          <Text className="color-textSecondary text-sm leading-6">
            If you don't receive an email within 5 minutes, please check your
            spam folder or contact our support team.
          </Text>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleForgotPassword}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <View className="flex gap-4">
                <Input
                  label="Email"
                  placeholder="Enter Your Registered Email Address"
                  textValue={values.email}
                  onChangeText={handleChange("email")}
                />
                {touched.email && errors.email && (
                  <Text className="text-red-500 text-xs ">
                    {errors.email}
                  </Text>
                )}

                <Button 
                  text={loading ? <ActivityIndicator color={getColor("white", isDark)} /> : 'Send'} 
                  onPress={handleSubmit}
                  disabled={!!errors.email || loading}
                />
              </View>
            )}
          </Formik>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;
