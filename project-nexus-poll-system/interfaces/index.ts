// Interfaces and types for app/index.tsx
export interface WelcomeScreenProps {
    fontsLoaded: boolean;
}

// Interfaces and types for app/signin.tsx
export interface SignInScreenProps { }

export interface SignInFormValues {
    email: string;
    password: string;
}

// Interfaces and types for app/signup.tsx
export interface SignUpScreenProps { }

export interface SignUpFormValues {
    name: string;
    email: string;
    password: string;
}

// Interfaces and types for components/CreatePoll.tsx
export interface CreatePollProps { }

export interface PollFormValues {
    question: string;
    options: string[];
}

// Interfaces and types for components/VoteScreen.tsx
export interface VoteScreenProps { }

export interface VoteFormValues {
    selectedOption: string;
}

// Interfaces and types for components/ResultsScreen.tsx
export interface ResultsScreenProps { }

export interface PollResult {
    option: string;
    votes: number;
}