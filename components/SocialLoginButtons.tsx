import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useDispatch } from "react-redux";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { googleLoginAction } from "@/redux/actions/userActions";
import * as AuthSession from "expo-auth-session";

console.log(
  AuthSession.makeRedirectUri()
);

WebBrowser.maybeCompleteAuthSession();

const SocialLoginButtons = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const dispatch = useDispatch<any>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "425077338248-3c06vuh15ppqblnb3gm32aru289v89eb.apps.googleusercontent.com",
    androidClientId: "425077338248-vr98dtse62fa9mdjlo3r7042058hf7l9.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        // You can fetch user info here if needed
        dispatch(googleLoginAction(authentication.accessToken));
      }
    }
  }, [response]);

  const googleIconColor = isDark ? "#EDEDED" : "#1C1C1C";
  const appleIconColor = isDark ? "#EDEDED" : "#1C1C1C";

  const handleGoogleLogin = async () => {

  }

  return (
    <View className="flex w-full flex-wrap gap-3 flex-row justify-between">

      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg dark:bg-SocialBgDark rounded-xl py-4 px-4 items-center justify-center w-[48%]"
        onPress={() => promptAsync()}
      >
        <View className="flex flex-row items-center gap-2" >
          <Ionicons name="logo-google" size={22} color={googleIconColor} />
          <Text className="text-textPrimary dark:text-textPrimaryDark text-base font-semibold">
            Google
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-SocialBg dark:bg-SocialBgDark rounded-xl py-4 px-4 items-center justify-center w-[48%]"
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
