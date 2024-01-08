import React, { useState } from "react";

// ShadCN Components
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button.tsx";

// Other Components
import LoadingSpinner from "@/pages/PlaygroundPage/Components/PromptingTechniques/components/LoadingSpinner.tsx";

// Types
import { PromptTabProps, ReactPromptMessage, ReactResponse } from "@/lib/types.ts";

import {
    handleCompareNavigation,
    handleResetPrompt,
    handleSavingPrompt,
    sendingReactPromptRequest
} from "@/pages/PlaygroundPage/Components/PromptingTechniques/utils/UtilityFunctions.ts";
import { useToast } from "@/components/ui/use-toast.ts";

const REACT_PROMPT_COMPLETION_URL = import.meta.env.VITE_REACT_PROMPT_COMPLETION_URL;

interface MessageComponentProps {
    idx: number;
    type: string; // assuming type is a string, adjust as necessary
    message: string;
    onMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Adjust based on actual usage
    onMessageDelete: () => void; // Adjust if you need to pass any parameters
    reactResponses: ReactResponse | null;
    onActChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onThoughtChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onObservationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageComponent: React.FC<MessageComponentProps> = ({
    idx,
    type,
    message,
    onMessageChange,
    onMessageDelete,
    reactResponses,
    onActChange,
    onThoughtChange,
    onObservationChange,
}) => {
    return (
        <>
            <div id={"MessageComponent"} className="border-b-[1px] border-gray-300">
                <div
                    className="flex justify-between items-center w-full rounded-md p-4 bg-white text-left hover:bg-gray-100">
                    <div className={"basis-1/12 ml-5 text-left text-sm font-medium"}>{type}</div>
                    {type === 'USER' ?
                        <div className="basis-11/12 flex flex-row">
                            <input
                                className={"ml-8 text-base flex min-h-[8px] w-full rounded-md border-0 border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
                                value={message}
                                onChange={onMessageChange}
                                placeholder="Enter a user message here."
                            />
                            <MinusCircledIcon onClick={onMessageDelete} className={"m-3 h-5 w-5 hover:bg-gray-200"} />
                        </div>
                        :
                        <>
                            <MinusCircledIcon onClick={onMessageDelete} className={"m-3 h-5 w-5 hover:bg-gray-200"} />
                        </>
                    }
                </div>
                {reactResponses ?
                    <div>
                        <div className={"ml-8"}>
                            <div
                                className="flex justify-between items-center w-full rounded-md p-2 bg-white text-left hover:bg-gray-100">
                                <div className={"basis-2/12 ml-3 text-left text-sm font-medium"}>Thought {idx + 1}:
                                </div>
                                <div className={"basis-11/12 flex flex-row"}>
                                    <input
                                        className={"ml-8 text-base flex min-h-[4px] w-full rounded-md border-0 border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
                                        value={reactResponses.thought}
                                        onChange={(e) => onThoughtChange(e)}
                                        placeholder="Add a thought."
                                    />
                                </div>
                            </div>
                            <div
                                className="flex justify-between items-center w-full rounded-md p-2 bg-white text-left hover:bg-gray-100">
                                <div className={"basis-2/12 ml-3 text-left text-sm font-medium"}>Act {idx + 1}:
                                </div>
                                <div className={"basis-11/12 flex flex-row"}>
                                    <input
                                        className={"ml-8 text-base flex min-h-[4px] w-full rounded-md border-0 border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
                                        value={reactResponses.act}
                                        onChange={(e) => onActChange(e)}
                                        placeholder="Add a thought."
                                    />
                                </div>
                            </div>
                            <div
                                className="flex justify-between items-center w-full rounded-md p-2 bg-white text-left hover:bg-gray-100">
                                <div className={"basis-2/12 ml-3 text-left text-sm font-medium"}>Observation {idx + 1}:
                                </div>
                                <div className={"basis-11/12 flex flex-row"}>
                                    <input
                                        className={"ml-8 text-base flex min-h-[4px] w-full rounded-md border-0 border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
                                        value={reactResponses.observation}
                                        onChange={(e) => onObservationChange(e)}
                                        placeholder="Add a thought."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div></div>
                }
            </div>
        </>
    );
};


export default function ReactPrompting(props: PromptTabProps) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [messages, setMessages] = useState<ReactPromptMessage[]>(props.playgroundPrompt.messages.length !== 0 ? props.playgroundPrompt.messages : [{
        type: "USER",
        message: "",
        reactResponses: null
    }]);

    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    // const [errorMessage, setErrorMessage] = useState("");

    // useEffect(() => {
    //     const updatedPlaygroundPrompt: Prompt = {
    //         ...props.playgroundPrompt,
    //         messages: messages
    //     }
    //
    //     props.setPlaygroundPrompt(updatedPlaygroundPrompt);
    // }, [messages])

    function handleMessageChange(index: number, value: string) {
        const newMessages = messages.map((message, i) => {
            if (i === index) {
                return { ...message, message: value };
            }
            return message;
        })

        setMessages(newMessages);
    }

    function handleMessageDelete(index: number) {
        setMessages(messages.filter((_, idx) => idx !== index));
    }


    // React Responses Changes
    function handleActChange(messageIndex: number, actValue: string) {
        const newMessages = messages.map((message, index) => {
            if (index === messageIndex) {
                return {
                    ...message,
                    reactResponses: message.reactResponses ? {
                        ...message.reactResponses,
                        act: actValue,
                    } : null
                }
            }
            return message;
        });

        setMessages(newMessages);
    }

    function handleThoughtChange(messageIndex: number, thoughtValue: string) {
        const newMessages = messages.map((message, index) => {
            if (index === messageIndex) {
                return {
                    ...message,
                    reactResponses: message.reactResponses ? {
                        ...message.reactResponses,
                        thought: thoughtValue,
                    } : null
                }
            }
            return message;
        });

        setMessages(newMessages);
    }

    function handleObservationChange(messageIndex: number, observationValue: string) {
        const newMessages = messages.map((message, index) => {
            if (index === messageIndex) {
                return {
                    ...message,
                    reactResponses: message.reactResponses ? {
                        ...message.reactResponses,
                        observation: observationValue,
                    } : null
                }
            }
            return message;
        });

        setMessages(newMessages);
    }


    function addMessageComponent() {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.type === "USER") {
                setMessages(
                    [...messages,
                    {
                        type: "ASSISTANT",
                        message: "",
                        reactResponses: {
                            thought: "",
                            act: "",
                            observation: ""
                        }
                    }
                    ]
                );
            } else {
                setMessages([...messages, { type: "USER", message: "", reactResponses: null }]);
            }
        } else {
            setMessages([...messages, { type: "USER", message: "", reactResponses: null }]);
        }
    }


    function handleSubmit() {
        if (isSubmitting) return;

        const lastMessage = [...messages].reverse().find(message => message.type === "USER" && message.message !== "");

        if (!lastMessage) {
            alert("User Message doesn't exists!");
            return;
        }

        if (!lastMessage.message.trim()) {
            alert("User message is required.");
            return;
        }

        const UserMessage = messages.map((message) => {
            if (message.type === 'USER') {
                return "USER: " + message.message + "\n";
            } else {
                return "ASSISTANT:\nThought: " + message.reactResponses?.thought + "\nAct: " + message.reactResponses?.act + "\nObservation: " + message.reactResponses?.observation + ".";
            }
        });


        sendingReactPromptRequest(
            REACT_PROMPT_COMPLETION_URL,
            props,
            UserMessage.join(""),
            setIsLoading,
            setIsSubmitting,
            setMessages,
            messages
        )
    }

    function handleSave() {
        if (handleSavingPrompt(
            isSaving,
            messages,
            setIsSaving,
            props
        )) {
            toast({
                title: "Prompt Saved!"
            })
        }
        else {
            toast({
                title: "Error occurred while saving the prompt."
            })
        }
    }

    function handleCompare() {
        handleCompareNavigation(props)
    }

    function handleReset() {
        handleResetPrompt(
            props,
            setMessages,
            [{
                type: "USER",
                message: "",
                reactResponses: null
            }]
        )
    }


    return (
        <>
            <div className="lg:min-h-[100px] m-4">
                <ScrollArea className="h-[550px] w-full rounded-md">
                    {messages.map((message, index) => (
                        <MessageComponent
                            key={index}
                            idx={Math.floor(index / 2)}
                            type={message.type}
                            onMessageDelete={() => handleMessageDelete(index)}
                            onMessageChange={(e) => handleMessageChange(index, e.target.value)}
                            message={message.message}
                            reactResponses={message.reactResponses}
                            onActChange={(e) => handleActChange(index, e.target.value)}
                            onThoughtChange={(e) => handleThoughtChange(index, e.target.value)}
                            onObservationChange={(e) => handleObservationChange(index, e.target.value)}
                        />
                    ))}
                    {isLoading ? <LoadingSpinner /> : <></>}
                    <div className="text-left hover:bg-gray-100 p-2">
                        <button className="ml-4 flex text-sm font-medium items-center space-x-2 p-2 rounded-md"
                            onClick={addMessageComponent}>
                            <PlusCircledIcon className={"mr-3 h-3 w-3"} /> Add Message
                        </button>
                    </div>
                </ScrollArea>
            </div>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                    <Button onClick={handleSubmit}>Submit</Button>
                    <Button onClick={handleCompare}>Compare</Button>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleReset}>Reset</Button>
                </div>
            </div>
        </>
    );
}