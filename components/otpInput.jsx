import React, { useRef } from "react";
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";



const OtpInputBox = ({
  length = 4,
  value,
  onChange,
  boxSize = 55,
  keyboardType = "numeric",
}) => {
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const otpArray = value.split("");
    otpArray[index] = text;
    const otpValue = otpArray.join("");
    onChange(otpValue);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
     e, index
  ) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center items-center space-x-3 gap-3">
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
          autoFocus={i === 0}
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
