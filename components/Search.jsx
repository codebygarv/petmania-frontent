import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { config } from "@/constants/config";
import BackButton from "./BackButton";
import EmptyState from "./EmptyState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { searchPetsAction } from "@/redux/actions/petActions";
import { getColor } from "@/constants/color";
import { useColorScheme } from "nativewind";

const RECENT_SEARCHES_KEY = "recent_searches";

const Search = ({ onClose }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const accentColor = getColor("accent", isDark);

  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();

  // Load recent searches on mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (saved) {
          setRecentSearches(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load recent searches", e);
      }
    };
    loadRecentSearches();
  }, []);

  const handleSearch = useCallback(async (query) => {
    setLoading(true);
    const res = await dispatch(searchPetsAction(query));
    if (res?.pets) {
        setSearchResults(res.pets);
    }
    setLoading(false);
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        handleSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, handleSearch]);

  const saveToRecent = async (pet) => {
    const updated = [pet, ...recentSearches.filter(p => p._id !== pet._id)].slice(0, 5);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex gap-4 pt-7 pl-6 pr-6 border-b border-border pb-4">
        <View className="flex-row items-center">
          <BackButton onPress={onClose} />
          <Text className="text-2xl text-center font-bold color-textPrimary flex-1">
            Search
          </Text>
        </View>

        <View className="flex-row items-center bg-backgroundSecondary rounded-2xl px-4 py-3 shadow-sm border border-border">
          <Ionicons name="search-outline" size={20} color={getColor("inputPlaceholder", isDark)} />
          <TextInput
            placeholder="Search for pets..."
            placeholderTextColor={getColor("inputPlaceholder", isDark)}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base color-textPrimary"
            autoFocus
          />
          {loading ? (
            <ActivityIndicator size="small" color={accentColor} />
          ) : searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
               <Ionicons name="close-circle" size={20} color={getColor("inputPlaceholder", isDark)} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex gap-4 pt-4 pl-6 pr-6">
          {/* Recent Searches Section */}
          {searchQuery.length === 0 && recentSearches.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold color-textPrimary">
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={async () => {
                   setRecentSearches([]);
                   await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
                }}>
                  <Text className="text-sm font-semibold color-buttonPrimary">
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                {recentSearches.map((item) => (
                  <Pressable
                    key={item._id}
                    onPress={() => {
                      setSearchQuery(item.name);
                    }}
                    className="mr-4"
                  >
                    <View className="w-24 h-32 rounded-2xl bg-backgroundSecondary items-center justify-center p-3 border border-border">
                      <Image
                        source={item.images?.[0] ? { uri: item.images[0] } : config.dog1}
                        className="w-full h-20 rounded-xl"
                        resizeMode="cover"
                      />
                      <Text className="text-xs font-semibold color-textPrimary mt-2 text-center" numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Search Results */}
          {searchQuery.length > 0 && (
            <View>
              <Text className="text-lg font-bold color-textPrimary mb-4">
                {searchResults.length} Results for &quot;{searchQuery}&quot;
              </Text>
              
              {searchResults.length === 0 && !loading ? (
                <EmptyState
                  title="No Results Found"
                  description={`We couldn't find any pets matching "${searchQuery}". Try a different name or category.`}
                  icon="search-outline"
                  buttonText="Clear Search"
                  onButtonPress={() => setSearchQuery("")}
                />
              ) : (
                <View className="flex-row flex-wrap justify-between">
                  {searchResults.map((pet) => (
                    <Pressable
                      key={pet._id}
                      onPress={() => {
                        saveToRecent(pet);
                        router.push(`/PetDetails?id=${pet._id}`);
                      }}
                      className="w-[48%] mb-4"
                    >
                      <View className="bg-backgroundSecondary rounded-3xl p-2 border border-border">
                        <Image
                          source={pet.images?.[0] ? { uri: pet.images[0] } : config.dog1}
                          className="w-full h-40 rounded-2xl"
                          resizeMode="cover"
                        />
                        <View className="mt-2 px-1">
                          <Text className="font-bold text-base color-textPrimary" numberOfLines={1}>
                            {pet.name}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Ionicons name="location-outline" size={14} color={accentColor} />
                            <Text className="text-xs ml-1 color-textSecondary" numberOfLines={1}>
                              {pet.city || "Nearby"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Popular Categories Placeholder */}
          {searchQuery.length === 0 && recentSearches.length === 0 && (
             <EmptyState
                title="Find your soulmate"
                description="Search for your favorite pets by name, type or location."
                icon="search"
             />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Search;
