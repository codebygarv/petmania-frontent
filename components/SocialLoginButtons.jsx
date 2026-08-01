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

  const processGoogleToken = async (accessToken) => {
    if (!accessToken || isProcessingGoogle.current) return;
    isProcessingGoogle.current = true;

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
      }
    } catch (err) {
      console.error("[Google Auth] Login dispatch error:", err);
      Toast.show({ type: "error", text1: "Google Login Error" });
    } finally {
      isProcessingGoogle.current = false;
    }
  };

  // Deep linking listener for custom scheme fallback (petmania://google-auth#...)
  React.useEffect(() => {
    const handleUrlEvent = (event) => {
      if (event?.url && event.url.includes("access_token")) {
        const hash = event.url.includes("#") ? event.url.split("#")[1] : event.url.split("?")[1];
        const urlParams = new URLSearchParams(hash || "");
        const accessToken = urlParams.get("access_token");
        if (accessToken) {
          processGoogleToken(accessToken);
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleUrlEvent);

    // Also check initial URL on cold start
    Linking.getInitialURL().then((url) => {
      if (url) handleUrlEvent({ url });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      // Dynamic return URL: exp://192.168.1.5:8081/--/google-auth in Expo Go, or petmania://google-auth in standalone
      const returnUrl = Linking.createURL("google-auth");
      console.log("[Google Auth] Dynamic Return URL:", returnUrl);

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${webClientId}` +
        `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent("openid profile email")}` +
        `&state=${encodeURIComponent(returnUrl)}`;

      console.log("[Google Auth] Opening auth session:", authUrl);
      const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);
      console.log("[Google Auth] Auth session result:", result);

      if (result.type === "success" && result.url) {
        const hash = result.url.includes("#") ? result.url.split("#")[1] : result.url.split("?")[1];
        const urlParams = new URLSearchParams(hash || "");
        const accessToken = urlParams.get("access_token");

        if (accessToken) {
          await processGoogleToken(accessToken);
        } else {
          Toast.show({ type: "error", text1: "Could not retrieve access token" });
        }
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
