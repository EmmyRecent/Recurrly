import { Text } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="bg-background flex-1 p-5">
      <Text className="text-success rounded-4xl bg-red-50 p-4 text-xl font-bold">
        Welcome to Native wind!
      </Text>

      <Link
        href="/onboarding"
        className="bg-primary mt-4 rounded p-4 text-white"
      >
        Go to Onboarding
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
    </SafeAreaView>
  );
}
