import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
}

export function Button({ children, onPress, variant = "primary", style }: Props) {
  return (
    <Pressable
      style={[styles.button, styles[variant], style]}
      onPress={onPress}
    >
      <Text style={[styles.text, variant === "ghost" && styles.ghostText]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#3b82f6",
  },
  secondary: {
    backgroundColor: "#1e293b",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  ghostText: {
    color: "#3b82f6",
  },
});
