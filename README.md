# Project Nexus - Online Poll System

## 📌 Overview
Project Nexus is an advanced software development initiative aimed at showcasing real-world application skills. This project involves building an **Online Poll System**, a dynamic and interactive polling platform that provides real-time voting and live result updates. The application will be built as a **mobile app** using React Native, Expo, Redux, and NativeWind.

## 🎯 Project Goals
- **API Integration**: Fetch and display poll questions and real-time results from an API.
- **State Management**: Use Redux to efficiently manage application state.
- **Dynamic Visualizations**: Implement charts to visually represent live poll results.
- **Real-time Updates**: Ensure seamless user interaction and immediate display of poll results.
- **User-Friendly Interface**: Provide an intuitive and engaging experience.

## 🦭 Technologies Used
- **React Native (Expo)**: Component-based UI development.
- **Redux Toolkit**: State management.
- **TypeScript**: Type safety and maintainability.
- **Victory Native**: Charting library for visualizing poll results.
- **NativeWind**: Tailwind CSS for styling in React Native.
- **Firebase/Firestore**: Real-time database for dynamic poll updates.

## 📋 Setup & Implementation Steps

### **1. Install Prerequisites**
Ensure you have Node.js installed.

### **2. Initialize the Project**
```bash
npx create-expo-stack@latest project-nexus-poll-system --nativewind 
cd project-nexus-poll-system
```
Choose the **TypeScript** template when prompted.

### **3. Install Dependencies**
```bash
npm install react-redux @reduxjs/toolkit
npm install victory-native react-native-svg
npm install firebase
```

### **4. Set Up Redux Store**
Create a `store.ts` file:
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

### **5. Create a Redux Slice for Poll Management**
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

### **6. Firebase Setup (Critical for Real-Time)**
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com).
2. Enable Firestore Database (Test Mode).
3. Add Firebase configuration to `.env`:
```ini
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_id
```
4. Initialize Firebase in your project (`firebaseConfig.ts`):
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

### **7. Implement Poll Creation and Voting**
- **Poll Creation:** A screen where users can create a poll.
- **Voting Screen:** Users can vote on polls.
- **Live Result Screen:** Display real-time poll results with charts.

### **8. Use Charts for Visualization**
Example of integrating a chart using `VictoryPie`:
```tsx
import { VictoryPie } from 'victory-native';

<VictoryPie
  data={poll.options.map(option => ({ x: option.text, y: option.votes }))}
  colorScale={["#f87171", "#60a5fa", "#fbbf24"]}
/>
```

### **9. Run the App**
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
For testing the app:
```bash
expo build:android  # Build Android APK
expo build:ios      # Build iOS App
```

## 📊 Evaluation Criteria
Your project will be evaluated based on:
- **Functionality**: Ability to create polls, vote, and see live results.
- **Code Quality**: Clean, modular, and maintainable code.
- **User Experience**: Smooth interactions and dynamic visualizations.
- **Version Control**: Proper commit messages and repository structure.

## 🎯 Final Words
Project Nexus is your opportunity to **demonstrate expertise in real-world software development**. Follow the outlined steps, apply best practices, and build a project you can proudly showcase to potential employers!

Happy coding! 🚀

