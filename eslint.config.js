import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // 1. Global ignores
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "eslint.config.js",
      "vite.config.ts",
      "tailwind.config.js",
      "postcss.config.js",
    ],
  },

  // 2. The main, unified configuration for your entire project
  {
    // Apply this config to all TypeScript and React files
    files: ["src/**/*.{ts,tsx}"],

    // Define all plugins used in this block
    plugins: {
      "@typescript-eslint": tseslint.plugin, // Use the plugin from the helper
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },

    // Define all language options for this block
    languageOptions: {
      parser: tseslint.parser, // Use the parser from the helper
      parserOptions: {
        project: true, // Enable typed linting
        ecmaFeatures: {
          jsx: true, // Enable JSX
        },
      },
      globals: {
        ...globals.browser, // Add browser globals
      },
    },

    // Define all rules for this block
    rules: {
      // Start with the best recommended rules
      ...tseslint.configs.recommendedTypeChecked.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,

      // Customizations and best practices
      "react-refresh/only-export-components": "warn",
      "react/react-in-jsx-scope": "off", // Not needed for Vite
      "react/prop-types": "off", // Not needed with TypeScript
    },

    // Define settings for plugins
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // 3. Prettier config must be the absolute last thing
  prettierConfig,
);
