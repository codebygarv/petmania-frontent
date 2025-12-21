## Petmania

Petmania is a mobile frontend built with Expo and React Native. It provides the UI, navigation, and client-side state for a pet-focused app (authentication, profiles, chat, favorites, etc.). This repository contains the app source, UI components, API wrappers, and client-side state management.

Tech stack
- Expo + React Native
- TypeScript / JSX
- Redux for global state
- React Query (query/) for server state
- Axios (api/) for HTTP requests
- Tailwind / NativeWind for styling

Quick start
1. Install dependencies

```
npm install
```

2. Start the Expo development server

```
npx expo start
```

Codebase overview
- `app/`: Screens and navigation layouts (authentication flow, main tab screens)
- `api/`: Axios instance and API wrappers
- `components/`: Reusable UI components (buttons, inputs, OTP, search, etc.)
- `assets/`: Images and static assets
- `config/`: App configuration such as toast setup
- `constants/`: Shared constants and hard-coded text
- `hooks/`: Custom React hooks (e.g., `useUsers`)
- `query/`: React Query client setup
- `redux/`: Redux store, actions, reducers, and persistence config
- `css/`: Global CSS

Environment & notes
- This project expects a typical Expo workflow. If there are environment variables or API endpoints, check `api/` and `config/` for places to configure them.
- Run on a simulator or a physical device via the Expo dev tools opened by `npx expo start`.

Contributing
- Open an issue or a PR with a clear description and reproduction steps.

License
- Add a license file if you intend to open-source this project.

For more details, explore the folders listed above to find screen implementations, components, and API usage.
