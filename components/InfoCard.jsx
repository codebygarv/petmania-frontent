import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import { getColor } from '@/constants/color';

const InfoCard = ({ icon: Icon, title, description, index = 0 }) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const accentColor = getColor('accent', isDark);

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).duration(500)}
            className="bg-backgroundSecondary border border-border rounded-3xl p-5 mb-4 shadow-sm"
        >
            <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-buttonPrimary/10 rounded-xl items-center justify-center mr-3">
                    {Icon && <Icon size={22} color={accentColor} />}
                </View>
                <Text className="text-lg font-bold color-textPrimary flex-1">{title}</Text>
            </View>
            <Text className="text-sm color-textSecondary leading-5">
                {description}
            </Text>
        </Animated.View>
    );
};

export default InfoCard;
