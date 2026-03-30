import { Text, View } from "react-native";
import { Link } from "expo-router";
import id from "@/app/(tabs)/subscriptions/[id]";

export default function App() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <Text className="text-success rounded-4xl bg-red-50 p-4 text-xl font-bold">
        Welcome to Native wind!
      </Text>

      <Link
        href="/onboarding"
        className="bg-primary mt-4 rounded p-4 text-white"
      >
        Go to Onbaording{" "}
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="bg-primary mt-4 rounded p-4 text-white"
      >
        Go to sign in{" "}
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="bg-primary mt-4 rounded p-4 text-white"
      >
        Go to sign up{" "}
      </Link>

      <Link
        href={{ pathname: "/subscriptions/[id]", params: { id: "claude" } }}
      >
        Claude pro subscription
      </Link>
    </View>
  );
}
