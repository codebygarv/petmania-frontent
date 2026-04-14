import React from 'react';
import { View, Text } from 'react-native';

const SectionHeader = ({ title, subtitle }) => {
    return (
        <View className="mb-6 px-4">
            <Text className="text-2xl font-bold text-textPrimary mb-1">{title}</Text>
            {subtitle && (
                <Text className="text-sm text-textSecondary">{subtitle}</Text>
            )}
            <View className="w-12 h-1 bg-buttonPrimary rounded-full mt-2" />
        </View>
    );
};

export default SectionHeader;
