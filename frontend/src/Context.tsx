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

const DisplayPromptContext = createContext<DisplayPromptContextType | undefined>(undefined);
const PromptTextContext = createContext<PromptTextContextType | undefined>(undefined);

export function ContextProvider({ children }: { children: ReactNode }) {
    const [showPrompt, setShowPrompt] = useState<boolean>(false);
    const [promptText, setPromptText] = useState<string>("");

    return (
        <DisplayPromptContext.Provider value={{ showPrompt, setShowPrompt }}>
            <PromptTextContext.Provider value ={{ promptText, setPromptText}}>
                {children}
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
