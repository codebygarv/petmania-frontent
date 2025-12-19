import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: isDark ? "#0B0B0B" : "#FFFFFF",
          borderTopWidth: 0,
          height: 20,
        },

        tabBarButton: (props) => (
          <TouchableOpacity activeOpacity={0.9} {...props} />
        ),

        tabBarActiveTintColor: isDark
          ? "#E0583D" // bg-buttonPrimary
          : "#E0583D",

        tabBarInactiveTintColor: isDark ? "#ffffff" : "#6B7280",

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "index") {
            iconName = "home";
          } else if (route.name === "profile") {
            iconName = "person";
          } else if (route.name === "favourate") {
            iconName = "heart";
          } else if(route.name === "chat") {
            iconName = 'chatbubbles-outline'
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
          title: "favourate",
        }}
      /> 
      <Tabs.Screen
        name="chat"
        options={{
          title: "chat",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
        }}
      />
    </Tabs>
  );
}
