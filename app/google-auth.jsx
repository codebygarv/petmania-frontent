import React, { useEffect, useRef, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useColorScheme } from "nativewind";
import { useDispatch } from "react-redux";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { googleLoginAction } from "@/redux/actions/userActions";
import { getColor } from "@/constants/color";

export default function GoogleAuthCallback() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch();
  const isProcessing = useRef(false);

  const handleUrl = useCallback(async (url) => {
    if (!url || isProcessing.current) return;

    try {
      const fragment = url.includes("#")
        ? url.split("#")[1]
        : url.includes("?")
        ? url.split("?")[1]
        : "";
      const urlParams = new URLSearchParams(fragment);

      const token = urlParams.get("token");
      const userParam = urlParams.get("user");
      const accessToken = urlParams.get("access_token");
      const error = urlParams.get("error");

      if (error) {
        Toast.show({ type: "error", text1: "Google login failed: " + error });
        router.replace("/(auth)");
        return;
      }

      if (token) {
        isProcessing.current = true;
        let userData = null;
        if (userParam) {
          try {
            userData = JSON.parse(decodeURIComponent(userParam));
          } catch (e) {
            console.error("User parse error:", e);
          }
        }

        await AsyncStorage.setItem("token", token);
        if (userData) {
          await AsyncStorage.setItem("userInfo", JSON.stringify(userData));
        }

        Toast.show({
          type: "success",
          text1: "Google Login Successful",
        });
        router.replace("/(tab)");
        return;
      }

      if (accessToken) {
        isProcessing.current = true;
        const res = await dispatch(googleLoginAction(accessToken));
        if (res?.success) {
          await AsyncStorage.setItem("userInfo", JSON.stringify(res.data.user));
          await AsyncStorage.setItem("token", res.data.token);
          Toast.show({
            type: "success",
            text1: "Google Login Successful",
          });
          router.replace("/(tab)");
        } else {
          Toast.show({
            type: "error",
            text1: "Google Login Failed",
            text2: res?.message || "Authentication error",
          });
          router.replace("/(auth)");
        }
        return;
      }

      Toast.show({
        type: "error",
        text1: "Google Login Failed",
        text2: "No authentication data received",
      });
      router.replace("/(auth)");
    } catch (_error) {
      console.error("Google auth handler error:", _error);
      Toast.show({
        type: "error",
        text1: "Authentication Error",
        text2: "An unexpected error occurred",
      });
      router.replace("/(auth)");
    } finally {
      isProcessing.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    Linking.getInitialURL().then(handleUrl);

    const subscription = Linking.addEventListener("url", (event) => {
      if (event?.url) handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleUrl]);

  return (
    <View className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator size="large" color={getColor("accent", isDark)} />
      <Text className="mt-4 text-base font-semibold color-textPrimary">
        Signing in with Google...
      </Text>
    </View>
  );
}
