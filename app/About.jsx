import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Smartphone, 
  Code2, 
  Database, 
  Cloud, 
  Layers,
  ArrowLeft
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { config } from '@/constants/config';
import SectionHeader from '@/components/SectionHeader';
import InfoCard from '@/components/InfoCard';

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

    const techStack = [
        {
            title: "Frontend Excellence",
            description: "Built with React Native & Expo for cross-platform efficiency, styled with NativeWind.",
            icon: Code2
        },
        {
            title: "Robust Backend",
            description: "Powered by Node.js and Express with MongoDB for scalable and secure data management.",
            icon: Database
        },
        {
            title: "Cloud Services",
            description: "Utilizing Cloudinary for media and Nodemailer for reliable communication.",
            icon: Cloud
        },
        {
            title: "State Management",
            description: "Leveraging Redux Toolkit and React Query for smooth and predictable performance.",
            icon: Layers
        }
    ];

    return (
        <View className="flex-1 bg-background">
            {/* Custom Header Overlay */}
            <SafeAreaView className="absolute top-0 left-0 right-0 z-50">
                <View className="px-4 py-2">
                    <TouchableOpacity 
                        onPress={handleBack}
                        className="w-10 h-10 rounded-full bg-white/20 items-center justify-center blur-sm"
                    >
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Hero Section */}
                <View className="h-80 relative">
                    <LinearGradient
                        colors={['rgb(224, 88, 61)', 'rgb(249, 115, 22)']}
                        className="absolute inset-0 rounded-b-[40px]"
                    />
                    <View className="flex-1 items-center justify-center p-6 mt-10">
                        <Animated.View 
                            entering={FadeInUp.duration(600)}
                            className="bg-white p-3 rounded-full shadow-2xl mb-4"
                        >
                            <Image 
                                source={config.loginSignupImageBg} 
                                className="w-24 h-24 rounded-full" 
                                resizeMode="contain" 
                            />
                        </Animated.View>
                        <Animated.Text 
                            entering={FadeInDown.delay(200).duration(600)}
                            className="text-white text-4xl font-bold tracking-tight"
                        >
                            Petmania
                        </Animated.Text>
                        <Animated.Text 
                            entering={FadeInDown.delay(300).duration(600)}
                            className="text-white/80 text-lg font-medium text-center mt-2 px-6"
                        >
                            Connecting Hearts, Saving Lives.
                        </Animated.Text>
                    </View>
                </View>

                {/* Content Sections */}
                <View className="px-5 mt-8">
                    {/* Mission Header */}
                    <Animated.View entering={FadeInDown.delay(400).duration(600)}>
                        <SectionHeader 
                            title="Our Mission" 
                            subtitle="Making pet adoption joyful and accessible for everyone." 
                        />
                        <View className="bg-backgroundSecondary border border-border p-5 rounded-3xl mb-8">
                            <Text className="text-textPrimary text-base leading-7">
                                Petmania is a complete pet adoption and community platform designed to bridge the gap between pet seekers and animals in need. We believe every animal deserves a loving home, and every home is better with a pet.
                            </Text>
                        </View>
                    </Animated.View>

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

                    {/* Tech Stack Banner */}
                    <View className="my-6 bg-buttonPrimary p-8 rounded-[40px] items-center justify-center">
                        <Text className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2">Developed With</Text>
                        <Text className="text-white text-3xl font-bold text-center">Modern Technology</Text>
                        <View className="flex-row mt-6 flex-wrap justify-center">
                            {['React Native', 'Expo', 'Node.js', 'Redux', 'MongoDB'].map((tech, i) => (
                                <View key={i} className="bg-white/20 rounded-full px-4 py-2 m-1 border border-white/30">
                                    <Text className="text-white text-xs font-semibold">{tech}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Tech Stack Details */}
                    <SectionHeader title="Technology Stack" />
                    {techStack.map((item, index) => (
                        <InfoCard 
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            index={index + 8}
                        />
                    ))}

                    {/* Mission Statement Callout */}
                    <Animated.View 
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
                    </Animated.View>

                    {/* Developer Info */}
                    <View className="mt-12 py-8 border-t border-border items-center">
                        <Text className="text-textSecondary text-sm">Created with passion by</Text>
                        <Text className="text-textPrimary text-lg font-bold mt-1">codebygarv (Garv)</Text>
                        <Text className="text-textSecondary text-xs mt-4">
                            © {new Date().getFullYear()} Petmania. v1.0.0
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default About;