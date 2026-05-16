import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface LikeCardProps {
  name: string;
  type: string;
  breed: string;
  age: string;
  image: any;
  location: string;
  postDate: string;
  bg?: string;
  onPress?: () => void;
  onLikePress?: () => void;
  isLiked?: boolean;
}

const LikeCard: React.FC<LikeCardProps> = ({
  name,
  type,
  breed,
  age,
  image,
  location,
  postDate,
  bg,
  onPress,
  onLikePress,
  isLiked = true,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="mb-4"
    >
      <View className={`rounded-3xl p-4 ${bg || (isDark ? "bg-[#1a1a1a]" : "bg-gray-50")} flex-row items-center border ${isDark ? "border-[#2a2a2a]" : "border-gray-100"}`}>
        <View className="w-24 h-24 rounded-2xl overflow-hidden mr-4">
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className={`font-bold text-lg ${isDark ? "text-gray-100" : "text-[#090909]"}`}>
              {name}
            </Text>
            <TouchableOpacity onPress={onLikePress}>
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={22} 
                color="#E0583D" 
              />
            </TouchableOpacity>
          </View>

          <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-1`}>
            {type} • {breed}
          </Text>

          <View className="flex-row items-center mb-1">
            <Ionicons name="time-outline" size={14} color={isDark ? "#888" : "#666"} />
            <Text className={`text-xs ml-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              {age}
            </Text>
          </View>

          <View className="flex-row items-center mb-1">
            <Ionicons name="location-outline" size={14} color="#E0583D" />
            <Text className={`text-xs ml-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              {location}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              {postDate}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LikeCard;
