import { View, Text, StyleSheet } from "react-native";
import { SafeContainer } from "@/components/layout/SafeContainer";

export default function HomeScreen() {
  return (
    <SafeContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>This is the home screen.</Text>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
  },
});
