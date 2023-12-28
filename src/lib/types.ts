export interface Prompt {
    id: number,
    type: string;
    model: string;
    system_message: string;
    messages: any[];
    temperature: string;
    maxLength: string;
    topP: string;
    frequencyPenalty: string;
    presencePenalty: string;
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


export interface PromptTabProps {
    playgroundPrompt: Prompt;
    setPlaygroundPrompt: (prompt: Prompt) => void;
    llmModel: string;
    setLLMModel: (model: string) => void;
    type: string;
    systemMessage: string;
    setSystemMessage: (message: string) => void;
    tempValue: number[];
    setTempValue: (value: number[]) => void;
    maxLengthValue: number[];
    setMaxLengthValue: (value: number[]) => void;
    topPValue: number[];
    setTopPValue: (value: number[]) => void;
    freqPenaltyValue: number[];
    setFreqPenaltyValue: (value: number[]) => void;
    presencePenaltyValue: number[];
    setPresencePenaltyValue: (value: number[]) => void;
}

export interface APIKey {
    model: string;
    api_key: string;
}