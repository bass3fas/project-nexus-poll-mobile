# Project Nexus - Online Poll System

## 📌 Overview
Project Nexus is an advanced mobile application designed to facilitate interactive online polling with real-time voting and result updates. The app is built using **React Native (Expo)** with robust state management, animations, and data validation.

## 🎯 Project Goals
- **API Integration**: Fetch and display poll questions and real-time results from an API.
- **State Management**: Utilize Redux Toolkit for efficient data flow.
- **Real-time Updates**: Enable live result visualization with Firebase Firestore.
- **User-Friendly Interface**: Smooth UI with animations and dynamic styling.
- **Data Validation**: Use Zod to ensure input data integrity.

## 🛠 Technologies Used
- **React Native (Expo)**: Cross-platform mobile development.
- **Redux Toolkit**: State management.
- **TypeScript**: Type safety.
- **Victory Native**: Charts for poll visualization.
- **NativeWind**: Tailwind CSS-based styling.
- **Firebase Firestore**: Real-time data storage.
- **Lottie**: Animations for enhanced UI.
- **Zod**: Schema validation for poll inputs.

## 📋 Setup & Implementation Steps

### **1. Install Prerequisites**
Ensure you have Node.js and Expo CLI installed:
```bash
npm install -g expo-cli
```

### **2. Initialize the Project**
```bash
npx create-expo-app@latest project-nexus-poll-system --template with-router
cd project-nexus-poll-system
```

### **3. Install Dependencies**
```bash
npm install nativewind tailwindcss@^3.4.17
npm install react-redux @reduxjs/toolkit
npm install victory-native react-native-svg
npm install expo-constants firebase
npm install lottie-react-native lottie-ios
npm install zod
```

### **4. Set Up Tailwind**
Run:
```bash
npx tailwindcss init
```
Modify `tailwind.config.js`:
```ts
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```
Create `global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Modify `babel.config.js`:
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### **5. Set Up Redux Store**
Create `store.ts`:
```ts
import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './slices/pollSlice';

export const store = configureStore({
  reducer: {
    poll: pollReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### **6. Create a Redux Slice for Poll Management**
Create `slices/pollSlice.ts`:
```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Poll = {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
};

type PollState = {
  polls: Poll[];
};

const initialState: PollState = {
  polls: [],
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    addPoll: (state, action: PayloadAction<Poll>) => {
      state.polls.push(action.payload);
    },
    votePoll: (state, action: PayloadAction<{ pollId: string; optionId: string }>) => {
      const poll = state.polls.find((p) => p.id === action.payload.pollId);
      if (poll) {
        const option = poll.options.find((o) => o.id === action.payload.optionId);
        if (option) {
          option.votes += 1;
        }
      }
    },
  },
});

export const { addPoll, votePoll } = pollSlice.actions;
export default pollSlice.reducer;
```

### **7. Firebase Setup**
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com).
2. Enable Firestore Database.
3. Add Firebase configuration to `.env`:
```ini
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_id
```
4. Initialize Firebase (`firebaseConfig.ts`):
```ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### **8. Implement Poll Features**
- **Poll Creation**: Form with input validation using Zod.
- **Voting Screen**: Allow users to vote on active polls.
- **Live Result Screen**: Display real-time poll results with Victory charts.

### **9. Use Charts for Visualization**
Example using `VictoryPie`:
```tsx
import { VictoryPie } from 'victory-native';

<VictoryPie
  data={poll.options.map(option => ({ x: option.text, y: option.votes }))}
  colorScale={["#f87171", "#60a5fa", "#fbbf24"]}
/>
```

### **10. Run the App**
```bash
npx expo start
```

## 📀 Git Commit Workflow
| Commit Type  | Purpose |
|-------------|---------|
| `feat:`     | New feature development |
| `fix:`      | Bug fixes |
| `style:`    | UI and styling improvements |
| `docs:`     | Documentation updates |
| `refactor:` | Code structure improvements |

Example commits:
```bash
git commit -m "feat: add poll creation feature"
git commit -m "fix: resolve Redux state update issue"
```

## 📢 Deployment
For testing:
```bash
expo build:android  # Android APK
expo build:ios      # iOS App
```

## 📊 Evaluation Criteria
- **Functionality**: Create polls, vote, and see live results.
- **Code Quality**: Modular, clean, maintainable.
- **User Experience**: Smooth UI with animations.

## 🎯 Final Words
This project demonstrates expertise in **React Native, Redux, Firebase, and real-time applications**. Build something amazing! 🚀

