import React from 'react';
import { View, Text } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';

const InfoCard = ({ icon: Icon, title, description, index = 0 }) => {
    return (
        <View
            entering={FadeInDown.delay(index * 100).duration(500)}
            className="bg-backgroundSecondary border border-border rounded-3xl p-5 mb-4 shadow-sm"
        >
            <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-buttonPrimary/10 rounded-xl items-center justify-center mr-3">
                    {Icon && <Icon size={22} color="rgb(224, 88, 61)" />}
                </View>
                <Text className="text-lg font-bold text-textPrimary flex-1">{title}</Text>
            </View>
            <Text className="text-sm text-textSecondary leading-5">
                {description}
            </Text>
        </View>
    );
};

export default InfoCard;
