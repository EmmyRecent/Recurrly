import {
  Text,
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "./index";
import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";

const Subscriptions = () => {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubscriptions = searchQuery.trim()
    ? HOME_SUBSCRIPTIONS.filter(
        (sub) =>
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : HOME_SUBSCRIPTIONS;

  return (
    <SafeAreaView className="bg-background flex-1 p-5">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10} // padding above the keyboard
      >
        <Text className="text-primary mb-4 text-3xl font-bold">
          My Subscriptions
        </Text>

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search subscriptions..."
          placeholderTextColor="#9ca3af"
          className="text-primary mb-5 rounded-2xl border border-black/10 bg-transparent px-4 py-5"
        />

        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() =>
                setExpandedSubscriptionId((currentId) =>
                  currentId === item.id ? null : item.id,
                )
              }
            />
          )}
          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-gray-400">
              No subscriptions found.
            </Text>
          }
          contentContainerClassName="pb-20"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Subscriptions;
