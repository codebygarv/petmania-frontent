import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getColor } from "@/constants/color";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: getColor("tabBg", isDark),
          borderTopWidth: 0,
          paddingTop: 8,
          height: 60,
        },

        tabBarButton: ({ children, onPress, accessibilityState, accessibilityLabel, testID, style }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            accessibilityState={accessibilityState}
            accessibilityLabel={accessibilityLabel}
            testID={testID}
            style={style}
          >
            {children}
          </TouchableOpacity>
        ),

        tabBarActiveTintColor: getColor("tabActive", isDark),

        tabBarInactiveTintColor: getColor("tabInactive", isDark),

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "index") {
            iconName = "home";
          } else if (route.name === "profile") {
            iconName = "person";
          } else if (route.name === "favourate") {
            iconName = "heart";
          } else if (route.name === "myPets") {
            iconName = "paw";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="favourate"
        options={{
          title: "Favorites",
        }}
      />
      <Tabs.Screen
        name="myPets"
        options={{
          title: "My Pets",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      
    </Tabs>
  );
}
