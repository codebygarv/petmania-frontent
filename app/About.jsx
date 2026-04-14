import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
    Heart,
    ShieldCheck,
    Users,
    Smartphone,
    ArrowLeft
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { config } from '@/constants/config';
import SectionHeader from '@/components/SectionHeader';
import InfoCard from '@/components/InfoCard';
import BackButton from '@/components/BackButton';

const { width } = Dimensions.get('window');

const About = () => {
    const handleBack = () => {
        router.back();
    };

    const features = [
        {
            title: "Pet Adoption",
            description: "Connecting pet seekers with animals in need through a seamless and transparent platform.",
            icon: Heart
        },
        {
            title: "Community Hub",
            description: "Building a supportive environment for pet lovers to share experiences and find resources.",
            icon: Users
        },
        {
            title: "Secure Operations",
            description: "Advanced authentication and secure data handling to ensure a safe experience for all users.",
            icon: ShieldCheck
        },
        {
            title: "Modern Interface",
            description: "A premium mobile-first design built for performance and ease of use on any device.",
            icon: Smartphone
        }
    ];

    return (
        <View className="flex-1 bg-background">
            {/* Custom Header Overlay */}
            <SafeAreaView className="absolute top-0 left-0 right-0 z-50">
                <View className="px-4 py-2">
                    <BackButton />
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Hero Section */}
                <View className="h-80 relative">
                    <View className="flex-1 items-center justify-center p-6 mt-10">
                        <View
                            entering={FadeInUp.duration(600)}
                            className="p-3 rounded-full shadow-2xl mb-4"
                        >
                            <Image
                                source={config.onBoardingThirdImage}
                                className="w-24 h-24 rounded-full"
                                resizeMode="contain"
                            />
                        </View>
                        <Text
                            entering={FadeInDown.delay(200).duration(600)}
                            className="text-white text-4xl font-bold tracking-tight"
                        >
                            Adoptrix
                        </Text>
                        <Text
                            entering={FadeInDown.delay(300).duration(600)}
                            className="text-white/80 text-lg font-medium text-center mt-2 px-6"
                        >
                            Connecting Hearts, Saving Lives.
                        </Text>
                    </View>
                </View>

                {/* Content Sections */}
                <View className="px-5 mt-8">
                    {/* Mission Header */}
                    <View entering={FadeInDown.delay(400).duration(600)}>
                        <SectionHeader
                            title="Our Mission"
                            subtitle="Making pet adoption joyful and accessible for everyone."
                        />
                        <View className="bg-backgroundSecondary border border-border p-5 rounded-3xl mb-8">
                            <Text className="text-textPrimary text-base leading-7">
                                Adoptirx is a complete pet adoption and community platform designed to bridge the gap between pet seekers and animals in need. We believe every animal deserves a loving home, and every home is better with a pet.
                            </Text>
                        </View>
                    </View>

                    {/* Features Grid */}
                    <SectionHeader title="Key Features" />
                    <View className="flex-row flex-wrap justify-between">
                        {features.map((item, index) => (
                            <View key={index} style={{ width: width / 2 - 28 }}>
                                <InfoCard
                                    icon={item.icon}
                                    title={item.title}
                                    description={item.description}
                                    index={index + 2} // Delay offset
                                />
                            </View>
                        ))}
                    </View>

                    {/* Mission Statement Callout */}
                    <View
                        entering={FadeInDown.delay(1200).duration(600)}
                        className="bg-accent/5 p-8 rounded-3xl border border-accent/20 mt-8 items-center"
                    >
                        <Heart size={40} color="rgb(224, 88, 61)" fill="rgba(224, 88, 61, 0.2)" />
                        <Text className="text-textPrimary text-xl font-bold text-center mt-4">
                            Together, we can make a difference.
                        </Text>
                        <Text className="text-textSecondary text-center mt-2 leading-6">
                            Helping one animal won't change the world, but it will certainly change the world for that one animal.
                        </Text>
                    </View>

                    {/* Developer Info */}
                    <View className="mt-12 py-8 border-t border-border items-center">
                        <Text className="text-textSecondary text-sm">Created with passion by</Text>
                        <Text className="text-textPrimary text-lg font-bold mt-1">codebygarv (Garv)</Text>
                        <Text className="text-textSecondary text-xs mt-4">
                            © {new Date().getFullYear()} Adoptirx. v1.0.0
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default About;