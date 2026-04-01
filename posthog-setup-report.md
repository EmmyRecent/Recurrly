# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Recurrly Expo app. The integration covers the full authentication funnel (sign-up, email verification, MFA, sign-in, sign-out), subscription engagement, and onboarding visibility. PostHog is initialised via a singleton client in `lib/posthog.ts`, wrapped with `PostHogProvider` in the root layout alongside manual screen tracking using `usePathname`.

## Files changed

| File | Change |
|------|--------|
| `app.config.js` | Created — converts `app.json` to JS config; adds `extra.posthogProjectToken` and `extra.posthogHost` from env vars |
| `lib/posthog.ts` | Created — PostHog singleton client using `expo-constants` |
| `app/_layout.tsx` | Added `PostHogProvider`, `ScreenTracker` component for manual screen tracking |
| `app/(auth)/sign-up.tsx` | Added `sign_up_submitted`, `sign_up_completed`, `posthog.identify`, and `$exception` capture |
| `app/(auth)/sign-in.tsx` | Added `sign_in_submitted`, `sign_in_completed`, `mfa_code_requested`, `posthog.identify`, and `$exception` capture |
| `app/(tabs)/settings.tsx` | Added `sign_out` event and `posthog.reset()` |
| `app/(tabs)/index.tsx` | Added `subscription_expanded` event with subscription metadata |
| `app/(tabs)/insights.tsx` | Added `insights_viewed` event |
| `app/subscriptions/[id].tsx` | Added `subscription_details_viewed` event |
| `app/onboarding.tsx` | Added `onboarding_viewed` event |
| `.env` | Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `sign_up_submitted` | User submits the sign-up form with valid credentials | `app/(auth)/sign-up.tsx` |
| `sign_up_completed` | User successfully completes registration after email verification | `app/(auth)/sign-up.tsx` |
| `sign_in_submitted` | User submits the sign-in form | `app/(auth)/sign-in.tsx` |
| `sign_in_completed` | User successfully signs in (single-factor or after MFA) | `app/(auth)/sign-in.tsx` |
| `mfa_code_requested` | MFA email code is sent during sign-in | `app/(auth)/sign-in.tsx` |
| `sign_out` | User signs out from the Settings screen | `app/(tabs)/settings.tsx` |
| `onboarding_viewed` | User views the onboarding screen — top of acquisition funnel | `app/onboarding.tsx` |
| `subscription_expanded` | User taps a subscription card to expand its details | `app/(tabs)/index.tsx` |
| `subscription_details_viewed` | User navigates to the subscription detail screen | `app/subscriptions/[id].tsx` |
| `insights_viewed` | User navigates to the Insights tab | `app/(tabs)/insights.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/151337/dashboard/598067
- **Sign-up funnel** (`sign_up_submitted` → `sign_up_completed`): https://eu.posthog.com/project/151337/insights/2WXk1zbv
- **Sign-in funnel** (`sign_in_submitted` → `sign_in_completed`): https://eu.posthog.com/project/151337/insights/FrX7zQTY
- **New sign-ups per day**: https://eu.posthog.com/project/151337/insights/WEnoUxG7
- **Sign-outs vs sign-ins (churn signal)**: https://eu.posthog.com/project/151337/insights/im1vJ1hu
- **Subscription engagement**: https://eu.posthog.com/project/151337/insights/xwfKwn87

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
