import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";

const ListHeading = ({ title, href }: ListHeadingProps) => {
  const router = useRouter();

  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>

      <TouchableOpacity
        className="list-action"
        onPress={() => router.push(href)}
      >
        <Text className="list-action-text">View all</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ListHeading;
