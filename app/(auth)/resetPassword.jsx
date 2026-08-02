import { View, Text } from "react-native";
import React from "react";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { resetPasswordAction } from "@/redux/actions/userActions";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

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

const ResetPassword = () => {
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    const res = await dispatch(resetPasswordAction({
      oldPassword: values.oldPassword,
      password: values.newPassword,
      confirmPassword: values.confirmNewPassword,
    }));
    console.log("Reset Password Data:", values);
    console.log("res", res);

    if (res?.success === true) {
      Toast.show({
        type: 'success',
        text1: 'Password Updated',
        text2: res?.message || 'Your password has been changed successfully.',
      });
      router.back();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: res?.error?.message || 'Something went wrong',
      });
    }
  };

  return (
    <View className="flex gap-5 pt-7 pl-6 pr-6 h-screen bg-background">
      <View className="flex flex-row items-center mb-2">
        <BackButton />
        <Text className="color-textPrimary font-semibold text-xl ml-4">
          Change Password
        </Text>
      </View>
      <View className="gap-5">
        <Text className="color-textSecondary text-sm leading-6">
          You can update your password by entering your current password and your new password.
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
                <Text className="text-error text-xs">{errors.oldPassword}</Text>
              )}

              <Input
                type="password"
                placeholder="Enter your new password"
                icon="lock-closed-outline"
                textValue={values.newPassword}
                onChangeText={handleChange("newPassword")}
              />
              {touched.newPassword && errors.newPassword && (
                <Text className="text-error text-xs">{errors.newPassword}</Text>
              )}

              <Input
                type="password"
                placeholder="Enter Your confirm new password"
                icon="lock-closed-outline"
                textValue={values.confirmNewPassword}
                onChangeText={handleChange("confirmNewPassword")}
              />
              {touched.confirmNewPassword && errors.confirmNewPassword && (
                <Text className="text-error text-xs">
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

export default ResetPassword;
