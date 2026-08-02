import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import Tags from "@/components/Tags";
import { useSelector } from "react-redux";

const Profile = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const accentColor = getColor("accent", isDark);
  const graySoftColor = getColor("graySoft", isDark);
  const errorColor = getColor("error", isDark);

  const getUserInitials = () => {
    if (!userInfo) return "U";

    let text = "";
    if (userInfo.name) {
      text = userInfo.name.trim();
    } else if (userInfo.email) {
      text = userInfo.email.split("@")[0].trim();
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
    } catch (_error) {
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
      color: accentColor,
      onPress: () => {
        router.push("/EditProfile");
      },
    },
    {
      id: 2,
      title: "Add Pet Profile",
      icon: "paw-outline",
      color: accentColor,
      onPress: () => {
        router.push("/AddPets");
      },
    },
    {
      id: 2.5,
      title: "My Pets",
      icon: "paw",
      color: accentColor,
      onPress: () => {
        router.push("/myPets");
      },
    },
    {
      id: 3,
      title: "Settings",
      icon: "settings-outline",
      color: graySoftColor,
      onPress: () => {
        router.push("/Settings");
      },
    },
    {
      id: 4,
      title: "Help & Support",
      icon: "help-circle-outline",
      color: graySoftColor,
      onPress: () => {
        router.push("/HelpSupport");
      },
    },
    {
      id: 5,
      title: "About",
      icon: "information-circle-outline",
      color: graySoftColor,
      onPress: () => {
        router.push("/About");
      },
    },
    {
      id: 6,
      title: "Change Password",
      icon: "lock-closed-outline",
      color: graySoftColor,
      onPress: () => {
        router.push("/resetPassword");
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
            {userInfo?.profileImage ? (
              <Image
                source={{ uri: userInfo.profileImage }}
                className="w-24 h-24 rounded-full mb-4 border-2 border-buttonPrimary"
                resizeMode="cover"
              />
            ) : (
              <View className="flex justify-center items-center w-24 h-24 rounded-full overflow-hidden bg-buttonPrimary mb-4">
                <Text className="text-white font-bold text-3xl">
                  {getUserInitials()}
                </Text>
              </View>
            )}
            <Text className="text-2xl font-bold color-textPrimary mb-1">
              {userInfo?.name || userInfo?.email?.split("@")[0]?.split("+")[0]?.trim() || "User"}
            </Text>
            <View className="flex-row items-center justify-center gap-1.5 mb-4">
              <Text className="text-sm color-textSecondary">
                {userInfo?.email || "No email available"}
              </Text>
              {userInfo?.isVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={getColor("success", isDark)}
                />
              )}
            </View>
          </View>

          {/* <View className="flex-row justify-between mb-6">
            <View className="flex-1 items-center bg-backgroundSecondary rounded-2xl p-4 mx-1">
              <Ionicons name="paw-outline" size={24} color={accentColor} />
              <Text className="text-2xl font-bold color-textPrimary mt-2">2</Text>
              <Text className="text-xs color-textSecondary mt-1">Adopted</Text>
            </View>
          </View> */}

          <View className="mb-6">
            <Text className="text-lg font-semibold color-textPrimary mb-4">
              Account
            </Text>
            {profileMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={item.onPress}
                activeOpacity={0.7}
                className="flex-row items-center bg-backgroundSecondary border border-border rounded-2xl p-4 mb-3"
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
                    <Tags
                      text={
                        userInfo?.userVerified || userInfo?.isAdharVerified
                          ? "Verified"
                          : userInfo?.isVerified
                          ? "Email Verified"
                          : "Not Verified"
                      }
                      variant={
                        userInfo?.userVerified || userInfo?.isAdharVerified
                          ? "success"
                          : userInfo?.isVerified
                          ? "default"
                          : "warning"
                      }
                      icon={
                        userInfo?.userVerified || userInfo?.isAdharVerified
                          ? "checkmark-circle"
                          : userInfo?.isVerified
                          ? "mail-outline"
                          : "alert-circle-outline"
                      }
                    />
                  )
                }
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={graySoftColor}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="flex-row items-center justify-center bg-backgroundSecondary rounded-2xl p-4 mb-6 border border-border"
          >
            <Ionicons name="log-out-outline" size={22} color={errorColor} />
            <Text className={`ml-2 text-base font-semibold text-error`}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;