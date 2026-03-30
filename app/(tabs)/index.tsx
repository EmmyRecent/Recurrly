import { Text } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

export const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="bg-background flex-1 p-5">
      <Text className="text-primary font-sans-bold rounded-4xl p-4 text-5xl">
        Home
      </Text>

      <Link
        href="/onboarding"
        className="bg-primary font-sans-bold mt-4 rounded p-4 text-white"
      >
        Go to Onboarding
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="bg-primary font-sans-bold mt-4 rounded p-4 text-white"
      >
        Go to sign in{" "}
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="bg-primary font-sans-bold mt-4 rounded p-4 text-white"
      >
        Go to sign up{" "}
      </Link>
    </SafeAreaView>
  );
}
