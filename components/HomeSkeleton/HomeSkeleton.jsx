import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';

const HomeSkeleton = ({ count = 8 }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex flex-row flex-wrap justify-between gap-1 mb-10">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} className="w-[48%] mb-4 animate-pulse">
          {/* Card container */}
          <View className={`rounded-3xl p-2 bg-skeletonBg`}>
            {/* Heart icon placeholder */}
            <View className="absolute top-3 right-3 z-10">
              <View className={`w-5 h-5 rounded-full bg-skeletonItem`} />
            </View>

            {/* Image placeholder */}
            <View className={`w-full h-40 rounded-2xl mb-2 bg-skeletonItem`} />

            {/* Text placeholders */}
            <View className="mt-2 text-center">
              <View className={`h-4 rounded w-3/4 mx-auto mb-2 bg-skeletonItem`} />
              <View className="flex flex-row items-center justify-center">
                <View className={`w-4 h-4 rounded-full mr-1 bg-skeletonItem`} />
                <View className={`h-3 rounded w-2/3 bg-skeletonItem`} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default HomeSkeleton;
