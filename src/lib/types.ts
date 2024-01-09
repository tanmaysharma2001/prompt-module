export interface Prompt {
    id: number,
    type: string;
    model: string;
    system_message: string;
    messages: any[];
    temperature: number[];
    maxLength: number[];
    topP: number[];
    frequencyPenalty: number[];
    presencePenalty: number[];
}

export interface OneShotMessage {
    type: string;
    message: string;
}

export interface ChainOfThoughtMessage {
    type: string;
    message: string;
    thoughts: string[] | null;
}

export interface ReactResponse {
    act: string;
    thought: string;
    observation: string;
}

export interface ReactPromptMessage {
    type: string;
    message: string;
    reactResponses: ReactResponse | null;
}


export interface PromptTabProps {
    currentUser: string;
    playgroundPrompt: Prompt;
    setPlaygroundPrompt: (prompt: Prompt) => void;
    setActivePage: (value: string) => void;
}

export interface APIKey {
    model: string;
    api_key: string;
}