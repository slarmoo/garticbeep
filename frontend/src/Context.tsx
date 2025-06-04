// VisibilityContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

type DisplayPromptContextType = {
    showPrompt: boolean;
    setShowPrompt: (value: boolean) => void;
};

type PromptTextContextType = {
    promptText: string;
    setPromptText: (value: string) => void;
}

type EventRoundContextType = {
    round: [number, string, number];
    setRound: (value: [number, string, number]) => void;
}

const DisplayPromptContext = createContext<DisplayPromptContextType | undefined>(undefined);
const PromptTextContext = createContext<PromptTextContextType | undefined>(undefined);
const EventRoundContext = createContext<EventRoundContextType | undefined>(undefined);

export function ContextProvider({ children }: { children: ReactNode }) {
    const [showPrompt, setShowPrompt] = useState<boolean>(false);
    const [promptText, setPromptText] = useState<string>("");
    const [round, setRound] = useState<[number, string, number]>([1, "start", 0]);

    return (
        <DisplayPromptContext.Provider value={{ showPrompt, setShowPrompt }}>
            <PromptTextContext.Provider value={{ promptText, setPromptText }}>
                <EventRoundContext.Provider value={{ round, setRound }}>
                    {children}
                </EventRoundContext.Provider>
            </PromptTextContext.Provider>
        </DisplayPromptContext.Provider>
    );
}

export function displayPrompt() {
    const context = useContext(DisplayPromptContext);
    if (!context) {
        throw new Error("displayPrompt must be used within a ContextProvider");
    }
    return context;
}

export function displayPromptText() {
    const context = useContext(PromptTextContext);
    if (!context) {
        throw new Error("displayPrompt must be used within a ContextProvider");
    }
    return context;
}

export function EventRound() {
    const context = useContext(EventRoundContext);
    if (!context) {
        throw new Error("round must be used within a ContextProvider");
    }
    return context;
}
