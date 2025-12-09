# Overview

Mobile application for the Erbe Tryout platform. Built with React Native and Expo, utilizing TypeScript for type safety.

# Setup

Ensure you have Node.js and npm installed. You will also need the Expo CLI installed globally or use npx.

## Project setup

First, install the dependencies:

```bash
npm install
```

## Running the project

To start the development server and run the app on your Android emulator:

```bash
# Start the Expo development server
npx expo start

# OR start with cache cleared (recommended if you face issues)
npx expo start --clear
```

Once the server is running, press `a` in the terminal to open the app on the connected Android emulator or device.

## Building an APK

To generate an APK file (for testing on a device without the development server), use the following command. This uses the `preview` profile defined in `eas.json`.

```bash
# Build an APK for Android
eas build -p android --profile preview
```

> **Note**: You need to have `eas-cli` installed (`npm install -g eas-cli`) and be logged in to your Expo account (`eas login`).

## Configuration & Permissions

### Android Permissions

To modify Android permissions (e.g., for Notifications, Camera, Storage), edit the `app.json` file. Add or remove permissions in the `android.permissions` array.

Example `app.json`:

```json
{
  "expo": {
    "android": {
      "permissions": [
        "INTERNET",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "NOTIFICATIONS"
      ]
    }
  }
}
```

After changing permissions, you will need to rebuild the binary (APK) or restart the development server with `--clear` to ensure changes are picked up.

# Project Structure

The project follows a standard Expo/React Native structure with source code located in the `src` directory.

- `assets/` - Static assets like fonts, icons, and images.
- `src/components/` - Reusable UI components (e.g., AppHeader, BottomNavigation).
- `src/constants/` - App-wide constants including theme colors and fonts.
- `src/contexts/` - React Context definitions for global state (e.g., AuthContext).
- `src/data/` - Static data files and mock data used across the app.
- `src/screens/` - Screen components organized by feature (e.g., home, tryout, login).
- `src/services/` - API integration and business logic services.
- `src/types/` - TypeScript type definitions.
- `App.tsx` - Main entry point and navigation setup.

# Features

### 1. Authentication
- Login and Registration functionality.
- Token-based authentication (JWT) with automatic token management.
- User profile management.

### 2. Tryout (Core Feature)
- Browse available tryout packages.
- Registration for tryouts (Free, Paid, or Proof-based).
- Taking tryouts with timer and question navigation.
- Viewing tryout results and progress.

### 3. Learning Materials (Materi)
- Categorized learning modules.
- Detailed subject and lesson views.

### 4. Practice & Mini-Games
- **Digidaw**: Category-based practice questions.
- **Snackbt**: Quick practice tests.
- **Poke**: Gamified question feature.
- **ImEng**: English improvement exercises.
- **Literasik**: Literacy-focused content.

### 5. User Engagement
- **Leaderboard**: Rankings based on user performance.
- **Notifications**: In-app notifications for updates and announcements.
- **Promotions**: Banners and promotional content.
- **Reports**: Detailed performance reports for users.

# Tech Stack

- **Framework**: React Native (via Expo SDK 54)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack)
- **State Management**: React Context API
- **Networking**: Axios
- **Storage**: AsyncStorage
- **UI/Styling**: Custom theme constants, React Native StyleSheet, SVG support.

# Developer Notes

### Navigation
The app uses `@react-navigation/native-stack` for navigation. The main stack is defined in `App.tsx`.
- `RootStackParamList` defines the available routes and their parameters.
- Screens are grouped by feature in `src/screens/`.

### Authentication & State
Global authentication state is managed via `AuthContext` (`src/contexts/AuthContext.tsx`).
- Wraps the application in `App.tsx`.
- Provides `user`, `isAuthenticated`, `login`, `register`, and `logout` methods.
- Persists tokens using `AsyncStorage`.

### API Integration
API calls are handled in `src/services/`.
- `api.ts`: Configures the Axios instance with base URL and interceptors.
- Interceptors automatically attach the Bearer token to requests and handle 401 errors.
- Specific services (e.g., `authService.ts`, `tryoutService.ts`) encapsulate endpoint logic.

### Styling & Theming
Design tokens are centralized in `src/constants/theme.ts`.
- `colors`: Palette for background, primary, accent, text, etc.
- `fontFamilies`: Custom font mappings (Montserrat, PlaypenSans).
- `spacing`, `radii`: Standardized spacing and border radius values.

### Fonts
Custom fonts are loaded in `App.tsx` using `expo-font`.
- Montserrat (Regular, Medium, SemiBold, Bold, ExtraBold)
- PlaypenSans (ExtraBold)

### Data Management
Static data and type definitions for content are located in `src/data/`. This is often used for features that might not yet be fully dynamic or for fallback content.

