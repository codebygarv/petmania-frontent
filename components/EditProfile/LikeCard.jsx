import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColor } from "@/constants/color";

const LikeCard = ({
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
  const accentColor = getColor("accent", isDark);
  const timeColor = getColor("graySoft", isDark);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="mb-4"
    >
      <View className={`rounded-3xl p-4 ${bg || "bg-backgroundSecondary"} flex-row items-center border border-border`}>
        <View className="w-24 h-24 rounded-2xl overflow-hidden mr-4">
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="font-bold text-lg color-textPrimary">
              {name}
            </Text>
            <TouchableOpacity onPress={onLikePress}>
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={22} 
                color={accentColor} 
              />
            </TouchableOpacity>
          </View>

          <Text className="text-sm color-textSecondary mb-1">
            {type} • {breed}
          </Text>

          <View className="flex-row items-center mb-1">
            <Ionicons name="time-outline" size={14} color={timeColor} />
            <Text className="text-xs ml-1 color-textSecondary">
              {age}
            </Text>
          </View>

          <View className="flex-row items-center mb-1">
            <Ionicons name="location-outline" size={14} color={accentColor} />
            <Text className="text-xs ml-1 color-textSecondary">
              {location}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-xs color-textSecondary opacity-70">
              {postDate}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LikeCard;
