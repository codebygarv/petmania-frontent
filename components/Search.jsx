import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image } from "react-native";
import { config } from "@/constants/config";
import BackButton from "./BackButton";

const Search = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchHistory = [
    {
      id: 1,
      name: "Samantha",
      type: "Dog",
      image: config.dog1,
      bg: "bg-pink-100",
    },
    {
      id: 2,
      name: "Rocky",
      type: "Dog",
      image: config.dog2,
      bg: "bg-blue-100",
    },
    {
      id: 3,
      name: "Goldie",
      type: "Fish",
      image: config.cat1,
      bg: "bg-gray-100",
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex gap-4 pt-7 pl-6 pr-6">
          <View className="flex-row items-center mb-4">
            <BackButton onPress={onClose} />
            <Text className="text-2xl text-center font-bold color-textPrimary flex-1">
              Search
            </Text>
          </View>

          <View className="flex-row items-center bg-backgroundSecondary rounded-2xl px-4 py-3 mb-6 shadow-sm border border-backgroundSecondary">
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-base color-textPrimary"
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                // yet to implement
              }}
              className="ml-2"
            >
              <Ionicons name="options-outline" size={20} color="#E0583D" />
            </TouchableOpacity>
          </View>

          {/* Search History Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold color-textPrimary">
                Search History
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // TODO: Navigate to full search history
                }}
              >
                <Text className="text-sm font-semibold color-[#E0583D]">
                  See More
                </Text>
              </TouchableOpacity>
            </View>

            {/* Horizontal Scrollable Cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {searchHistory.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    // TODO: Navigate to pet detail or filter by this pet
                  }}
                  className="mr-4"
                >
                  <View
                    className={`w-24 h-32 rounded-2xl ${item.bg} items-center justify-center p-3`}
                  >
                    <Image
                      source={item.image}
                      className="w-full h-20"
                      resizeMode="contain"
                    />
                    <Text className="text-xs font-semibold color-textPrimary mt-2 text-center">
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Search Results Section (when searching) */}
          {searchQuery.length > 0 && (
            <View className="mt-4">
              <Text className="text-lg font-bold color-textPrimary mb-4">
                Search Results
              </Text>
              <View className="items-center justify-center py-20">
                <Ionicons name="search-outline" size={64} color="#999" />
                <Text className="text-base font-semibold color-textPrimary mt-4">
                  No results found
                </Text>
                <Text className="text-sm text-gray-500 mt-2">
                  Try a different search term
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Search;
