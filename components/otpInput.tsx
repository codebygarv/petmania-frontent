import React, { useRef } from "react";
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

interface OtpInputBoxProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  boxSize?: number;
  keyboardType?: "numeric" | "default";
}

const OtpInputBox: React.FC<OtpInputBoxProps> = ({
  length = 4,
  value,
  onChange,
  boxSize = 55,
  keyboardType = "numeric",
}) => {
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const otpArray = value.split("");
    otpArray[index] = text;
    const otpValue = otpArray.join("");
    onChange(otpValue);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center items-center space-x-3">
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(ref) => {
            if (ref) inputs.current[i] = ref;
          }}
          value={value[i] || ""}
          onChangeText={(text) => handleChange(text.replace(/[^0-9]/g, ""), i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType={keyboardType}
          maxLength={1}
          textAlign="center"
          className="flex-row items-center rounded-2xl border border-buttonPrimary overflow-hidden w-full text-base font-semibold p-0 m-0 outline-none color-textPrimary text-center"
          style={{
            width: boxSize,
            height: boxSize,
          }}
        />
      ))}
    </View>
  );
};

export default OtpInputBox;
