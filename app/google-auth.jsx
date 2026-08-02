import React, { useEffect, useRef } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useColorScheme } from "nativewind";
import { useDispatch } from "react-redux";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { googleLoginAction } from "@/redux/actions/userActions";

export default function GoogleAuthCallback() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch();
  const isProcessing = useRef(false);

  const processToken = async (accessToken) => {
    if (!accessToken || isProcessing.current) return;
    isProcessing.current = true;

    try {
      const res = await dispatch(googleLoginAction(accessToken));
      if (res?.success) {
        await AsyncStorage.setItem("userInfo", JSON.stringify(res.data.user));
        await AsyncStorage.setItem("token", res.data.token);
        Toast.show({
          type: "success",
          text1: res.message || "Google Login Successful",
        });
        router.replace("/(tab)");
      } else {
        Toast.show({
          type: "error",
          text1: res?.error?.message || "Google Login Failed",
        });
        router.replace("/(auth)");
      }
    } catch (err) {
      console.error("[Google Auth Callback] Error:", err);
      Toast.show({ type: "error", text1: "Google Login Error" });
      router.replace("/(auth)");
    } finally {
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    const handleUrl = async (url) => {
      if (!url) return;
      if (url.includes("access_token")) {
        const hash = url.includes("#") ? url.split("#")[1] : url.split("?")[1];
        const urlParams = new URLSearchParams(hash || "");
        const accessToken = urlParams.get("access_token");
        if (accessToken) {
          await processToken(accessToken);
          return;
        }
      }

      // If token already saved, go to tab; otherwise auth
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        router.replace("/(tab)");
      } else {
        setTimeout(() => router.replace("/(auth)"), 1500);
      }
    };

    Linking.getInitialURL().then(handleUrl);

    const subscription = Linking.addEventListener("url", (event) => {
      if (event?.url) handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDark ? "#000000" : "#ffffff",
      }}
    >
      <ActivityIndicator size="large" color="#f97316" />
      <Text
        style={{
          marginTop: 16,
          fontSize: 16,
          fontWeight: "600",
          color: isDark ? "#EDEDED" : "#1C1C1C",
        }}
      >
        Signing in with Google...
      </Text>
    </View>
  );
}
