import {useState} from "react";

// SHADCN Components
import {Textarea} from "@/components/ui/textarea.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Label} from "@/components/ui/label.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx"

// Prompting Techniques
import OneShot from "@/pages/PlaygroundPage/Components/PromptingTechniques/OneShot.tsx";
import FiveShot from "@/pages/PlaygroundPage/Components/PromptingTechniques/FiveShot.tsx";
import ChainOfThought from "@/pages/PlaygroundPage/Components/PromptingTechniques/ChainOfThought.tsx";
import ChainOfThought5Shot from "@/pages/PlaygroundPage/Components/PromptingTechniques/ChainOfThought5Shot.tsx";
import ReactPrompting from "@/pages/PlaygroundPage/Components/PromptingTechniques/ReactPrompting"

// Hyper Parameters
import FrequencyPenaltySelector from "@/pages/PlaygroundPage/Components/frequency-penalty-selector.tsx";
import PresencePenaltySelector from "@/pages/PlaygroundPage/Components/presence-penalty-selector.tsx";
import TemperatureSelector from "@/pages/PlaygroundPage/Components/temperature-selector.tsx";
import MaxLengthSelector from "@/pages/PlaygroundPage/Components/max-length-selector.tsx";
import TopPSelector from "@/pages/PlaygroundPage/Components/top-p-selector.tsx"

// Types
import { Prompt, PromptTabProps } from "@/lib/types.ts";

interface TabConfiguration {
    [key: string]: React.ElementType;
}

const PromptTabs: React.FC<PromptTabProps> = (props) => {
    const tabComponents: TabConfiguration = {
        'one-shot': OneShot,
        'chain-of-thought': ChainOfThought,
        'five-shot': FiveShot,
        'cot+5-shot': ChainOfThought5Shot,
        'react': ReactPrompting,
    };

    const ActiveTabComponent = tabComponents[props.type];

    // Debugging: Log if the ActiveTabComponent is not found
    if (!ActiveTabComponent) {
        console.error(`No component found for type: ${props.type}`);
    }

    return (
        <>
            {ActiveTabComponent ? (
                <ActiveTabComponent {...props} />
            ) : (
                <div>Error: No active tab component found.</div>
            )}
        </>
    );
}


export default function PlaygroundPage() {

    const [playgroundPrompt, setPlaygroundPrompt] = useState<Prompt>(() => {
        const playgroundPrompt = sessionStorage.getItem("playgroundPrompt");

        if (playgroundPrompt) {
            return JSON.parse(playgroundPrompt);
        } else {
            // Step 1: Check if there is an existing array in local storage
            const existingPrompts = localStorage.getItem('savedPrompts');

            // Step 2: Parse the existing array or create a new empty array
            let promptsArray = existingPrompts ? JSON.parse(existingPrompts) : [];

            const prompt: Prompt = {
                id: promptsArray.length + 1,
                type: "",
                model: "",
                system_message: "",
                messages: [],
                temperature: "",
                maxLength: "",
                topP: "",
                frequencyPenalty: "",
                presencePenalty: "",
            }

            return prompt;
        }
    });

    const [activeTab, setActiveTab] = useState(playgroundPrompt.type ? playgroundPrompt.type : "one-shot");

    const [systemMessage, setSystemMessage] = useState(playgroundPrompt.system_message ? playgroundPrompt.system_message : "");

    const [topPValue, setTopPValue] = useState(playgroundPrompt.topP ? [Number(playgroundPrompt.topP)] : [0.9]);

    const [freqPenaltyValue, setFreqPenaltyValue] = useState(playgroundPrompt.frequencyPenalty ? [Number(playgroundPrompt.frequencyPenalty)] : [0.9])

    const [presencePenaltyValue, setPresencePenaltyValue] = useState(playgroundPrompt.presencePenalty ? [Number(playgroundPrompt.presencePenalty)] : [1])

    const [tempValue, setTempValue] = useState(playgroundPrompt.temperature ? [Number(playgroundPrompt.temperature)] : [0.56]);

    const [maxLengthValue, setMaxLengthValue] = useState(playgroundPrompt.maxLength ? [Number(playgroundPrompt.maxLength)] : [256]);

    const [llmModel, setLLMModel] = useState(playgroundPrompt.model ? playgroundPrompt.model : "gpt-3.5-turbo");

    const handleSelectChange = (tabName: string) => {
        setActiveTab(tabName);
    }

    const handleLLMSelect = (modelName: string) => {
        setLLMModel(modelName);
    }

    return (
        <>
            <div className="md:hidden">
            </div>
            <div className="hidden h-full flex-col md:flex">
                <div
                    className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
                    <div className="flex flex-row mr-auto w-full space-x-3">
                        <h2 className="mt-1 text-lg font-semibold">Playground</h2>
                        <div className="">
                            <Select onValueChange={handleLLMSelect}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Select LLM"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="">
                            <Select onValueChange={handleSelectChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Prompting Techniques"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="one-shot">One-Shot</SelectItem>
                                    <SelectItem value="chain-of-thought">Chain of Thought</SelectItem>
                                    <SelectItem value="five-shot">5-Shot</SelectItem>
                                    <SelectItem value="cot+5-shot">CoT+5-Shot</SelectItem>
                                    <SelectItem value="react">ReAct</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="ml-auto flex w-full space-x-2 sm:justify-end">
                        {/*<PresetSave />*/}
                    </div>
                </div>
                <Separator/>
                <div className="flex-1">
                    <div className="container h-full py-2">
                        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
                            <div className="hidden flex-col space-y-4 sm:flex md:order-2">
                                <TemperatureSelector tempValue={tempValue} setTempValue={setTempValue}/>
                                <MaxLengthSelector maxLengthValue={maxLengthValue}
                                                   setMaxLengthValue={setMaxLengthValue}/>
                                <TopPSelector topPValue={topPValue} setTopPValue={setTopPValue}/>
                                <FrequencyPenaltySelector freqPenaltyValue={freqPenaltyValue}
                                                          setFreqPenaltyValue={setFreqPenaltyValue}/>
                                <PresencePenaltySelector presencePenaltyValue={presencePenaltyValue}
                                                         setPresencePenaltyValue={setPresencePenaltyValue}/>
                            </div>
                            <div className="md:order-1">
                                <div className="mt-0 border-0 p-0">
                                    <div className="flex flex-col space-y-2">
                                        <div className="grid h-full gap-4 lg:grid-cols-3">
                                            <div className="col-span-1 flex flex-col space-y-4">
                                                <div className="flex flex-1 flex-col space-y-2">
                                                    <Label htmlFor="input" className="px-3 py-2">System Message</Label>
                                                    <Textarea
                                                        id="input"
                                                        value={systemMessage}
                                                        onChange={(e) => setSystemMessage(e.target.value)}
                                                        placeholder="You are a helpful assistant."
                                                        className="flex-1 lg:min-h-[540px]"
                                                    >System Message </Textarea>
                                                </div>
                                            </div>
                                            {/* User Messages and Assistant Responses*/}
                                            <div
                                                className="col-span-2 flex flex-col justify-between space-y-4 mt-[5px] min-h-[540px] lg:min-h-[540px]">
                                                <PromptTabs
                                                    playgroundPrompt={playgroundPrompt}
                                                    setPlaygroundPrompt={setPlaygroundPrompt}
                                                    llmModel={llmModel}
                                                    setLLMModel={setLLMModel}
                                                    type={activeTab}
                                                    systemMessage={systemMessage}
                                                    setSystemMessage={setSystemMessage}
                                                    tempValue={tempValue}
                                                    setTempValue={setTempValue}
                                                    maxLengthValue={maxLengthValue}
                                                    setMaxLengthValue={setMaxLengthValue}
                                                    topPValue={topPValue}
                                                    setTopPValue={setTopPValue}
                                                    freqPenaltyValue={freqPenaltyValue}
                                                    setFreqPenaltyValue={setFreqPenaltyValue}
                                                    presencePenaltyValue={presencePenaltyValue}
                                                    setPresencePenaltyValue={setPresencePenaltyValue}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}