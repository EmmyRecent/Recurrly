import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "./index";
import { useUser, useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import images from "@/constants/images";

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const accountId = user?.id ?? "";
  const truncatedId = accountId.length > 20 ? accountId.slice(0, 20) + "…" : accountId;
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, ". ") + "."
    : "—";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="bg-background flex-1 p-5">
      <StatusBar style="dark" />

      <Text className="text-3xl font-sans-extrabold text-primary mb-8">
        Settings
      </Text>

      {/* Profile card */}
      <View className="rounded-3xl border border-border bg-card p-5 mb-5">
        <View className="flex-row items-center gap-4">
          <Image
            source={images.avatar}
            className="w-14 h-14 rounded-full"
            resizeMode="cover"
          />
          <View className="flex-1">
            {fullName ? (
              <Text className="text-lg font-sans-bold text-primary">
                {fullName}
              </Text>
            ) : null}
            <Text className="text-sm font-sans-medium text-muted-foreground mt-0.5">
              {email}
            </Text>
          </View>
        </View>
      </View>

      {/* Account card */}
      <View className="rounded-3xl border border-border bg-card p-5 mb-8">
        <Text className="text-base font-sans-bold text-primary mb-4">
          Account
        </Text>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-sm font-sans-medium text-muted-foreground">
            Account ID
          </Text>
          <Text className="text-sm font-sans-medium text-primary">
            {truncatedId}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-sans-medium text-muted-foreground">
            Joined
          </Text>
          <Text className="text-sm font-sans-medium text-primary">
            {joinedDate}
          </Text>
        </View>
      </View>

      {/* Sign out button */}
      <Pressable className="auth-button" onPress={handleSignOut}>
        <Text className="auth-button-text">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}
