import { View, Text, Image, TouchableOpacity } from "react-native";
import { formatCurrency } from "@/lib/utils";

const UpcomingSubscriptionCard = ({
  name,
  price,
  daysLeft,
  currency,
  icon,
}: UpcomingSubscription) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />

        <View>
          <Text className="upcoming-price">
            {formatCurrency(price, currency)}
          </Text>
          <Text className="upcoming-meta">
            {daysLeft > 1 ? "days left" : "last day"}
          </Text>
        </View>
      </View>

      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};
export default UpcomingSubscriptionCard;
