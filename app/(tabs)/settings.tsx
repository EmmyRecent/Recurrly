import { View, Text, Pressable, Image } from "react-native";
import { useUser, useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import images from "@/constants/images";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useState } from "react";

const SafeAreaView = styled(RNSafeAreaView);

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const username = user?.username ?? "";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const accountId = user?.id ?? "";
  const truncatedId =
    accountId.length > 20 ? accountId.slice(0, 20) + "…" : accountId;
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ". ") + "."
    : "—";

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="bg-background flex-1 p-5">
      <StatusBar style="dark" />

      <Text className="font-sans-extrabold text-primary mb-8 text-3xl">
        Settings
      </Text>

      {/* Profile card */}
      <View className="border-border bg-card mb-5 rounded-3xl border p-5">
        <View className="flex-row items-center gap-4">
          <Image
            source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            className="h-14 w-14 rounded-full"
            resizeMode="cover"
          />
          <View className="flex-1">
            {fullName ? (
              <Text className="font-sans-bold text-primary text-lg">
                {fullName}
              </Text>
            ) : null}
            {username ? (
              <Text className="font-sans-medium text-muted-foreground mt-0.5 text-sm">
                @{username}
              </Text>
            ) : null}
            <Text className="font-sans-medium text-muted-foreground mt-0.5 text-sm">
              {email}
            </Text>
          </View>
        </View>
      </View>

      {/* Account card */}
      <View className="border-border bg-card mb-8 rounded-3xl border p-5">
        <Text className="font-sans-bold text-primary mb-4 text-base">
          Account
        </Text>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-sans-medium text-muted-foreground text-sm">
            Account ID
          </Text>
          <Text className="font-sans-medium text-primary text-sm">
            {truncatedId}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-sans-medium text-muted-foreground text-sm">
            Joined
          </Text>
          <Text className="font-sans-medium text-primary text-sm">
            {joinedDate}
          </Text>
        </View>
      </View>

      {/* Sign-out button */}
      <Pressable
        className="auth-button"
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        <Text className="auth-button-text">
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
