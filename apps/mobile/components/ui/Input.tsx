import { TextInput, StyleSheet, TextInputProps } from "react-native";

interface Props extends TextInputProps {
  // Add custom props here
}

export function Input(props: Props) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
});
