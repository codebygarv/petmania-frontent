import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { updatePasswordAction } from "@/redux/actions/userActions";  // example action for changing password
import { router } from "expo-router";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

interface ChangePasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ForgotPasswordChange = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch<any>();
  const loading = useSelector((state: any) => state.user.loading);

  const handlePasswordChange = async (values: ChangePasswordFormValues) => {
    console.log("Password Change Data:", values);  // remove in production

    const res = await dispatch(updatePasswordAction(values));

    if (res?.error?.success === false) {
      Toast.show({
        type: 'error',
        text1: 'Password Update Failed',
        text2: res?.error?.error?.message,
      });
    } else if (res?.success === true) {
      Toast.show({
        type: 'success',
        text1: 'Password Updated',
        text2: 'Your password has been successfully updated.',
      });
      // redirect to login or home
      router.push("/(auth)");
    } else {
      Toast.show({
        type: 'error',
        text1: 'Password Update Failed',
        text2: 'An unexpected error occurred. Please try again.',
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

      <Text className="color-textSecondary text-sm leading-6">
        After verifying your identity, you can now change your password.
      </Text>

      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handlePasswordChange}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View className="gap-5">
            <Input
              type="password"
              placeholder="Enter your new password"
              icon="lock-closed-outline"
              textValue={values.password}
              onChangeText={handleChange("password")}
            />
            {touched.password && errors.password && (
              <Text className="text-red-500 text-xs">{errors.password}</Text>
            )}

            <Input
              type="password"
              placeholder="Confirm your new password"
              icon="lock-closed-outline"
              textValue={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text className="text-red-500 text-xs">{errors.confirmPassword}</Text>
            )}

            <Button
              text={loading ? <ActivityIndicator color={getColor("white", isDark)} /> : "Update Password"}
              onPress={handleSubmit}
              disabled={!!(errors.password || errors.confirmPassword) || loading}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default ForgotPasswordChange;
