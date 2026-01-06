        import { Tabs } from "expo-router";
import { Home, Circle, Circle, Circle } from "lucide-react-native";

        export default function TabLayout() {
          return (
            <Tabs
              screenOptions={{
                tabBarActiveTintColor: "#3b82f6",
                tabBarInactiveTintColor: "#9ca3af",
                tabBarStyle: { backgroundColor: "#0f172a" },
                headerStyle: { backgroundColor: "#0f172a" },
                headerTintColor: "#fff",
              }}
            >
              <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: "Communities",
          tabBarIcon: ({ color, size }) => <Circle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size }) => <Circle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => <Circle size={size} color={color} />,
        }}
      />
            </Tabs>
          );
        }
