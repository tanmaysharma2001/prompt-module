import { useState } from "react";

// Icons
import {MinusCircledIcon, PlusCircledIcon} from "@radix-ui/react-icons";

// SHADCN Components
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Button} from "@/components/ui/button.tsx";

import {Prompt, PromptTabProps, OneShotMessage} from "@/lib/types.ts";


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


export default function FiveShot(props: PromptTabProps) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [messages, setMessages] = useState<OneShotMessage[]>(props.playgroundPrompt.messages.length !== 0 ? props.playgroundPrompt.messages : [
        {type: "USER", message: ""},
        {type: "ASSISTANT", message: ""},
        {type: "USER", message: ""},
        {type: "ASSISTANT", message: ""},
        {type: "USER", message: ""},
        {type: "ASSISTANT", message: ""},
        {type: "USER", message: ""},
        {type: "ASSISTANT", message: ""},
        {type: "USER", message: ""},
        {type: "ASSISTANT", message: ""},
    ]);

    const [isSaving, setIsSaving] = useState(false);

    const handleMessageChange = (index: number, value: string) => {
        const newMessages = messages.map((message, i) => {
            if (i === index) {
                return {...message, message: value}
            }
            return message;
        })

        setMessages(newMessages);
    }

    const handleMessageDelete = (index: number) => {
        setMessages(messages.filter((_, idx) => idx !== index))
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

        // Check If Five User Messages and Assistant Messages are present.
        // Check They are not empty
        // Merge Them
        // Check if any message is empty

        if (messages.length < 10) {
            alert('Not all 5-Shot messages are provided.')
            return;
        }

        for (let i = 0; i < 10; i += 2) {
            if (messages[i].type === "USER" && messages[i + 1].type === "ASSISTANT") {
                if (messages[i].message.trim() === "" || messages[i + 1].message.trim() === "") {
                    alert("One of the default 5-Shot Messages is empty");
                    return;
                }
            } else {
                alert("One of the Pair in 5-Shot is missing.");
                return;
            }
        }

        let UserMessage: string | null = null;

        for (let i = messages.length - 1; i >= 10; i--) {
            if (messages[i].type === 'USER') {
                UserMessage = messages[i].message;
                break;
            }
        }

        if (UserMessage === null) {
            alert("Provide a prompt for the 5-Shot Testing");
            return;
        }

        // Merge all the Default User Messages with the default message one!
        messages.forEach((msg, idx) => {
            if (idx % 2 === 0 && idx < 9) {
                const userMessage = `UM: ${msg.message}`;
                const assistantMessage = `A: ${messages[idx + 1].message}`;
                UserMessage = `${userMessage}, ${assistantMessage}. ` + UserMessage
            }
        })

        // Step 1: Check if there is an existing array in local storage
        const existingKeys = localStorage.getItem('apiKeys');

        // Step 2: Parse the existing array or create a new empty array
        let keysArray = existingKeys ? JSON.parse(existingKeys) : [];

        if (keysArray.length === 0) {
            alert("You don't have any API Key Stored!");
            return ;
        }

        const KeyObject = keysArray.find((key: { model: string, key: string }) => key.model === props.llmModel);

        if(!KeyObject) {
            alert("You don't have the API Key for the model selected.");
            return ;
        }

        const api_key = KeyObject.api_key;

        setIsSubmitting(true);

        const requestData = {
            api_key: api_key,
            model: props.llmModel,
            system_message: props.systemMessage, // Assuming systemMessage is passed as a prop
            user_message: UserMessage,
            temperature: props.tempValue[0].toString(),
            maxLength: props.maxLengthValue[0].toString(),
            topP: props.topPValue[0].toString(),
            frequencyPenalty: props.freqPenaltyValue[0].toString(),
            presencePenalty: props.presencePenaltyValue[0].toString()
        };

        fetch('http://3.82.25.134:8000/prompt-completion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.message === undefined) {
                    throw new Error('Invalid response from the server');
                }
                setMessages([...messages, {type: "ASSISTANT", message: data.message}]);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });

    }

    const handleSave = () => {
        if (isSaving) return;

        // const lastMessage = [...messages].reverse().find(message => message.type === "USER");

        if (messages.length === 0) {
            alert("User Message doesn't exists!");
            return;
        }

        setIsSaving(true);

        console.log('hello world')


        // Step 1: Check if there is an existing array in local storage
        const existingPrompts = localStorage.getItem('savedPrompts');

        // Step 2: Parse the existing array or create a new empty array
        let promptsArray = existingPrompts ? JSON.parse(existingPrompts) : [];

        // Check if a prompt with the same id already exists
        const existingPromptIndex = promptsArray.findIndex((prompt: Prompt) => prompt.id === props.playgroundPrompt.id);

        if (existingPromptIndex !== -1) {
            // If prompt with the same id exists, update it
            promptsArray[existingPromptIndex] = {
                id: props.playgroundPrompt.id,
                type: props.type,
                model: props.llmModel,
                system_message: props.systemMessage, // Assuming systemMessage is passed as a prop
                messages: messages,
                temperature: props.tempValue[0].toString(),
                maxLength: props.maxLengthValue[0].toString(),
                topP: props.topPValue[0].toString(),
                frequencyPenalty: props.freqPenaltyValue[0].toString(),
                presencePenalty: props.presencePenaltyValue[0].toString()
            };
        } else {
            // If prompt with the same id doesn't exist, append the new one
            const requestData: Prompt = {
                id: promptsArray.length + 1,
                type: props.type,
                model: props.llmModel,
                system_message: props.systemMessage, // Assuming systemMessage is passed as a prop
                messages: messages,
                temperature: props.tempValue[0].toString(),
                maxLength: props.maxLengthValue[0].toString(),
                topP: props.topPValue[0].toString(),
                frequencyPenalty: props.freqPenaltyValue[0].toString(),
                presencePenalty: props.presencePenaltyValue[0].toString()
            };
            promptsArray.push(requestData);
        }

        // Step 4: Save the updated array back to local storage
        localStorage.setItem('savedPrompts', JSON.stringify(promptsArray));

        setIsSaving(false);
    }


    function handleReset() {
        const existingPrompts = localStorage.getItem('savedPrompts');

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


        sessionStorage.setItem("playgroundPrompt", JSON.stringify(prompt));

        props.setPlaygroundPrompt(prompt);
        props.setSystemMessage(prompt.system_message);
        props.setLLMModel(prompt.model);
        props.setTempValue([0.56])
        props.setMaxLengthValue([256]);
        props.setTopPValue([0.9])
        props.setFreqPenaltyValue([0.9])
        props.setPresencePenaltyValue([1])
        setMessages([
            {type: "USER", message: ""},
            {type: "ASSISTANT", message: ""},
            {type: "USER", message: ""},
            {type: "ASSISTANT", message: ""},
            {type: "USER", message: ""},
            {type: "ASSISTANT", message: ""},
            {type: "USER", message: ""},
            {type: "ASSISTANT", message: ""},
            {type: "USER", message: ""},
            {type: "ASSISTANT", message: ""},
        ]);
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
                    <Button onClick={handleSubmit}>Submit</Button>
                    <Button onClick={handleSubmit}>Compare</Button>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleReset}>Reset</Button>
                </div>
            </div>
        </>
    )
}