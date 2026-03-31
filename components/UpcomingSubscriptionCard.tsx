import { View, Text, Image, TouchableOpacity } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

const UpcomingSubscriptionCard = ({
  name,
  price,
  daysLeft,
  currency,
  icon,
}: UpcomingSubscription) => {
  const upcoming =
    daysLeft > 1
      ? `${daysLeft} days Left`
      : daysLeft === 1
        ? "Last day"
        : "Expired";

  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />

        <View>
          <Text className="upcoming-price">
            {formatCurrency(price, currency)}
          </Text>
          <Text className="upcoming-meta">{upcoming}</Text>
        </View>
      </View>

      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};
export default UpcomingSubscriptionCard;
