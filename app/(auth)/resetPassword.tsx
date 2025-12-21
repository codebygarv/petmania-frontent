import { View, Text } from "react-native";
import React from "react";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Old password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const resetPassword = () => {
  const handleSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    console.log("Reset Password Data:", values);
    // TODO: Implement reset password logic
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

        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View className="gap-4">
              <Input
                type="password"
                placeholder="Enter your old password"
                icon="lock-closed-outline"
                textValue={values.oldPassword}
                onChangeText={handleChange("oldPassword")}
              />
              {touched.oldPassword && errors.oldPassword && (
                <Text className="text-red-500 text-xs">{errors.oldPassword}</Text>
              )}

              <Input
                type="password"
                placeholder="Enter your new password"
                icon="lock-closed-outline"
                textValue={values.newPassword}
                onChangeText={handleChange("newPassword")}
              />
              {touched.newPassword && errors.newPassword && (
                <Text className="text-red-500 text-xs">{errors.newPassword}</Text>
              )}

              <Input
                type="password"
                placeholder="Enter Your confirm new password"
                icon="lock-closed-outline"
                textValue={values.confirmNewPassword}
                onChangeText={handleChange("confirmNewPassword")}
              />
              {touched.confirmNewPassword && errors.confirmNewPassword && (
                <Text className="text-red-500 text-xs">
                  {errors.confirmNewPassword}
                </Text>
              )}

              <Button
                text="Verify Now"
                onPress={handleSubmit}
                disabled={
                  !!(
                    errors.oldPassword ||
                    errors.newPassword ||
                    errors.confirmNewPassword
                  )
                }
              />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default resetPassword;
