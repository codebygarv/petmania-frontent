import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useDispatch } from "react-redux";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { googleLoginAction } from "@/redux/actions/userActions";
import * as AuthSession from "expo-auth-session";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

console.log(AuthSession.makeRedirectUri());

WebBrowser.maybeCompleteAuthSession();
const webClientId = "531711523042-6lbuv5loo95mgqej29slctctlk3i8h3q.apps.googleusercontent.com";
const androidClientId = "425077338248-vr98dtse62fa9mdjlo3r7042058hf7l9.apps.googleusercontent.com";


const SocialLoginButtons = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const dispatch = useDispatch();

  const config = {
    webClientId,
    androidClientId,
    expoClientId: webClientId,
  }

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const GoogleLogin = async () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const token = authentication?.accessToken;
      console.log("Google Access Token:", token);
      if (authentication?.accessToken) {
        // You can fetch user info here if needed
        const res = await dispatch(googleLoginAction(authentication.accessToken));
        console.log("Google Login Response:", res);
        if (res.success === true) {
          AsyncStorage.setItem("userInfo", JSON.stringify(res.data.user));
          AsyncStorage.setItem("token", res.data.token);
          Toast.show({
            type: "success",
            text1: res.message,
          });
          router.replace("/(tab)");
        } else {
          Toast.show({
            type: "error",
            text1: res?.error?.message || res.message || "Google Login Failed",
          });
        }
      }
    }
  };

  useEffect(() => {
    GoogleLogin();
  }, [response]);

  useEffect(() => {
    console.log("Google Auth Response:", response);
  }, [response]);

  const googleIconColor = isDark ? "#EDEDED" : "#1C1C1C";
  const appleIconColor = isDark ? "#EDEDED" : "#1C1C1C";

  const handleGoogleLogin = async () => { };

  return (
    <View className="flex w-full flex-wrap gap-3 flex-row justify-between">
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg rounded-xl py-4 px-4 items-center justify-center w-[48%]"
        onPress={() => promptAsync()}
      >
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="logo-google" size={22} color={googleIconColor} />
          <Text className="text-textPrimary dark:text-textPrimaryDark text-base font-semibold">
            Google
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg rounded-xl py-4 px-4 items-center justify-center w-[48%]"
      >
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="logo-apple" size={22} color={appleIconColor} />
          <Text className="text-textPrimary dark:text-textPrimaryDark text-base font-semibold">
            Apple
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;
