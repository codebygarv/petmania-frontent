import { View, Text } from "react-native";
import React, { useState } from "react";
import { useColorScheme } from "nativewind";
import BackButton from "@/components/BackButton";
import OtpInputBox from "@/components/otpInput";
import Button from "@/components/Button";

const verification = () => {
  const [otp, setOtp] = useState("");
  const { toggleColorScheme } = useColorScheme();

  const changeColor = () => {
    toggleColorScheme();
  };

  return (
    <View className="flex gap-5 pt-7 pl-6 pr-6 h-screen bg-background">
      <View className="flex flex-row align-center">
        <BackButton />
        <Text className="text-center mx-20 color-textPrimary my-auto color-textPrimary font-semibold text-xl">
          Verification
        </Text>
      </View>
      <View className="gap-7">
        <View>
          <Text className="text-left color-textPrimary  color-textPrimary font-bold text-3xl">
            Enter 4-digit
          </Text>
          <Text className="text-left color-textPrimary  color-textPrimary font-bold text-3xl">
            recovery code
          </Text>
        </View>

        <Text className="color-textSecondary text-sm leading-6">
          The OTP is shared on your Registered Email. if didn't recieve check
          spam folder{" "}
        </Text>

        <OtpInputBox value={otp} onChange={setOtp} />

        <Button text="Verify Now" onPress={changeColor} />

        <View>
          <Text className="color-textSecondary text-sm leading-6 text-center">
            Dpn't You recieve any code
          </Text>

          <Text className="color-buttonPrimary text-sm leading-6 text-center underline">
            Re-Send Code
          </Text>
        </View>
      </View>
    </View>
  );
};

export default verification;
