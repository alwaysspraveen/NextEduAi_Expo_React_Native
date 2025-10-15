import React from "react";
import { View, ViewProps } from "react-native";

type CardProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <View
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 ${className}`}
      {...props} // ✅ forward all RN props
    >
      {children}
    </View>
  );
}
