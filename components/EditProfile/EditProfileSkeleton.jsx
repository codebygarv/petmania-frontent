import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

const Shimmer = ({ className = "" }) => {
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
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={`${className} bg-skeletonItem rounded-md`}
    />
  );
};

const SectionSkeleton = () => (
  <View className="p-4 mb-4 rounded-2xl border bg-backgroundSecondary border-border">
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
  return (
    <ScrollView 
      className="flex-1 bg-background" 
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
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />

        {/* Save Button */}
        <Shimmer className="w-full h-14 rounded-xl mt-4 mb-10" />
      </View>
    </ScrollView>
  );
};

export default EditProfileSkeleton;
