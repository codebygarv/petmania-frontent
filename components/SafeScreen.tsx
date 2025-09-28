import { View } from "react-native";
import { ReactNode } from "react";

interface SafeScreenProps {
  children: ReactNode;
}

const SafeScreen = ({ children }: SafeScreenProps) => {
  return <View className="flex-1 px-4 bg-background  ">{children}</View>;
};

export default SafeScreen;
