import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Camera, User, BadgeCheck, ArrowRight, Plus } from "lucide-react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { updateUserProfileAction } from "@/redux/actions/userActions";
import Toast from "react-native-toast-message";
import { useColorScheme } from "nativewind";
import { COLORS, getColor } from "@/constants/color";
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  Layout, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from "react-native-reanimated";
import { Formik } from "formik";
import * as Yup from "yup";

const { width } = Dimensions.get("window");

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name is too short")
    .required("Full name is required"),
  bio: Yup.string().max(200, "Bio must be under 200 characters"),
});

const FinishProfile = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch();

  const [profileUri, setProfileUri] = useState(null);
  const [profileBase64, setProfileBase64] = useState(null);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pickImage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "Media library access is required",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled) return;
    
    const { uri, base64 } = result.assets[0];
    setProfileUri(uri);
    setProfileBase64(base64 || null);
    
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const handleComplete = async (values) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const payload = {
      name: values.name.trim(),
      UserManualAddress: values.bio.trim() || undefined,
      profileImage: profileBase64 ? `data:image/jpeg;base64,${profileBase64}` : profileUri || null,
    };

    try {
      const res = await dispatch(updateUserProfileAction(payload));
      
      if (res?.success) {
        Toast.show({
          type: "success",
          text1: "Profile Set Up!",
          text2: "Let's find some pets.",
        });
        router.replace("/(tab)");
      } else {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: res?.message || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: getColor("background", isDark) }}
    >
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-8 pt-20">
          {/* Progress Indicator */}
          <Animated.View 
            entering={FadeInUp.delay(200)}
            className="flex-row gap-2 mb-10 items-center"
          >
             <View className="h-1.5 w-12 rounded-full bg-buttonPrimary" />
             <View className="h-1.5 w-12 rounded-full bg-buttonPrimary opacity-30" />
             <View className="h-1.5 w-12 rounded-full bg-buttonPrimary opacity-30" />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)}>
            <Text 
              className="text-4xl font-extrabold color-textPrimary mb-3"
              style={{ letterSpacing: -0.5 }}
            >
              Finish your profile
            </Text>
            <Text className="text-lg color-textSecondary mb-10 leading-6">
              Help the community know you better by adding a few details.
            </Text>
          </Animated.View>

          <Formik
            initialValues={{ name: "", bio: "" }}
            validationSchema={validationSchema}
            onSubmit={handleComplete}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View>
                {/* Profile Picture */}
                <Animated.View 
                  entering={FadeInDown.delay(500)}
                  className="items-center mb-12"
                >
                  <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                    <Animated.View 
                      style={animatedStyle}
                      className="relative"
                    >
                      {profileUri ? (
                        <Image
                          source={{ uri: profileUri }}
                          className="w-36 h-36 rounded-full border-4 border-buttonPrimary"
                        />
                      ) : (
                        <View className="w-36 h-36 rounded-full bg-backgroundSecondary items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-700">
                          <User
                            size={48}
                            color={getColor("textSecondary", isDark)}
                            strokeWidth={1.5}
                          />
                        </View>
                      )}
                      <View 
                        className="absolute bottom-1 right-1 bg-buttonPrimary p-3 rounded-full border-4 border-background"
                        style={{ elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 }}
                      >
                        <Plus size={20} color="white" strokeWidth={3} />
                      </View>
                    </Animated.View>
                  </TouchableOpacity>
                  <Text className="mt-4 text-sm font-bold color-buttonPrimary uppercase tracking-widest">
                    Add Photo
                  </Text>
                </Animated.View>

                {/* Input Fields */}
                <View className="gap-6">
                  <Animated.View entering={FadeInDown.delay(600)}>
                    <Text className="text-xs font-black color-textSecondary uppercase mb-2 ml-1 tracking-widest">
                      Full Name
                    </Text>
                    <View 
                      className={`flex-row items-center bg-backgroundSecondary rounded-2xl px-4 border ${
                        touched.name && errors.name ? "border-red-500" : "border-transparent"
                      } dark:bg-[#1E1E1E]`}
                    >
                       <User size={20} color={getColor("textSecondary", isDark)} strokeWidth={2} />
                       <TextInput
                        placeholder="e.g. Alex Johnson"
                        placeholderTextColor={getColor("inputPlaceholder", isDark)}
                        value={values.name}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        className="flex-1 color-textPrimary py-4 ml-3 text-base font-medium"
                      />
                    </View>
                    {touched.name && errors.name && (
                      <Text className="text-red-500 text-xs mt-1 ml-1">{errors.name}</Text>
                    )}
                  </Animated.View>

                  <Animated.View entering={FadeInDown.delay(700)}>
                     <View className="flex-row justify-between mb-2 ml-1">
                        <Text className="text-xs font-black color-textSecondary uppercase tracking-widest">
                          Bio / Address
                        </Text>
                        <Text className="text-[10px] color-textSecondary font-bold">
                          {values.bio.length}/200
                        </Text>
                     </View>
                    <TextInput
                      placeholder="Share a bit about your love for pets..."
                      placeholderTextColor={getColor("inputPlaceholder", isDark)}
                      value={values.bio}
                      onChangeText={handleChange("bio")}
                      onBlur={handleBlur("bio")}
                      multiline
                      numberOfLines={4}
                      maxLength={200}
                      className="bg-backgroundSecondary color-textPrimary px-4 py-4 rounded-2xl text-base font-medium border border-transparent dark:bg-[#1E1E1E] h-32 text-top"
                      textAlignVertical="top"
                    />
                    {touched.bio && errors.bio && (
                      <Text className="text-red-500 text-xs mt-1 ml-1">{errors.bio}</Text>
                    )}
                  </Animated.View>
                </View>

                {/* Submit Button */}
                <Animated.View 
                  entering={FadeInDown.delay(900)}
                  className="mt-12"
                >
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: isSubmitting ? getColor("buttonDisabled", isDark) : getColor("buttonPrimary", isDark),                   
                    }}
                    className="py-5 rounded-3xl flex-row items-center justify-center"
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <Text className="text-white text-lg font-black mr-2">
                          Get Started
                        </Text>
                        <ArrowRight size={20} color="white" strokeWidth={3} />
                      </>
                    )}
                  </TouchableOpacity>
                  
                  <Animated.View 
                    entering={FadeInDown.delay(1000)}
                    className="flex-row items-center justify-center mt-6 gap-2 opacity-50"
                  >
                    <BadgeCheck size={16} color={getColor("textSecondary", isDark)} />
                    <Text className="text-xs color-textSecondary font-bold">
                      Verified Account
                    </Text>
                  </Animated.View>
                </Animated.View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FinishProfile;
