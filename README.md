# Soccer School App

A React Native iOS application for tracking soccer school students, training sessions, and finances.

## Features

- **PIN Authentication**: Secure PIN-based access (default: 2005, changeable)
- **Student Management**: Add, edit, and delete students with photos
- **Session Tracking**: Track training sessions with ratings, notes, and things to work on
- **Training Plans**: Create and manage training plans with drills (e.g., Ball Work → Dribbling Drills)
- **Finance Tracking**: Track hours paid vs hours used, calculate revenue and profit per student
- **12-Week Tracking**: Automatic week number calculation for sessions
- **Payment Status**: Track payment status for each student

## Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS development, you'll need:
   - Xcode installed
   - CocoaPods installed
   - iOS Simulator or physical device

3. Start the development server:
```bash
npm start
```

4. Run on iOS:
```bash
npm run ios
```

## Building for iOS

### Option 1: Expo Go (Easiest - No Mac Required!)

**Perfect if you don't have a Mac:**

1. Install Expo Go from the App Store on your iPhone
2. Run `npm start` on your computer
3. Scan the QR code with your iPhone camera or Expo Go app
4. The app will load in Expo Go

**See `WINDOWS_INSTALLATION.md` for detailed Windows instructions.**

### Option 2: Build Standalone App

**Requires Mac or Expo's cloud build service:**

1. Using Expo Cloud Build (no Mac needed):
```bash
npm install -g eas-cli
eas login
eas build --platform ios
```

2. Or using Xcode (requires Mac):
```bash
cd ios
pod install
cd ..
npx expo run:ios --device
```

## Default PIN

The default PIN is `2005`. You can change it in the Settings screen.

## Data Storage

All data is stored locally on the device using AsyncStorage. No cloud sync or external services are used.

## Project Structure

```
├── App.js                 # Main app entry point
├── screens/              # Screen components
│   ├── PinScreen.js
│   ├── StudentsScreen.js
│   ├── SessionsScreen.js
│   ├── TrainingPlansScreen.js
│   ├── FinanceScreen.js
│   └── SettingsScreen.js
├── components/           # Reusable components
│   ├── StudentModal.js
│   ├── SessionModal.js
│   ├── TrainingPlanModal.js
│   └── FinanceModal.js
├── navigation/           # Navigation setup
│   └── MainTabs.js
└── utils/               # Utility functions
    └── storage.js       # AsyncStorage helpers
```

## Technologies Used

- React Native
- Expo
- NativeWind (Tailwind CSS for React Native)
- AsyncStorage for local data persistence
- React Navigation for navigation
- Expo Image Picker for student photos

