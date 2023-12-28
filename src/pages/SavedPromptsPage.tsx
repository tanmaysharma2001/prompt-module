import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion.tsx"
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";


// Types
import {ChainOfThoughtMessage, OneShotMessage, Prompt} from "@/lib/types.ts";

// Properly renders the Prompt Message
interface PromptRendererProps {
    prompt: Prompt;
}

const PromptRenderer: React.FC<PromptRendererProps> = ({prompt}) => {

    return (
        <div>
            {prompt.messages.map((message, index) => (
                <div key={index}>
                    {prompt.type === 'one-shot' && renderOneShotMessage(message)}
                    {prompt.type === "five-shot" && renderOneShotMessage(message)}
                    {prompt.type === 'chain-of-thought' && renderChainOfThoughtMessage(message)}
                </div>
            ))}
        </div>
    );
};

const renderOneShotMessage = (message: OneShotMessage) => (
    <div className={"flex flex-row space-x-1 items-center m-1"}>
        <p className={"inline-block font-bold text-base"}>{message.type.toUpperCase()}:</p>
        <p className={"inline-block"}>{message.message}</p>
    </div>
);

const renderChainOfThoughtMessage = (message: ChainOfThoughtMessage) => (
    <div>
        {message.type === 'USER' ?
            <>
                <div className={"flex flex-row space-x-1 items-center m-1"}>
                    <p className={"inline-block font-bold text-base"}>{message.type.toUpperCase()}:</p>
                    <p className={"inline-block"}>{message.message}</p>
                </div>
                <p>Thoughts: {message.thoughts?.join(', ')}</p>
            </> :
            <></>}
    </div>
);


interface PromptsListProps {
    prompts: Prompt[];
    setPrompts: (value: Prompt[]) => void;
}

const PromptsList: React.FC<PromptsListProps> = ({prompts, setPrompts}) => {

    const navigate = useNavigate();

    function handleDeletePrompt(promptToDelete: Prompt) {
        setPrompts(prompts.filter((prompt) => prompt.id !== promptToDelete.id));
    }

    // Change the current playground Prompt
    // Navigate to PlaygroundPage.
    function handlePlaygroundNavigation(prompt: Prompt) {
        sessionStorage.setItem("playgroundPrompt", JSON.stringify(prompt));
        navigate("/");
    }

    function handleCompareNavigation() {
        navigate("/compare");
    }

    return (
        <div>
            <Accordion type="multiple">
                {prompts.map((prompt: Prompt, idx: number) => {
                    return (
                        <div key={idx}>
                            <AccordionItem className={"m-1 border rounded-md"} value={`item-${idx + 1}`}>
                                <AccordionTrigger
                                    className={"overflow-clip h-10 bg-gray-100 p-5"}>{prompt.system_message}</AccordionTrigger>
                                <AccordionContent className={"bg-gray-100 p-5"}>
                                    <h1 className={"m-2 text-xl font-bold"}>Prompt
                                        Type: {prompt.type.toUpperCase()}</h1>
                                    <div className={"m-2"}>
                                        <h2 className={"text-xl font-bold"}>SYSTEM MESSAGE:</h2>{prompt.system_message}
                                    </div>
                                    <div className={"m-2"}>
                                        <h2 className={"text-xl font-bold"}>USER MESSAGE:</h2>
                                        <PromptRenderer prompt={prompt}/>
                                    </div>
                                    <div className={"mt-10 flex flex-row justify-between"}>
                                        <Button onClick={() => handleDeletePrompt(prompt)}
                                                className={"bg-red-500"}>Delete</Button>
                                        <div className={"flex flex-row space-x-2"}>
                                            <Button onClick={() => handlePlaygroundNavigation(prompt)}
                                                    className={""}>Playground</Button>
                                            <Button onClick={() => handleCompareNavigation()} className={""}>Compare</Button>
                                            {/*<Button className={"bg-blue-500"}>Production</Button>*/}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </div>
                    );
                })}
            </Accordion>
        </div>
    );
}


export default function SavedPromptsPage() {

    const [prompts, setPrompts] = useState<Prompt[]>(() => {
        const promptsJson = localStorage.getItem("savedPrompts");
        if (promptsJson) {
            const parsedSavedPrompts = JSON.parse(promptsJson);

            return parsedSavedPrompts.map((prompt: Prompt) => {
                return prompt;
            });
        }
        return promptsJson ? JSON.parse(promptsJson) : [];
    });

    // Save any changes in prompts to session storage!!
    useEffect(() => {
        localStorage.setItem("savedPrompts", JSON.stringify(prompts));
    }, [prompts]);

    return (
        <div className={"m-20 ml-40 mr-40"}>
            <div className={"flex flex-row m-6"}>
                <div>Prompts {"->"}</div>
                <div>
                    <Badge className={"inline-block"} variant="outline">Saved</Badge>
                </div>
            </div>
            <PromptsList prompts={prompts} setPrompts={setPrompts}/>
        </div>
    );
}