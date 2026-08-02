import { Stack, router, useRootNavigationState } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar } from "react-native";
import "../css/global.css";
import { useColorScheme } from "nativewind";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../query/queryClient";
import Toast from "react-native-toast-message";
import { toastConfig } from "../config/toastConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? "#000000" : "#ffffff");
  }, [isDark]);

  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const checkInitialRoute = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

        if (token) {
          router.replace("/(tab)");
        } else if (!hasOnboarded) {
          router.replace("/Onboarding");
        } else {
          router.replace("/(auth)");
        }
      } catch (error) {
        console.error("Routing error:", error);
        router.replace("/(auth)");
      }
    };

    checkInitialRoute();
  }, [navigationState?.key]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            {/* Make sure this SafeAreaView comes from react-native-safe-area-context */}
            <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
              <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={isDark ? "#000000" : "#ffffff"}
              />

              <View
                className={`${isDark ? "dark bg-black" : "bg-white"} flex-1`}
              >
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: isDark ? "#000000" : "#ffffff",
                    },
                  }}
                >
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tab)" />
                  <Stack.Screen name="google-auth" />
                  <Stack.Screen name="Onboarding" />
                  <Stack.Screen name="FinishProfile" />
                  <Stack.Screen name="AddPets" />
                  <Stack.Screen name="EditProfile" />
                  <Stack.Screen name="HelpSupport" />
                </Stack>
              </View>
              <Toast config={toastConfig} />
            </SafeAreaView>
          </SafeAreaProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
