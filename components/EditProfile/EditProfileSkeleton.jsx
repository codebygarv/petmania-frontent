import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";

const Shimmer = ({ className }: { className?: string }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={`${className} ${isDark ? "bg-gray-800" : "bg-gray-200"} rounded-md`}
    />
  );
};

const SectionSkeleton = ({ isDark }: { isDark: boolean }) => (
  <View className={`p-4 mb-4 rounded-2xl border ${isDark ? "bg-[#1a1a1a] border-[#2a2a2a]" : "bg-[#fafafa] border-[#ededed]"}`}>
    <Shimmer className="w-32 h-5 mb-4" />
    <View className="mb-4">
      <Shimmer className="w-20 h-3 mb-2" />
      <Shimmer className="w-full h-12 rounded-xl" />
    </View>
    <View className="mb-4">
      <Shimmer className="w-24 h-3 mb-2" />
      <Shimmer className="w-full h-12 rounded-xl" />
    </View>
    <View>
      <Shimmer className="w-16 h-3 mb-2" />
      <Shimmer className="w-full h-12 rounded-xl" />
    </View>
  </View>
);

const EditProfileSkeleton = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ScrollView 
      className={`flex-1 ${isDark ? "bg-[#121212]" : "bg-white"}`} 
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 pt-6">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Shimmer className="w-8 h-8 rounded-full mr-3" />
          <Shimmer className="w-32 h-6" />
        </View>

        {/* Banner */}
        <Shimmer className="w-full h-14 rounded-xl mb-6" />

        {/* Profile Photo */}
        <View className="items-center mb-8">
          <Shimmer className="w-24 h-24 rounded-full" />
          <Shimmer className="w-24 h-3 mt-3" />
        </View>

        {/* Sections */}
        <SectionSkeleton isDark={isDark} />
        <SectionSkeleton isDark={isDark} />
        <SectionSkeleton isDark={isDark} />

        {/* Save Button */}
        <Shimmer className="w-full h-14 rounded-xl mt-4 mb-10" />
      </View>
    </ScrollView>
  );
};

export default EditProfileSkeleton;
