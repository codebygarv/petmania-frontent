import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useColorScheme } from "nativewind";
import BackButton from "@/components/BackButton";
import OtpInputBox from "@/components/otpInput";
import Button from "@/components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPasswordOtpAction,
  resendOtpAction,
  verifyOtpAction,
} from "@/redux/actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getColor } from "@/constants/color";

const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .length(4, "Code must be exactly 4 digits")
    .required("Recovery code is required"),
});

const Verification = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const { type } = useLocalSearchParams();

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendCode = async () => {
    if (!canResend) return;

    const email = await AsyncStorage.getItem(type === "forgot-password" ? "forgotPasswordemail" : "email");

    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Email not found. Please restart the process.",
      });
      return;
    }

    const res = await dispatch(resendOtpAction({ email, type }));

    if (res?.success) {
      Toast.show({
        type: "success",
        text1: "Code Sent",
        text2: "A new verification code has been sent to your email.",
      });
      setTimer(60);
      setCanResend(false);
    } else {
      const errorMsg = typeof res?.error === "string" ? res.error : res?.error?.message || res?.message || "Please try again later.";
      Toast.show({
        type: "error",
        text1: "Failed to send code",
        text2: errorMsg,
      });
    }
  };

  const handleVerify = async (values) => {
    if (type === "forgot-password") {
      const email = await AsyncStorage.getItem("forgotPasswordemail");

      if (!email) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Email not found. Please restart the verification process.",
        });
        return;
      }

      const res = await dispatch(
        forgotPasswordOtpAction({ email, otp: values.otp })
      );

      if (res?.success === true) {
        Toast.show({
          type: "success",
          text1: "Verification Successful",
          text2: res?.message || "OTP verified successfully.",
        });
        if (res?.data?.token) {
          await AsyncStorage.setItem("verifyChangePassword", res?.data?.token);
        }
        router.push("/forgotPasswordChange");
      } else {
        const errorMsg =
          res?.error?.message ||
          res?.error?.error?.message ||
          res?.message ||
          "Invalid or expired OTP. Please try again.";
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: errorMsg,
        });
      }
    } else {
      const email = await AsyncStorage.getItem("email");

      if (!email) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Email not found. Please restart the verification process.",
        });
        return;
      }
      const res = await dispatch(verifyOtpAction({ email, otp: values.otp }));
      if (res?.success === true) {
        // Auto-login: Save token and user info to AsyncStorage
        if (res?.data?.token) {
          await AsyncStorage.setItem("token", String(res.data.token));
        }
        if (res?.data?.user) {
          await AsyncStorage.setItem("userInfo", JSON.stringify(res.data.user));

          Toast.show({
            type: "success",
            text1: "Verification Successful",
            text2: "Welcome to Adoptrix!",
          });

          // Check if onboarding is needed
          if (!res.data.user.name) {
            router.replace("/FinishProfile");
          } else {
            router.replace("/(tab)");
          }
        }
      } else {
        const errorMsg =
          res?.error?.message ||
          res?.error?.error?.message ||
          res?.message ||
          "Invalid or expired OTP. Please try again.";
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: errorMsg,
        });
      }
    }
  };

  return (
    <View className="flex gap-5 pt-7 pl-6 pr-6 h-screen bg-background">
      <View className="flex flex-row items-center mb-2">
        <BackButton />
        <Text className="font-semibold text-xl color-textPrimary ml-4">
          Verification
        </Text>
      </View>

      <View className="gap-7">
        <View>
          {type === "forgot-password" ? (
            <Text className="color-textSecondary text-sm leading-6">
              Please enter the 4-digit recovery code sent to your email to reset
              your password.
            </Text>
          ) : (
            <Text className="color-textSecondary text-sm leading-6">
              Please enter the 4-digit verification code sent to your email to
              complete your registration.
            </Text>
          )}
        </View>

        <Text className="color-textSecondary text-sm leading-6">
          The code has been shared on your registered email. If you didn’t
          receive it, please check your spam folder.
        </Text>

        <Formik
          initialValues={{ otp: "" }}
          validationSchema={validationSchema}
          onSubmit={handleVerify}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View className="gap-5">
              <OtpInputBox value={values.otp} onChange={handleChange("otp")} />
              {touched.otp && errors.otp && (
                <Text className="text-error text-xs text-center">
                  {errors.otp}
                </Text>
              )}

              <Button
                text={loading ? <ActivityIndicator color={getColor("white", isDark)} /> : "Verify"}
                onPress={handleSubmit}
                disabled={!!errors.otp || loading}
              />

              <View>
                <Text className="color-textSecondary text-sm text-center">
                  Didn&apos;t receive any code?
                </Text>
                <TouchableOpacity
                  disabled={!canResend}
                  onPress={handleResendCode}
                >
                  <Text className={`text-sm text-center underline ${canResend ? 'color-buttonPrimary' : 'color-textSecondary opacity-50'}`}>
                    {canResend ? "Resend Code" : `Resend in ${timer}s`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default Verification;

