/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class", // Enables dark mode using `class="dark"`
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background))",
        backgroundSecondary: "rgb(var(--color-background-secondary))",
        textPrimary: "rgb(var(--color-text-primary))",
        textOrange:"rgb(var(--color-orange))",
        textSecondary: "rgb(var(--color-text-secondary))",
        textHigh: "rgb(var(--color-text-high))",
        buttonPrimary: "rgb(var(--color-button-primary))",
        buttonSecondary: "rgb(var(--color-button-secondary))",
        buttonDisabled: "rgb(var(--color-button-disabled))",
        inputBg: "rgb(var(--color-input-bg))",
        inputBorder: "rgb(var(--color-input-border))",
        inputPlaceholder: "rgb(var(--color-input-placeholder))",
        inputIconColor:"rgb(var(--color-input-icon))",
        accent: "rgb(var(--color-accent))",
        highlight: "rgb(var(--color-highlight))",
        error: "rgb(var(--color-error))",
        success: "rgb(var(--color-success))",
        warning: "rgb(var(--color-warning))",
        border: "rgb(var(--color-border))",
        shadow: "rgb(var(--color-shadow))",
        loginSigcnupImageBg: "rgb(var(--color-login-singup-image-bg))",
        SocialBg: "rgb(var(--bg-Social-button))",
      },
    },
  },
  plugins: [],
};
