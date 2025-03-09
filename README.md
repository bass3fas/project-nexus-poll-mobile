# Project Nexus - Online Poll System

## 📌 Overview

Project Nexus is an advanced mobile application designed to facilitate interactive online polling with real-time voting and result updates. Built with **React Native (Expo)**, the project demonstrates robust state management using **Redux Toolkit**, real-time data with **Firebase Firestore**, smooth animations with **Lottie**, and input validation with **Zod**. The UI is styled using **NativeWind** (a Tailwind CSS solution for React Native).

---

## 🎯 Project Goals

- **API Integration:** Connect to Firebase Firestore to fetch and update poll data in real time.
- **State Management:** Use Redux Toolkit to manage authentication and poll data efficiently.
- **Real-Time Updates:** Enable live poll result visualization through Firestore listeners.
- **User-Friendly Interface:** Offer a smooth, responsive UI with engaging animations and dynamic styling.
- **Data Validation:** Use Zod to enforce poll input integrity.
- **User Authentication:** Allow users to sign up, sign in, and manage their votes. Each user can vote for only one option per poll and update their vote as needed.

---

## 🛠 Technologies Used

- **React Native (Expo):** Cross-platform mobile development.
- **Redux Toolkit:** State management for polls and authentication.
- **TypeScript:** Ensures type safety.
- **NativeWind:** Tailwind CSS-based styling for React Native.
- **Firebase Firestore & Authentication:** Real-time database and user management.
- **Lottie (lottie-react-native):** Animations for enhanced UI feedback.
- **Zod:** Schema validation for poll inputs.
- **Victory Native / react-native-chart-kit:** Data visualization for poll results.
- **EAS Build:** Cloud build service for native apps.
- **.npmrc (legacy-peer-deps):** Used to resolve dependency conflicts during installation.

---

## 📋 Project Structure

### **App & Layout**

- **\`app/_layout.tsx\`:**
  - Wraps the entire app with the Redux Provider.
  - Uses a **LinearGradient** background.
  - Listens to authentication state changes via Firebase and dispatches the \`setUser\` action.
  - Defines navigation routes: Welcome, Sign In, Sign Up, and Main App Tabs.

- **\`app/index.tsx\` (WelcomeScreen):**
  - Displays a welcome message with engaging Lottie animations.
  - Provides navigation links to Sign In, Sign Up, and other key areas.

- **\`app/signin.tsx\` (SignInScreen):**
  - Implements the sign-in form.
  - Dispatches the Redux async thunk for signing in.
  - Routes the user to the main app upon successful sign-in.

- **\`app/signup.tsx\` (SignUpScreen):**
  - Implements the sign-up form with input validation.
  - Dispatches the Redux async thunk for registration.
  - Saves user details in Firestore under the \`users\` collection.
  - Displays a Lottie success animation upon account creation.

- **\`(tabs)/_layout.tsx\`:**
  - Manages tab navigation for the main app screens.
- **\`(tabs)/create.tsx\` (CreatePoll):**
  - Provides a form for creating polls with Zod validation.
  - Dispatches the Redux async thunk for poll creation.
- **\`(tabs)/vote.tsx\` (VoteScreen):**
  - Allows authenticated users to vote.
  - Ensures only one vote per poll, allowing vote editing.
  - Includes UI elements for deleting polls (for creators).
- **\`(tabs)/results.tsx\` (ResultsScreen):**
  - Displays real-time poll results using charts (VictoryPie or PieChart).
  - Filters out options with 0% votes in the chart.
  - Highlights the option the current user voted for.
  - Shows vote counts and percentages for each option.

### **Other Components**

- **\`components/AuthProvider.tsx\`:**
  - Provides an authentication context.
  - Listens to Firebase auth state and dispatches \`setUser\`.
- **\`components/LoadingScreen.tsx\`:**
  - A simple loading indicator component.

### **Hooks**

- **\`hooks/useFonts.ts\`:**
  - Loads custom fonts (e.g., Modak and Mochiy) for the app.

### **Store & Slices**

- **\`store/store.ts\`:**
  - Configures Redux with \`poll\` and \`auth\` slices.
- **\`store/slices/authSlice.ts\`:**
  - Handles user authentication using Firebase Auth.
  - On sign-in, retrieves user data from Firestore; if missing, deletes the Auth user.
- **\`store/slices/pollSlice.ts\`:**
  - Manages poll data: fetching, voting, creating, and deleting polls.
  - Includes a helper to normalize poll data from Firestore.
  - Implements logic to ensure a user can only vote once per poll, and updating their vote removes the previous vote.

---

## 🚀 Deployment Steps with EAS Build

### **1. Install EAS CLI**

\`\`\`bash
npm install -g eas-cli
\`\`\`

### **2. Configure Project**

\`\`\`bash
eas build:configure
\`\`\`
Choose **Android** when prompted.

### **3. Build APK**

\`\`\`bash
eas build --platform android --profile preview
\`\`\`

---

## 📀 Git Commit Workflow
| Commit Type  | Purpose |
|-------------|---------|
| `feat:`     | New feature development |
| `fix:`      | Bug fixes |
| `style:`    | UI and styling improvements |
| `docs:`     | Documentation updates |
| `refactor:` | Code structure improvements |

---
## 📢 Final Words

Project Nexus demonstrates your expertise in building real-world, interactive applications using React Native, Redux, Firebase, and more. The project addresses challenges such as dependency conflicts, real-time data updates, vote editing, and dynamic UI improvements. By following the detailed setup and deployment steps, you now have a robust application ready for internal distribution and further enhancements.

Happy coding! 🚀
