import React, { memo, useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import { getColor } from '@/constants/color'

const VARIANT_CLASSES = {
  default: 'px-2.5 py-1 border rounded-full ml-2 dark:bg-buttonPrimary/20 dark:border-buttonPrimary bg-buttonPrimary/10 border-buttonPrimary',
  outline: 'px-2.5 py-1 border rounded-full ml-2 bg-transparent border-border',
  success: 'px-2.5 py-1 border rounded-full ml-2 dark:bg-green-900/30 dark:border-green-500 bg-green-100 border-green-500',
  warning: 'px-2.5 py-1 border rounded-full ml-2 dark:bg-yellow-900/30 dark:border-yellow-500 bg-yellow-100 border-yellow-500',
}

const TEXT_CLASSES = {
  default: 'color-buttonPrimary font-medium text-xs',
  outline: 'color-textSecondary font-medium text-xs',
  success: 'color-success font-medium text-xs',
  warning: 'color-warning font-medium text-xs',
}

const Tags = ({ text = '', variant = 'default', icon = null, onPress = null, maxLength = 20, style }) => {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  const iconColors = {
    default: getColor('accent', isDark),
    outline: getColor('textSecondary', isDark),
    success: getColor('success', isDark),
    warning: getColor('warning', isDark),
  }

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
            color={iconColors[variant] || iconColors.default}
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