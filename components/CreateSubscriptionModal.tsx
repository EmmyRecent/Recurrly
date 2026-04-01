import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import { icons } from "@/constants/icons";
import type { ImageSourcePropType } from "react-native";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#f5a623",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#d4edda",
  Cloud: "#cce5ff",
  Music: "#fce4ec",
  Other: "#e2e3e5",
};

const LOCAL_MAP: [string, ImageSourcePropType][] = [
  ["spotify", icons.spotify],
  ["notion", icons.notion],
  ["figma", icons.figma],
  ["adobe", icons.adobe],
  ["github", icons.github],
  ["claude", icons.claude],
  ["canva", icons.canva],
  ["dropbox", icons.dropbox],
  ["medium", icons.medium],
  ["openai", icons.openai],
];

function getSlug(name: string) {
  return name
    .trim()
    .split(/\s+/)[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getIconSource(name: string): ImageSourcePropType {
  const token = process.env.EXPO_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY!;
  console.log("LOGO_DEV token:", token);
  const lower = name.toLowerCase();
  for (const [keyword, icon] of LOCAL_MAP) {
    if (lower.includes(keyword)) return icon;
  }
  const slug = getSlug(name);
  if (slug)
    return {
      uri: `https://img.logo.dev/${slug}.com?token=${token}`,
    };
  return icons.wallet;
}

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Entertainment");
  const [iconError, setIconError] = useState(false);

  console.log("Logo:", getIconSource("Netflix"));

  // Only reset error when the first-word slug changes, not on every keystroke
  const slug = getSlug(name);
  useEffect(() => {
    setIconError(false);
  }, [slug]);

  const resolvedIcon =
    iconError || !name.trim() ? icons.wallet : getIconSource(name);

  const isValid = name.trim() !== "" && parseFloat(price) > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    const now = dayjs();
    const sub: Subscription = {
      id: `sub-${Date.now()}`,
      icon: resolvedIcon,
      name: name.trim(),
      price: parseFloat(price),
      billing: frequency,
      category,
      status: "active",
      startDate: now.toISOString(),
      renewalDate: (frequency === "Monthly"
        ? now.add(1, "month")
        : now.add(1, "year")
      ).toISOString(),
      color: CATEGORY_COLORS[category],
      currency: "GBP",
    };
    onSubmit(sub);
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setIconError(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        {/* Tapping the dimmed area above the sheet closes the modal */}
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={onClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              className="modal-body"
              keyboardShouldPersistTaps="handled"
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={resolvedIcon}
                      style={{ width: 44, height: 44 }}
                      resizeMode="contain"
                      onError={() => setIconError(true)}
                    />
                  </View>
                  <TextInput
                    className="auth-input"
                    style={{ flex: 1 }}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Netflix"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                  />
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className="auth-input"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {(["Monthly", "Yearly"] as const).map((f) => (
                    <Pressable
                      key={f}
                      className={clsx(
                        "picker-option",
                        frequency === f && "picker-option-active",
                      )}
                      onPress={() => setFrequency(f)}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          frequency === f && "picker-option-text-active",
                        )}
                      >
                        {f}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((c) => (
                    <Pressable
                      key={c}
                      className={clsx(
                        "category-chip",
                        category === c && "category-chip-active",
                      )}
                      onPress={() => setCategory(c)}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === c && "category-chip-text-active",
                        )}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                className={clsx(
                  "auth-button",
                  !isValid && "auth-button-disabled",
                )}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text className="auth-button-text">Add Subscription</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
