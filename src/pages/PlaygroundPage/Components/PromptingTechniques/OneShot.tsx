import { useState } from "react";


// Icons
import {PlusCircledIcon} from "@radix-ui/react-icons";
import {MinusCircledIcon} from "@radix-ui/react-icons";

// SHADCN Components
import {Button} from "@/components/ui/button.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx"

// Other Components
import LoadingSpinner from "@/pages/PlaygroundPage/Components/PromptingTechniques/components/LoadingSpinner.tsx";

// Types
import { OneShotMessage, PromptTabProps} from "@/lib/types.ts";

// Utilities Functions
import {
    handleCompareNavigation, handleResetPrompt,
    handleSavingPrompt,
    sendingOneShotRequest
} from "@/pages/PlaygroundPage/Components/PromptingTechniques/utils/UtilityFunctions.ts";
import {useToast} from "@/components/ui/use-toast.ts";

const PROMPT_COMPLETION_URL = import.meta.env.VITE_PROMPT_COMPLETION_URL;

interface MessageComponentProps {
    type: string; // assuming type is a string, adjust as necessary
    message: string;
    onMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Adjust based on actual usage
    onMessageDelete: () => void; // Adjust if you need to pass any parameters
}

const MessageComponent: React.FC<MessageComponentProps> = ({type, message, onMessageChange, onMessageDelete}) => {
    return (
        <>
            <div id={"MessageComponent"} className="border-b-[1px] border-gray-300">
                <div
                    className="flex justify-between items-center w-full rounded-md p-4 bg-white text-left hover:bg-gray-100">
                    <div className={"basis-1/12 ml-5 text-left text-sm font-medium"}>{type}</div>
                    <div className="basis-11/12 flex flex-row">
                        <input
                            className={"ml-8 text-base flex min-h-[8px] w-full rounded-md border-0 border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
                            value={message}
                            onChange={onMessageChange}
                            placeholder="Enter a user message here."
                        />
                        <MinusCircledIcon onClick={onMessageDelete} className={"m-3 h-5 w-5 hover:bg-gray-200"}/>
                    </div>
                </div>
            </div>
        </>
    );
};


export default function OneShot(props: PromptTabProps) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [messages, setMessages] = useState<OneShotMessage[]>(props.playgroundPrompt.messages.length !== 0 ? props.playgroundPrompt.messages : [{
        type: "USER",
        message: ""
    }]);

    const [isLoading, setIsLoading] = useState(false);
    // const [errorMessage, setErrorMessage] = useState("");

    const { toast } = useToast();

    const handleMessageChange = (index: number, value: string) => {
        const newMessages = messages.map((message, i) => {
            if (i === index) {
                return {...message, message: value};
            }
            return message;
        });

        setMessages(newMessages);
    };

    const handleMessageDelete = (index: number) => {
        setMessages(messages.filter((_, idx) => idx !== index));
    }

    const addMessageComponent = () => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.type === "USER") {
                setMessages([...messages, {type: "ASSISTANT", message: ""}]);
            } else {
                setMessages([...messages, {type: "USER", message: ""}]);
            }
        } else {
            setMessages([...messages, {type: "USER", message: ""}]);
        }
    };


    const handleSubmit = () => {

        if (isSubmitting) return;

        const lastMessage = [...messages].reverse().find(message => message.type === "USER");

        if (!lastMessage) {
            alert("User Message doesn't exists!");
            return;
        }

        if (!lastMessage.message?.trim()) {
            alert("User message is required.");
            return;
        }

        sendingOneShotRequest(
            PROMPT_COMPLETION_URL,
            props,
            lastMessage.message.toString(),
            setIsLoading,
            setIsSubmitting,
            setMessages,
            messages,
        );
    };


    const handleSave = () => {
        if(handleSavingPrompt(
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


    const handleCompare = () => {
        handleCompareNavigation(props);
    }

    function handleReset() {
        handleResetPrompt(
            props,
            setMessages,
            [{type: "USER", message: ""}]
        )
    }


    return (
        <>
            <div className="lg:min-h-[100px] m-4">
                <ScrollArea className="h-[550px] w-full rounded-md">
                    {messages.map((message, index) => (
                        <MessageComponent
                            key={index}
                            type={message.type}
                            onMessageDelete={() => handleMessageDelete(index)}
                            onMessageChange={(e) => handleMessageChange(index, e.target.value)}
                            message={message.message}
                        />
                    ))}
                    {isLoading ? <LoadingSpinner/> : <></>}
                    <div className="text-left hover:bg-gray-100 p-2">
                        <button className="ml-4 flex text-sm font-medium items-center space-x-2 p-2 rounded-md"
                                onClick={addMessageComponent}>
                            <PlusCircledIcon className={"mr-3 h-3 w-3"}/> Add Message
                        </button>
                    </div>
                </ScrollArea>
            </div>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                    <Button disabled={isLoading} onClick={handleSubmit}>Submit</Button>
                    <Button onClick={handleCompare}>Compare</Button>
                    <Button disabled={isSaving} onClick={handleSave}>Save</Button>
                    <Button onClick={handleReset}>Reset</Button>
                </div>
            </div>
        </>
    )
}