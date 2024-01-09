import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx"
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";


// Types
import { ChainOfThoughtMessage, OneShotMessage, Prompt, ReactPromptMessage } from "@/lib/types.ts";

// Properly renders the Prompt Message
interface PromptRendererProps {
    prompt: Prompt;
}

const PromptRenderer: React.FC<PromptRendererProps> = ({ prompt }) => {

    return (
        <div>
            {prompt.messages.map((message, index) => (
                <div key={index}>
                    {prompt.type === 'one-shot' && renderOneShotMessage(message)}
                    {prompt.type === "five-shot" && renderOneShotMessage(message)}
                    {prompt.type === 'chain-of-thought' && renderChainOfThoughtMessage(message)}
                    {prompt.type === 'cot+5-shot' && renderChainOfThoughtMessage(message)}
                    {prompt.type === 'react' && renderReactPromptMessage(message, index)}
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
        <div className={"flex flex-row space-x-1 items-center m-1"}>
            <p className={"inline-block font-bold text-base"}>{message.type.toUpperCase()}:</p>
            <p className={"inline-block"}>{message.message}</p>
        </div>
        {message.type === 'USER' ?
            <>
                <p>Thoughts:</p>
                {message.thoughts?.map((thought) => {
                    return (
                        <div>
                            {thought}
                        </div>
                    );
                })}
            </> :
            <></>}
    </div>
);


const renderReactPromptMessage = (message: ReactPromptMessage, idx: number) => (
    <div>
        {message.type === 'USER' ?
            <>
                <div className={"flex flex-row space-x-1 items-center m-1"}>
                    <p className={"inline-block font-bold text-base"}>{message.type.toUpperCase()}:</p>
                    <p className={"inline-block"}>{message.message}</p>
                </div>
            </> :
            <>
                <div className={"flex flex-row space-x-1 items-center m-1"}>
                    <p className={"inline-block font-bold text-base"}>{message.type.toUpperCase()}:</p>
                </div>
                <p className="m-1">
                    {`Act ${Math.floor(idx / 2) + 1}: ${message.reactResponses?.act}`} <br />
                    {`Thought ${Math.floor(idx / 2) + 1}: ${message.reactResponses?.thought}`} <br />
                    {`Observation ${Math.floor(idx / 2) + 1}: ${message.reactResponses?.observation}`} <br />
                </p>
            </>}
    </div>
)


interface PromptsListProps {
    prompts: Prompt[];
    setPrompts: (value: Prompt[]) => void;
    setActivePage: (value: string) => void;
}

const PromptsList: React.FC<PromptsListProps> = ({ prompts, setPrompts, setActivePage }) => {

    function handleDeletePrompt(promptToDelete: Prompt) {
        setPrompts(prompts.filter((prompt) => prompt.id !== promptToDelete.id));
    }

    // Change the current playground Prompt
    // Navigate to PlaygroundPage.
    function handlePlaygroundNavigation(prompt: Prompt) {
        sessionStorage.setItem("playgroundPrompt", JSON.stringify(prompt));
        setActivePage("Playground");
    }

    function handleCompareNavigation() {
        setActivePage("Compare");
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
                                        <PromptRenderer prompt={prompt} />
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

interface PageProps {
    prompts: Prompt[];
    setPrompts: (value: Prompt[]) => void;
    currentUser: string;
    setActivePage: (value: string) => void;
}

export default function SavedPromptsPage(props: PageProps) {
    return (
        <div className={"m-5 ml-10 mr-10"}>
            <div className={"flex flex-row m-6"}>
                <div>Prompts {"->"}</div>
                <div>
                    <Badge className={"inline-block ml-2 "} variant="outline">Saved</Badge>
                </div>
            </div>
            <PromptsList prompts={props.prompts} setPrompts={props.setPrompts} setActivePage={props.setActivePage} />
        </div>
    );
}