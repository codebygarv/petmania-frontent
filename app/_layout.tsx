import { Stack } from "expo-router";
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

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? "#000000" : "#ffffff");
  }, [isDark]);

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
