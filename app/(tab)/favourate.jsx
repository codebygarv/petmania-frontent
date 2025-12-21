import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { config } from "@/constants/config";
import { Ionicons } from "@expo/vector-icons";

const favourate = () => {

  const favouratePets = [
    {
      id: 1,
      name: "Rocky",
      type: "Cat",
      breed: "Persian",
      age: "2 years",
      image: config.cat1,
      location: "Chicago, USA",
      updatedUser: "Jack",
      postDate: "12 Jan",
      description: "Friendly and playful Persian cat looking for a loving home.",
      bg: "bg-cyan-100"
    },
    {
      id: 2,
      name: "Max",
      type: "Dog",
      breed: "Golden Retriever",
      age: "3 years",
      image: config.dog1,
      location: "New York, USA",
      updatedUser: "Sarah",
      postDate: "15 Jan",
      description: "Well-trained Golden Retriever, great with kids and families.",
      bg: "bg-indigo-100"
    },
    {
      id: 3,
      name: "Luna",
      type: "Cat",
      breed: "Siamese",
      age: "1 year",
      image: config.cat2,
      location: "Los Angeles, USA",
      updatedUser: "Mike",
      postDate: "18 Jan",
      description: "Beautiful Siamese cat with blue eyes, very affectionate.",
      bg: "bg-purple-100"
    },
    {
      id: 4,
      name: "Buddy",
      type: "Dog",
      breed: "Labrador",
      age: "4 years",
      image: config.dog2,
      location: "Miami, USA",
      updatedUser: "Emma",
      postDate: "20 Jan",
      description: "Energetic Labrador, perfect for active families.",
      bg: "bg-indigo-100"
    },
    {
      id: 5,
      name: "Whiskers",
      type: "Cat",
      breed: "Maine Coon",
      age: "2.5 years",
      image: config.cat3,
      location: "Seattle, USA",
      updatedUser: "David",
      postDate: "22 Jan",
      description: "Large and fluffy Maine Coon, very gentle and calm.",
      bg: "bg-green-100"
    },
    {
      id: 6,
      name: "Charlie",
      type: "Dog",
      breed: "Beagle",
      age: "1.5 years",
      image: config.dog3,
      location: "Boston, USA",
      updatedUser: "Lisa",
      postDate: "25 Jan",
      description: "Friendly Beagle puppy, loves to play and explore.",
      bg: "bg-pink-100"
    },
    {
      id: 7,
      name: "Mittens",
      type: "Cat",
      breed: "British Shorthair",
      age: "3 years",
      image: config.cat4,
      location: "Denver, USA",
      updatedUser: "Tom",
      postDate: "28 Jan",
      description: "Calm and independent British Shorthair, perfect companion.",
      bg: "bg-orange-100"
    },
    {
      id: 8,
      name: "Daisy",
      type: "Dog",
      breed: "French Bulldog",
      age: "2 years",
      image: config.dog4,
      location: "Austin, USA",
      updatedUser: "Jessica",
      postDate: "30 Jan",
      description: "Adorable French Bulldog, great apartment pet.",
      bg: "bg-yellow-100"
    },
    {
      id: 9,
      name: "Shadow",
      type: "Cat",
      breed: "Russian Blue",
      age: "1 year",
      image: config.cat5,
      location: "Portland, USA",
      updatedUser: "Chris",
      postDate: "2 Feb",
      description: "Elegant Russian Blue with silky gray coat.",
      bg: "bg-blue-100"
    },
    {
      id: 10,
      name: "Bella",
      type: "Dog",
      breed: "German Shepherd",
      age: "3 years",
      image: config.dog5,
      location: "Phoenix, USA",
      updatedUser: "Ryan",
      postDate: "5 Feb",
      description: "Loyal and protective German Shepherd, well-trained.",
      bg: "bg-teal-100"
    },
    {
      id: 11,
      name: "Oreo",
      type: "Cat",
      breed: "Tuxedo",
      age: "2 years",
      image: config.cat6,
      location: "Nashville, USA",
      updatedUser: "Amanda",
      postDate: "8 Feb",
      description: "Playful Tuxedo cat with black and white markings.",
      bg: "bg-pink-100"
    },
    {
      id: 12,
      name: "Cooper",
      type: "Dog",
      breed: "Border Collie",
      age: "2.5 years",
      image: config.dog6,
      location: "San Francisco, USA",
      updatedUser: "Kevin",
      postDate: "10 Feb",
      description: "Intelligent Border Collie, great for active owners.",
      bg: "bg-sky-100"
    },
    {
      id: 13,
      name: "Ginger",
      type: "Cat",
      breed: "Orange Tabby",
      age: "1.5 years",
      image: config.cat7,
      location: "Chicago, USA",
      updatedUser: "Jack",
      postDate: "12 Feb",
      description: "Sweet orange tabby cat, loves cuddles and attention.",
      bg: "bg-rose-100"
    },
    {
      id: 14,
      name: "Rex",
      type: "Dog",
      breed: "Rottweiler",
      age: "4 years",
      image: config.dog7,
      location: "Dallas, USA",
      updatedUser: "Michelle",
      postDate: "15 Feb",
      description: "Strong and loyal Rottweiler, needs experienced owner.",
    },
    {
      id: 15,
      name: "Snowball",
      type: "Cat",
      breed: "White Persian",
      age: "2 years",
      image: config.cat8,
      location: "Minneapolis, USA",
      updatedUser: "Robert",
      postDate: "18 Feb",
      description: "Beautiful white Persian with long fluffy coat.",
      bg: "bg-gray-100"
    },
    {
      id: 16,
      name: "Lucky",
      type: "Dog",
      breed: "Poodle",
      age: "3 years",
      image: config.dog8,
      location: "Atlanta, USA",
      updatedUser: "Nicole",
      postDate: "20 Feb",
      description: "Elegant Poodle, hypoallergenic and very smart.",
      bg: "bg-lime-100"
    },
    {
      id: 17,
      name: "Tiger",
      type: "Cat",
      breed: "Bengal",
      age: "1 year",
      image: config.cat9,
      location: "Detroit, USA",
      updatedUser: "Steven",
      postDate: "22 Feb",
      description: "Exotic Bengal cat with wild-looking markings.",
    },
    {
      id: 18,
      name: "Zeus",
      type: "Dog",
      breed: "Husky",
      age: "2 years",
      image: config.dog9,
      location: "Portland, USA",
      updatedUser: "Rachel",
      postDate: "25 Feb",
      description: "Energetic Husky with beautiful blue eyes.",
      bg: "bg-cyan-100"
    },
    {
      id: 19,
      name: "Princess",
      type: "Cat",
      breed: "Ragdoll",
      age: "2.5 years",
      image: config.cat10,
      location: "San Diego, USA",
      updatedUser: "Daniel",
      postDate: "28 Feb",
      description: "Gentle Ragdoll cat, loves to be held and cuddled.",
      bg: "bg-orange-100"
    },
    {
      id: 20,
      name: "Thor",
      type: "Dog",
      breed: "Great Dane",
      age: "3 years",
      image: config.dog10,
      location: "Las Vegas, USA",
      updatedUser: "Patricia",
      postDate: "1 Mar",
      description: "Gentle giant Great Dane, very friendly despite size.",
      bg: "bg-pink-100"
    }
  ]
  
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex gap-4 pt-7 pl-6 pr-6">
          <Text className="text-2xl font-bold color-textPrimary mb-2">
            Favorite Pets
          </Text>
          {
            favouratePets.map((pet , index) =>{
              return (
                <View key={pet.id} className="mb-4">
                  <View className={`rounded-3xl p-4 ${pet.bg || "bg-gray-100"} flex-row items-center`}>
                    <View className="w-24 h-24 rounded-2xl overflow-hidden  mr-4 ">
                      <Image
                        source={pet.image}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1 ">
                        <Text className="font-bold text-lg color-[#090909]">
                          {pet.name}
                        </Text>
                        <Ionicons name="heart" size={20} color="#E0583D" />
                      </View>
                      
                      <Text className="text-sm text-gray-600 mb-1">
                        {pet.type} • {pet.breed}
                      </Text>
                      
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text className="text-xs ml-1 text-gray-500">
                          {pet.age}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="location-outline" size={14} color="#E0583D" />
                        <Text className="text-xs ml-1 text-gray-500">
                          {pet.location}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-xs text-gray-400">
                          {pet.postDate}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  );
};

export default favourate;
