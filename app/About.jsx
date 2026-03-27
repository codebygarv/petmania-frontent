import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import React from 'react';
import BackButton from '@/components/BackButton';
import { config } from '@/constants/config';
import { router } from 'expo-router';

const ABout = () => {
    const goHome = () => {
        router.push('/(tab)/index');
    };

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20 }}>
            <BackButton />
            <View className="items-center mb-6">
                <Image source={config.loginSignupImageBg} className="w-32 h-32 rounded-full" resizeMode="contain" />
            </View>
            <Text className="text-3xl font-bold text-center text-primary mb-4">About Petmania</Text>
            <Text className="text-base text-secondary mb-4">
                Petmania is a modern pet adoption platform that connects loving families with animals in need.
                Our mission is to make pet adoption simple, transparent, and joyful for everyone.
            </Text>
            <Text className="text-base text-secondary mb-4">
                Developed by <Text className="font-semibold text-primary">codebygarv (Garv)</Text>.
                We strive to provide a seamless experience powered by Expo, NativeWind, and Redux.
            </Text>
            <Pressable onPress={goHome} className="mt-6 bg-buttonPrimary rounded-lg py-3 px-5 self-center">
                <Text className="text-white text-center font-medium">Explore Pets</Text>
            </Pressable>
            <View className="mt-8 border-t border-border pt-4">
                <Text className="text-sm text-center text-secondary">
                    © {new Date().getFullYear()} Petmania. All rights reserved.
                </Text>
            </View>
        </ScrollView>
    );
};

export default ABout;