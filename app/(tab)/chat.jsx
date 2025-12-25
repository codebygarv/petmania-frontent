import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    };
    loadUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const chatConversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      lastMessage: "Hi! Is Rocky still available?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: 2,
      name: "Mike Chen",
      lastMessage: "Thank you for the information!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: 3,
      name: "Emma Wilson",
      lastMessage: "Can we schedule a visit?",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: 4,
      name: "David Martinez",
      lastMessage: "The pet looks perfect for our family",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: 5,
      name: "Lisa Anderson",
      lastMessage: "I'm interested in adopting Max",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      unreadCount: 3,
      isOnline: true,
    },
    {
      id: 6,
      name: "Tom Brown",
      lastMessage: "What's the adoption process?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: 7,
      name: "Jessica Lee",
      lastMessage: "Thanks for your help!",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: 8,
      name: "Ryan Taylor",
      lastMessage: "Is the pet good with kids?",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      unreadCount: 1,
      isOnline: true,
    },
  ];

  const filteredConversations = chatConversations.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex gap-4 pt-7 pl-6 pr-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold color-textPrimary">Messages</Text>
          </View>

          <View className="flex-row items-center bg-backgroundSecondary rounded-2xl px-4 py-3 mb-2">
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
              placeholder="Search conversations..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-base color-textPrimary"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {filteredConversations.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="chatbubbles-outline" size={64} color="#999" />
              <Text className="text-lg font-semibold color-textPrimary mt-4">
                No conversations found
              </Text>
              <Text className="text-sm text-gray-500 mt-2">
                Try adjusting your search
              </Text>
            </View>
          ) : (
            <View className="flex gap-2">
              {filteredConversations.map((chat) => (
                <TouchableOpacity
                  key={chat.id}
                  activeOpacity={0.7}
                  className="flex-row items-center bg-backgroundSecondary rounded-2xl p-4"
                >
                  {/* Avatar */}
                  <View className="relative">
                    <View className="w-14 h-14 rounded-full bg-buttonPrimary items-center justify-center">
                      <Text className="text-white font-bold text-base">
                        {getInitials(chat.name)}
                      </Text>
                    </View>
                    {chat.isOnline && (
                      <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </View>

                  {/* Chat Info */}
                  <View className="flex-1 ml-4">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-base font-semibold color-textPrimary">
                        {chat.name}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {formatTime(chat.timestamp)}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text
                        className="flex-1 text-sm text-gray-600 mr-2"
                        numberOfLines={1}
                      >
                        {chat.lastMessage}
                      </Text>
                      {chat.unreadCount > 0 && (
                        <View className="w-5 h-5 rounded-full bg-buttonPrimary items-center justify-center">
                          <Text className="text-xs font-bold text-white">
                            {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Chat;