import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useDispatch } from "react-redux";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { googleLoginAction } from "@/redux/actions/userActions";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getColor } from "@/constants/color";

WebBrowser.maybeCompleteAuthSession();

const webClientId =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
  "531711523042-6lbuv5loo95mgqej29slctctlk3i8h3q.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI =
  "https://petmania-backend-delta.vercel.app/api/user/auth/google/callback";

const SocialLoginButtons = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch();

  const isProcessingGoogle = useRef(false);

  const handleAuthUrl = useCallback(
    async (url) => {
      if (!url || isProcessingGoogle.current) return;
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
          return;
        }

        if (token) {
          isProcessingGoogle.current = true;
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
          isProcessingGoogle.current = true;
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
          }
        }
      } catch (err) {
        console.error("[Google Auth Error]:", err);
        Toast.show({ type: "error", text1: "Google Login Error" });
      } finally {
        isProcessingGoogle.current = false;
      }
    },
    [dispatch]
  );

  // Deep linking listener for custom scheme fallback
  useEffect(() => {
    const handleUrlEvent = (event) => {
      if (event?.url) {
        handleAuthUrl(event.url);
      }
    };

    const subscription = Linking.addEventListener("url", handleUrlEvent);

    Linking.getInitialURL().then((url) => {
      if (url) handleUrlEvent({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [handleAuthUrl]);

  const handleGoogleLogin = async () => {
    try {
      const returnUrl = Linking.createURL("google-auth");
      console.log("[Google Auth] Dynamic Return URL:", returnUrl);

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${webClientId}` +
        `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent("openid profile email")}` +
        `&access_type=offline` +
        `&state=${encodeURIComponent(returnUrl)}`;

      console.log("[Google Auth] Opening auth session:", authUrl);
      const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);
      console.log("[Google Auth] Auth session result:", result);

      if (result.type === "success" && result.url) {
        await handleAuthUrl(result.url);
      }
    } catch (err) {
      console.error("[Google Auth] Exception:", err);
      Toast.show({ type: "error", text1: "Google Login Error" });
    }
  };

  const googleIconColor = getColor("textPrimary", isDark);

  return (
    <View className="flex w-full">
      {/* Google Login Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg rounded-xl py-3.5 px-4 items-center justify-center w-full border border-border flex-row gap-2"
        onPress={handleGoogleLogin}
      >
        <Ionicons name="logo-google" size={20} color={googleIconColor} />
        <Text className="color-textPrimary text-sm font-semibold">
          Continue with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;
