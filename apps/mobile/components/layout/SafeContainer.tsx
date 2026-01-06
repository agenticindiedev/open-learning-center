import { SafeAreaView, StyleSheet, ViewStyle } from "react-native";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}

export function SafeContainer({ children, style }: Props) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
});
