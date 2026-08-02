import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useDispatch } from "react-redux";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { googleLoginAction, facebookLoginAction } from "@/redux/actions/userActions";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "531711523042-6lbuv5loo95mgqej29slctctlk3i8h3q.apps.googleusercontent.com";
const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || "123456789012345";
const GOOGLE_REDIRECT_URI = "https://petmania-backend-delta.vercel.app/api/user/auth/google/callback";

const SocialLoginButtons = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch();

  const isProcessingGoogle = React.useRef(false);

  const handleAuthUrl = async (url) => {
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
  };

  // Deep linking listener for custom scheme fallback
  React.useEffect(() => {
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
  }, []);

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

  const handleFacebookLogin = async () => {
    try {
      const redirectUri = "http://localhost:8081";

      const authUrl =
        `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${facebookAppId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent("public_profile,email")}`;

      console.log("[Facebook Auth] Redirect URI:", redirectUri);
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === "success" && result.url) {
        const hash = result.url.includes("#") ? result.url.split("#")[1] : result.url.split("?")[1];
        const urlParams = new URLSearchParams(hash || "");
        const accessToken = urlParams.get("access_token");

        if (accessToken) {
          const res = await dispatch(facebookLoginAction(accessToken));
          if (res?.success) {
            await AsyncStorage.setItem("userInfo", JSON.stringify(res.data.user));
            await AsyncStorage.setItem("token", res.data.token);
            Toast.show({
              type: "success",
              text1: res.message || "Facebook Login Successful",
            });
            router.replace("/(tab)");
          } else {
            Toast.show({
              type: "error",
              text1: res?.error?.message || "Facebook Login Failed",
            });
          }
        }
      }
    } catch (err) {
      console.error("Facebook auth error:", err);
      Toast.show({ type: "error", text1: "Facebook Login Error" });
    }
  };

  const googleIconColor = isDark ? "#EDEDED" : "#1C1C1C";
  const facebookIconColor = "#1877F2";

  return (
    <View className="flex w-full flex-wrap gap-3 flex-row justify-between">
      {/* Google Login Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg rounded-xl py-4 px-4 items-center justify-center w-[48%]"
        onPress={handleGoogleLogin}
      >
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="logo-google" size={22} color={googleIconColor} />
          <Text className="text-textPrimary dark:text-textPrimaryDark text-base font-semibold">
            Google
          </Text>
        </View>
      </TouchableOpacity>

      {/* Facebook Login Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg rounded-xl py-4 px-4 items-center justify-center w-[48%]"
        onPress={handleFacebookLogin}
      >
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="logo-facebook" size={22} color={facebookIconColor} />
          <Text className="text-textPrimary dark:text-textPrimaryDark text-base font-semibold">
            Facebook
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;
