import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import Tags from "@/components/Tags";
import { useDispatch } from "react-redux";
import { getUserDetailsAction } from "@/redux/actions/userActions";

const Profile = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const [userVerified, setUserVerified] = useState(false);

  const fetchUserDetails = async () => {
    const res = await dispatch(getUserDetailsAction());
    if (res?.data) {
      const user = res.data.user;
      setUserVerified(user.userVerified);
    }
  };

  console.log("User Verified Status:", userVerified);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    };
    loadUser();
  }, []);

  const getUserInitials = () => {
    if (!user) return "U";

    let text = "";
    if (user.name) {
      text = user.name.trim();
    } else if (user.email) {
      text = user.email.split("@")[0].trim();
    } else {
      return "U";
    }

    if (text.length === 0) return "U";

    const firstChar = text.charAt(0).toUpperCase();
    const firstChar2 = text.charAt(1).toUpperCase();

    return firstChar + firstChar2;
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("userInfo");
      await AsyncStorage.removeItem("verifyChangePassword");
      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
      });
      router.replace("/(auth)");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: "An error occurred while logging out",
      });
    }
  };

  const profileMenuItems = [
    {
      id: 1,
      title: "Edit Profile",
      icon: "person-outline",
      color: "#E0583D",
      onPress: () => {
        router.push("/EditProfile");
      },
    },
    {
      id: 2,
      title: "Add Pet Profile",
      icon: "paw-outline",
      color: "#E0583D",
      onPress: () => {
        router.push("/AddPets");
      },
    },
    {
      id: 3,
      title: "Settings",
      icon: "settings-outline",
      color: "#666",
      onPress: () => {
        Toast.show({
          type: "info",
          text1: "Coming Soon",
          text2: "Settings feature will be available soon",
        });
      },
    },
    {
      id: 4,
      title: "Help & Support",
      icon: "help-circle-outline",
      color: "#666",
      onPress: () => {
        router.push("/HelpSupport");
      },
    },
    {
      id: 5,
      title: "About",
      icon: "information-circle-outline",
      color: "#666",
      onPress: () => {
        Toast.show({
          type: "info",
          text1: "Petmania",
          text2: "Version 1.0.0 - Your pet adoption companion",
        });
      },
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex gap-4 pt-7 pl-6 pr-6">
          <View className="items-center mb-6">
            <View className="flex justify-center items-center w-24 h-24 rounded-full overflow-hidden bg-buttonPrimary mb-4">
              <Text className="text-white font-bold text-3xl">
                {getUserInitials()}
              </Text>
            </View>
            <Text className="text-2xl font-bold color-textPrimary mb-1">
              {user?.name || user?.email?.split("@")[0]?.split("+")[0]?.trim() || "User"}
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              {user?.email || "No email available"}
            </Text>
          </View>

          <View className="flex-row justify-between mb-6">
            <View className="flex-1 items-center bg-backgroundSecondary rounded-2xl p-4 mx-1">
              <Ionicons name="paw-outline" size={24} color="#E0583D" />
              <Text className="text-2xl font-bold color-textPrimary mt-2">2</Text>
              <Text className="text-xs text-gray-500 mt-1">Adopted</Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold color-textPrimary mb-4">
              Account
            </Text>
            {profileMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={item.onPress}
                activeOpacity={0.7}
                className="flex-row items-center bg-backgroundSecondary rounded-2xl p-4 mb-3"
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text className="flex-1 text-base font-medium color-textPrimary">
                  {item.title}
                </Text>
                {
                  item.id === 1 && (
                    <Tags text={userVerified === true ? "Verified" : "Not Verified"} variant={userVerified === true ? "success" : "warning"} icon={userVerified === true ? "" : "alert-circle-outline"} />
                  )
                }
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="flex-row items-center justify-center bg-backgroundSecondary rounded-2xl p-4 mb-6 border border-red-200"
          >
            <Ionicons name="log-out-outline" size={22} color="#E64545" />
            <Text className="ml-2 text-base font-semibold color-[#E64545]">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;