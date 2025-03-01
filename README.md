# Project Nexus - Online Poll System

## 📌 Overview
Project Nexus is an advanced software development initiative aimed at showcasing real-world application skills. This project involves building an **Online Poll System**, a dynamic and interactive polling platform that provides real-time voting and live result updates. The application will be built as a **mobile app** using React Native, Expo, Redux, and NativeWind.

## 🎯 Project Goals
- **API Integration**: Fetch and display poll questions and real-time results from an API.
- **State Management**: Use Redux to efficiently manage application state.
- **Dynamic Visualizations**: Implement charts to visually represent live poll results.
- **Real-time Updates**: Ensure seamless user interaction and immediate display of poll results.
- **User-Friendly Interface**: Provide an intuitive and engaging experience.

## 🛠 Technologies Used
- **React Native (Expo)**: Component-based UI development.
- **Redux Toolkit**: State management.
- **TypeScript**: Type safety and maintainability.
- **Victory Native**: Charting library for visualizing poll results.
- **NativeWind**: Tailwind CSS for styling in React Native.
- **Firebase/Firestore or Supabase (Optional for real-time database updates).**

## 📋 Setup & Implementation Steps

### **1. Install Prerequisites**
Ensure you have Node.js and Expo CLI installed:
```bash
npm install -g expo-cli
```

### **2. Initialize the Project**
```bash
expo init project-nexus-poll-system
cd project-nexus-poll-system
```
Choose the **TypeScript** template when prompted.

### **3. Install Dependencies**
```bash
npm install react-redux @reduxjs/toolkit
npm install nativewind tailwindcss
npm install victory-native react-native-svg
```

### **4. Configure NativeWind**
Initialize Tailwind CSS for styling:
```bash
npx tailwindcss init
```
Modify `tailwind.config.js` to support React Native:
```js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### **5. Set Up Redux Store**
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

## 🔄 Git Commit Workflow
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

