# Pending Tasks & Improvements - Petmania Frontend

This document tracks the missing features, UX improvements, and technical gaps identified in the Petmania Frontend application.

## 🔐 Authentication & Security

- [ ] **Auto-login after Verification**: 
  - Current status: User is redirected to Login after successful OTP.
  - Improvement: Store the auth token and redirect directly to `/(tab)` after verification.
- [ ] **Resend OTP Logic**:
  - Current status: Button exists in `verification.tsx` but has no functionality.
  - Task: Implement `handleResendCode` and link it to the backend `resend-otp` endpoint.
- [ ] **Secure Password Reset**:
  - Current status: `forgotPasswordChange.tsx` updates password but may not be passing the verification token correctly.
  - Task: Ensure the temporary session token is retrieved from `AsyncStorage` and included in the `updatePasswordAction`.
- [ ] **Session Expiry Handling**:
  - Task: Implement logic to detect expired tokens and redirect the user back to the login screen automatically.

## 👤 User Profile & Onboarding

- [ ] **Onboarding Flow**:
  - Task: Create a flow for first-time users to set their name, profile picture, and bio after email verification.
- [ ] **Profile Settings Integration**:
  - Task: Link the `resetPassword.tsx` (Internal Change Password) screen to the Profile menu.
- [ ] **Edit Profile Completion**:
  - Task: Ensure all fields (Name, Email, Phone, etc.) are functional in the `EditProfile` screen.

## ✨ User Experience (UX) & UI Refinement

- [ ] **Premium Empty States**:
  - Task: Replace the "No pets found" text with a high-end illustration and "Try a different category" CTA.
- [ ] **Input Field Optimizations**:
  - Task: Set `keyboardType="number-pad"` and `autoFocus` for the OTP input fields.
  - Task: Ensure consistent validation messaging across all forms.
- [ ] **Theme Variable Standardization**:
  - Task: Systematically replace any remaining hardcoded hex colors with variables from `global.css` and `tailwind.config.js`.
- [ ] **Micro-animations**:
  - Task: Add subtle haptic feedback (using `expo-haptics`) and layout transitions (using `react-native-reanimated`) for a more premium feel.

## 🔍 Search & Filtering

- [ ] **Search Results**:
  - Task: Implement the backend connection for the `Search` component.
  - Task: Add "Recent Searches" persistence using `AsyncStorage`.

---

> [!NOTE]
> This list is dynamic and should be updated as tasks are completed or new requirements are identified.
