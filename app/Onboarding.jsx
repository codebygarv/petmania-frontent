import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";
import { Heart, Search, Users, ArrowRight } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInDown } from "react-native-reanimated";
import { config } from "@/constants/config";

const { width } = Dimensions.get("window");

const ONBOARDING_DATA = [
  {
    id: "1",
    title: "Welcome to Adoptrix",
    description: "Discover thousands of pets looking for a loving home. Your new best friend is just a tap away.",
    image: config.onBoardingFirstImage,
    icon: Heart,
  },
  {
    id: "2",
    title: "Find Your Perfect Match",
    description: "Use our smart search to find pets that fit perfectly with your lifestyle and family. We make it easy.",
    image: config.onBoardingSecondImage,
    icon: Search,
  },
  {
    id: "3",
    title: "Join the Community",
    description: "Connect with other pet lovers, share experiences, and make the world better for our furry friends.",
    image: config.onBoardingThirdImage,
    icon: Users,
  },
];

const Onboarding = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = async () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Finish onboarding
      await AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/(auth)");
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    router.replace("/(auth)");
  };

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex);
  };

  const RenderItem = ({ item, index }) => {
    const Icon = item.icon;
    return (
      <View style={{ width, flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Animated.View entering={FadeInDown.delay(200)} className="w-full aspect-square  rounded-[40px] overflow-hidden items-center justify-center p-8 mb-10 shadow-lg">
          <Image
            source={item.image}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300)} className="items-center w-full px-2">
          <View className="bg-backgroundSecondary border border-border absolute -top-12 p-4 rounded-full shadow-sm z-10" style={{ elevation: 5 }}>
            <Icon size={28} color={getColor("accent", isDark)} strokeWidth={2.5} />
          </View>
          <Text className="text-3xl font-extrabold color-textPrimary text-center mb-4 mt-8" style={{ letterSpacing: -0.5 }}>
            {item.title}
          </Text>
          <Text className="text-base color-textSecondary text-center leading-6 px-4">
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: getColor("background", isDark) }}>
      {/* Skip Button */}
      <View className="absolute top-16 right-6 z-50">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-sm font-bold color-textSecondary opacity-80">Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
      />

      {/* Footer */}
      <View className="px-8 pb-12 pt-6">
        {/* Pagination Indicators */}
        <View className="flex-row justify-center items-center mb-8 gap-2">
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={{
                height: 8,
                width: currentIndex === index ? 32 : 8,
                backgroundColor: currentIndex === index ? getColor("accent", isDark) : getColor("border", isDark),
                borderRadius: 4,
              }}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          className="py-5 rounded-3xl flex-row justify-center items-center"
          style={{
            backgroundColor: getColor("buttonPrimary", isDark),
          }}
        >
          <Text className="text-white text-lg font-black mr-2">
            {currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Continue"}
          </Text>
          <ArrowRight size={20} color={getColor("white", isDark)} strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding;
