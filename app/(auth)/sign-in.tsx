import { useSignIn } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import clsx from "clsx";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

const StyledSafeAreaView = styled(SafeAreaView);
const TextInput = styled(RNTextInput);

const EMAIL_RE = /\S+@\S+\.\S+/;

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const isLoading = fetchStatus === "fetching";

  const handleSignIn = async () => {
    setLocalError("");

    if (!emailAddress.trim() || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_RE.test(emailAddress.trim())) {
      setLocalError("Enter a valid email address.");
      return;
    }

    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          router.replace(decorateUrl("/") as Href);
        },
      });
      return;
    }

    if (signIn.status === "needs_second_factor") {
      try {
        const { error: sendCodeError } = await signIn.mfa.sendEmailCode();
        if (sendCodeError) {
          setLocalError(sendCodeError.longMessage || sendCodeError.message);
          return;
        }
        setVerifying(true);
      } catch (err) {
        setLocalError(
          "Failed to send verification code. Please try again later.",
        );
        return;
      }
    }
  };

  const handleVerify = async () => {
    setLocalError("");

    if (!code.trim()) {
      setLocalError("Please enter the verification code.");
      return;
    }

    try {
      await signIn.mfa.verifyEmailCode({ code });
    } catch (err: any) {
      setLocalError(
        err?.errors?.[0]?.longMessage ||
          err?.errors?.[0]?.message ||
          err?.message ||
          "Invalid or expired code. Please try again.",
      );
      return;
    }

    // signIn is a mutable Clerk object — .status is updated in-place after the await
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          router.replace(decorateUrl("/") as Href);
        },
      });
    } else {
      setLocalError("Verification incomplete. Please try again.");
    }
  };

  const globalError =
    localError ||
    errors.global?.[0]?.longMessage ||
    errors.global?.[0]?.message ||
    "";

  //  Email verification view
  if (verifying && signIn.status === "needs_second_factor") {
    return (
      <StyledSafeAreaView className="auth-safe-area">
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            className="auth-scroll"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="auth-content">
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">R</Text>
                  </View>
                  <View>
                    <Text className="auth-wordmark">Recurly</Text>
                    <Text className="auth-wordmark-sub">SMART BILLING</Text>
                  </View>
                </View>
                <Text className="auth-title">Check your inbox</Text>
                <Text className="auth-subtitle">
                  We sent a 6-digit code to {emailAddress}
                </Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className="auth-input text-center text-2xl tracking-widest"
                      value={code}
                      onChangeText={setCode}
                      placeholder="000000"
                      placeholderTextColor="rgba(0,0,0,0.3)"
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus
                    />
                    {(errors as any)?.fields?.code && (
                      <Text className="auth-error">
                        {(errors as any).fields.code.message}
                      </Text>
                    )}
                  </View>

                  {globalError ? (
                    <Text className="auth-error">{globalError}</Text>
                  ) : null}

                  <Pressable
                    className={clsx(
                      "auth-button",
                      (isLoading || !code) && "auth-button-disabled",
                    )}
                    onPress={handleVerify}
                    disabled={isLoading || !code}
                  >
                    <Text className="auth-button-text">
                      {isLoading ? "Verifying…" : "Verify"}
                    </Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={async () => {
                      setCode("");

                      const { error: resendError } =
                        await signIn.mfa.sendEmailCode();

                      if (resendError) {
                        setLocalError(
                          resendError.longMessage || resendError.message,
                        );
                      }
                    }}
                    disabled={isLoading}
                  >
                    <Text className="auth-secondary-button-text">
                      Resend code
                    </Text>
                  </Pressable>

                  <View className="auth-link-row">
                    <Pressable
                      onPress={() => {
                        signIn.reset();
                        setVerifying(false);
                        setCode("");
                      }}
                    >
                      <Text className="auth-link">← Start over</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    );
  }

  // ── Main sign-in view ──────────────────────────────────────────────────────
  return (
    <StyledSafeAreaView className="auth-safe-area">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content">
            {/* Brand */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">SMART BILLING</Text>
                </View>
              </View>
              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            {/* Form card */}
            <View className="auth-card">
              <View className="auth-form">
                {/* Email */}
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      (errors as any)?.fields?.emailAddress &&
                        "auth-input-error",
                    )}
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                  />
                  {(errors as any)?.fields?.emailAddress && (
                    <Text className="auth-error">
                      {(errors as any).fields.emailAddress.message}
                    </Text>
                  )}
                </View>

                {/* Password */}
                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <View className="relative">
                    <TextInput
                      className={clsx(
                        "auth-input pr-12",
                        (errors as any)?.fields?.password && "auth-input-error",
                      )}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(0,0,0,0.3)"
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                      textContentType="password"
                    />
                    <Pressable
                      style={{
                        position: "absolute",
                        right: 16,
                        top: 0,
                        bottom: 0,
                        justifyContent: "center",
                      }}
                      onPress={() => setShowPassword((v) => !v)}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="rgba(0,0,0,0.4)"
                      />
                    </Pressable>
                  </View>
                  {(errors as any)?.fields?.password && (
                    <Text className="auth-error">
                      {(errors as any).fields.password.message}
                    </Text>
                  )}
                </View>

                {/* Global / local error */}
                {globalError ? (
                  <Text className="auth-error">{globalError}</Text>
                ) : null}

                {/* Submit */}
                <Pressable
                  className={clsx(
                    "auth-button",
                    (isLoading || !emailAddress || !password) &&
                      "auth-button-disabled",
                  )}
                  onPress={handleSignIn}
                  disabled={isLoading || !emailAddress || !password}
                >
                  <Text className="auth-button-text">
                    {isLoading ? "Signing in…" : "Sign in"}
                  </Text>
                </Pressable>

                {/* Switch to sign-up */}
                <View className="auth-link-row">
                  <Text className="auth-link-copy">New to Recurly?</Text>
                  <Link href="/(auth)/sign-up" asChild>
                    <Pressable>
                      <Text className="auth-link">Create an account</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
}
