import { Text } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "./index";
import { usePostHog } from "posthog-react-native";

const Insights = () => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("insights_viewed");
  }, [posthog]);

  return (
    <SafeAreaView className="bg-background flex-1 p-5">
      <Text>Insights</Text>
    </SafeAreaView>
  );
};
export default Insights;
