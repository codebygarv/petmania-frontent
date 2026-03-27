// HomeSkeleton.jsx
// Premium skeleton placeholder for pet cards on the Home (Index) screen.
// Supports light and dark themes via nativewind's useColorScheme.

import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';

const HomeSkeleton = ({ count = 8 }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bgCard = isDark ? 'bg-gray-800' : 'bg-gray-200';
  const bgPlaceholder = isDark ? 'bg-gray-700' : 'bg-gray-300';
  const textPlaceholder = isDark ? 'bg-gray-600' : 'bg-gray-300';

  return (
    <View className="flex flex-row flex-wrap justify-between gap-1 mb-10">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} className="w-[48%] mb-4 animate-pulse">
          {/* Card container */}
          <View className={`rounded-3xl p-2 ${bgCard}`}>
            {/* Heart icon placeholder */}
            <View className="absolute top-3 right-3 z-10">
              <View className="w-5 h-5 rounded-full" style={{ backgroundColor: isDark ? '#4B5563' : '#D1D5DB' }} />
            </View>

            {/* Image placeholder */}
            <View className={`w-full h-40 rounded-2xl ${bgPlaceholder} mb-2`} />

            {/* Text placeholders */}
            <View className="mt-2 text-center">
              <View className={`h-4 rounded w-3/4 mx-auto mb-2 ${textPlaceholder}`} />
              <View className="flex flex-row items-center justify-center">
                <View className={`w-4 h-4 rounded-full mr-1 ${textPlaceholder}`} />
                <View className={`h-3 rounded w-2/3 ${textPlaceholder}`} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default HomeSkeleton;
