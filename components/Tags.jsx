import React, { memo, useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const VARIANT_CLASSES = {
  default: 'px-2 py-1 border rounded-full ml-2 bg-red-200 border-red-500',
  outline: 'px-2 py-1 border rounded-full ml-2 bg-transparent border-gray-300',
  success: 'px-2 py-1 border rounded-full ml-2 bg-green-200 border-green-500',
  warning: 'px-2 py-1 border rounded-full ml-2 bg-yellow-200 border-yellow-500',
}

const TEXT_CLASSES = {
  default: 'text-red-700',
  outline: 'text-gray-700',
  success: 'text-green-700',
  warning: 'text-yellow-800',
}

const ICON_COLORS = {
  default: '#E0583D',
  outline: '#666666',
  success: '#2F855A',
  warning: '#D97706',
}

const Tags = ({ text = '', variant = 'default', icon = null, onPress = null, maxLength = 20, style }) => {
  const displayText = useMemo(() => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 1).trim() + '…'
  }, [text, maxLength])

  const Container = onPress ? Pressable : View
  const accessibilityRole = onPress ? 'button' : undefined

  return (
    <Container
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={`${text} tag`}
      className={VARIANT_CLASSES[variant] || VARIANT_CLASSES.default}
      style={style}
    >
      <View className="flex-row items-center">
        {icon ? (
          <Ionicons
            name={icon}
            size={14}
            color={ICON_COLORS[variant] || ICON_COLORS.default}
            style={{ marginRight: 6 }}
          />
        ) : null}
        <Text className={TEXT_CLASSES[variant] || TEXT_CLASSES.default} numberOfLines={1}>
          {displayText}
        </Text>
      </View>
    </Container>
  )
}

export default memo(Tags)