import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useDispatch } from "react-redux";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { googleLoginAction, facebookLoginAction } from "@/redux/actions/userActions";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "531711523042-6lbuv5loo95mgqej29slctctlk3i8h3q.apps.googleusercontent.com";
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "425077338248-vr98dtse62fa9mdjlo3r7042058hf7l9.apps.googleusercontent.com";
const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || "123456789012345";

const SocialLoginButtons = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch();

  // Google Auth Request
  const googleRedirectUri = AuthSession.makeRedirectUri();
  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    webClientId,
    androidClientId,
    expoClientId: webClientId,
    redirectUri: googleRedirectUri,
  });

  // Facebook Auth Request via AuthSession
  const facebookRedirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const [fbRequest, fbResponse, promptFacebookAsync] = AuthSession.useAuthRequest(
    {
      clientId: facebookAppId,
      responseType: AuthSession.ResponseType.Token,
      scopes: ["public_profile", "email"],
      redirectUri: facebookRedirectUri,
    },
    {
      authorizationEndpoint: "https://www.facebook.com/v18.0/dialog/oauth",
    }
  );

  // Handle Google OAuth Response
  useEffect(() => {
    if (googleResponse?.type === "success") {
      const accessToken = googleResponse.authentication?.accessToken;
      if (accessToken) {
        dispatch(googleLoginAction(accessToken)).then(async (res) => {
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
        });
      }
    }
  }, [googleResponse]);

  // Handle Facebook OAuth Response
  useEffect(() => {
    if (fbResponse?.type === "success") {
      const accessToken = fbResponse.params?.access_token;
      if (accessToken) {
        dispatch(facebookLoginAction(accessToken)).then(async (res) => {
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
        });
      }
    }
  }, [fbResponse]);

  const googleIconColor = isDark ? "#EDEDED" : "#1C1C1C";
  const facebookIconColor = "#1877F2";

  return (
    <View className="flex w-full flex-wrap gap-3 flex-row justify-between">
      {/* Google Login Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg rounded-xl py-4 px-4 items-center justify-center w-[48%]"
        onPress={() => promptGoogleAsync()}
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
        onPress={() => promptFacebookAsync()}
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
