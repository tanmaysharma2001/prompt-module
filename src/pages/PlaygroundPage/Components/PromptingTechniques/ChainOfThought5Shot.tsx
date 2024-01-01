import {useState} from "react";

// Icons
import { MinusCircledIcon, PlusCircledIcon} from "@radix-ui/react-icons";

// ShadCN Components
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Button} from "@/components/ui/button.tsx";

// Types
import {Prompt, ChainOfThoughtMessage, PromptTabProps} from "@/lib/types.ts";


interface MessageComponentProps {
    type: string;
    message: string;
    onMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteMessage: () => void;
    thoughts: string[] | null;
    onThoughtChange: (event: React.ChangeEvent<HTMLInputElement>, thoughtIndex: number) => void;
    onAddThought: () => void;
    deleteThought: (thoughtIndex: number) => void;
}


const MessageComponent: React.FC<MessageComponentProps> = ({
                              type,
                              message,
                              deleteMessage,
                              onMessageChange,
                              thoughts,
                              onThoughtChange,
                              onAddThought,
                              deleteThought
                          }) => {
    return (
        <>
            <div id={"userMessageComponent"} className={"border-b-[1px] border-gray-300"}>
                <>
                    <div
                        className="flex justify-between items-center w-full rounded-md p-2 bg-white text-left hover:bg-gray-100">
                        <div className={"basis-1/12 ml-5 text-left text-sm font-medium"}>{type}</div>
                        <div className={"basis-11/12 flex flex-row"}>
                            <input
                                className={"ml-8 text-base flex min-h-[8px] w-full rounded-md border-0 border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
                                value={message}
                                onChange={onMessageChange}
                                placeholder="Enter a user message here."
                            />
                            <MinusCircledIcon onClick={deleteMessage} className={"m-3 h-5 w-5 hover:bg-gray-200"}/>
                        </div>
                    </div>
                </>
                {thoughts ? <div>
                    <div className="flex justify-between items-center w-full rounded-md p-2 bg-white text-left">
                        <div className={"basis-1/12 ml-2 text-left text-base font-medium"}>Assistant</div>
                    </div>
                    <div>
                        {thoughts.map((thought, index) => (
                            <div key={index}
                                 className="flex justify-between items-center w-full rounded-md p-2 bg-white text-left hover:bg-gray-100">
                                {/*<p className={"text-left w-40 font-medium"}>Thought {index + 1}:</p>*/}
                                <div className={"basis-2/12 ml-3 text-left text-sm font-medium"}>Thought {index + 1}:
                                </div>
                                <div className={"basis-11/12 flex flex-row"}>
                                    <input
                                        className={"ml-8 text-base flex min-h-[4px] w-full rounded-md border-0 border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
                                        value={thought}
                                        onChange={(e) => onThoughtChange(e, index)}
                                        placeholder="Add a thought."
                                    />
                                    <MinusCircledIcon onClick={() => deleteThought(index)}
                                                      className={"m-3 h-5 w-5 hover:bg-gray-200"}/>
                                </div>
                            </div>
                        ))}
                        <div className="text-left hover:bg-gray-100 p-2">
                            <button className="ml-4 flex text-sm font-medium items-center space-x-2 p-2 rounded-md"
                                    onClick={onAddThought}>
                                <PlusCircledIcon className={"mr-3 h-3 w-3"}/> Add Thought
                            </button>
                        </div>
                    </div>
                </div> : <></>}
            </div>
        </>
    );
};


export default function ChainOfThought(props: PromptTabProps) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [messages, setMessages] = useState<ChainOfThoughtMessage[]>(props.playgroundPrompt.messages.length !== 0 ? props.playgroundPrompt.messages : [
        {type: "USER", message: "", thoughts: ["", "", ""]},
        {type: "ASSISTANT", message: "", thoughts: null},
        {type: "USER", message: "", thoughts: ["", "", ""]},
        {type: "ASSISTANT", message: "", thoughts: null},
        {type: "USER", message: "", thoughts: ["", "", ""]},
        {type: "ASSISTANT", message: "", thoughts: null},
        {type: "USER", message: "", thoughts: ["", "", ""]},
        {type: "ASSISTANT", message: "", thoughts: null},
        {type: "USER", message: "", thoughts: ["", "", ""]},
        {type: "ASSISTANT", message: "", thoughts: null},
    ]);

    const MAX_THOUGHTS_LIMIT = 5;

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
                setMessages([...messages, {type: "ASSISTANT", message: "", thoughts: null}]);
            } else {
                setMessages([...messages, {type: "USER", message: "", thoughts: ["", "", ""]}]);
            }
        } else {
            setMessages([...messages, {type: "USER", message: "", thoughts: ["", "", ""]}]);
        }
    };

    const handleThoughtChange = (messageIndex: number, thoughtIndex: number, value: string) => {
        setMessages(messages => messages.map((message, index) => {
            if (index === messageIndex) {
                return {
                    ...message,
                    thoughts: message.thoughts ? message.thoughts.map((thought, idx) =>
                        idx === thoughtIndex ? value : thought) : message.thoughts
                };
            }
            return message;
        }));
    };

    const deleteThought = (messageIndex: number, thoughtIndex: number) => {
        setMessages(messages => messages.map((message, index) => {
            if (index === messageIndex) {
                return {
                    ...message,
                    thoughts: message.thoughts ? message.thoughts.filter((_, idx) => idx !== thoughtIndex) : message.thoughts,
                }
            }
            return message;
        }))
    }

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

        let LastUserMessage: ChainOfThoughtMessage = {
            type: 'USER',
            message: "",
            thoughts: null,
        };

        for (let i = messages.length - 1; i >= 10; i--) {
            if (messages[i].type === 'USER') {
                LastUserMessage.message = messages[i].message;
                LastUserMessage.thoughts = messages[i].thoughts;
                break;
            }
        }

        if (LastUserMessage.message === "" || LastUserMessage.thoughts === null) {
            alert("Provide a prompt for the 5-Shot Testing");
            return;
        }

        let LastuserMessageString: string = LastUserMessage.message;

        // Merge all the Default User Messages with the default message one!
        messages.forEach((msg, idx) => {
            if (idx % 2 === 0 && idx < 9) {
                const userMessage = `UM: ${msg.message}`;
                const thoughts = `Thoughts: ${LastUserMessage?.thoughts?.join(' ')}`;
                const assistantMessage = `A: ${messages[idx + 1].message}`;
                LastuserMessageString = `${userMessage}, ${thoughts}, ${assistantMessage}. ` + LastuserMessageString
            }
        })

        // Merge all thoughts
        LastuserMessageString = LastUserMessage.thoughts.join(' ') + LastuserMessageString;

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

        console.log(LastuserMessageString);

        const requestData = {
            api_key: api_key,
            model: props.llmModel,
            system_message: props.systemMessage, // Assuming systemMessage is passed as a prop
            user_message: LastuserMessageString,
            temperature: props.tempValue[0].toString(),
            maxLength: props.maxLengthValue[0].toString(),
            topP: props.topPValue[0].toString(),
            frequencyPenalty: props.freqPenaltyValue[0].toString(),
            presencePenalty: props.presencePenaltyValue[0].toString()
        };

        console.log(requestData);

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
                setMessages([...messages, {type: "ASSISTANT", message: data.message, thoughts: null}]);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }

    const addThought = (messageIndex: number) => {

        // Access the specific message by index
        const targetMessage = messages[messageIndex];

        if (targetMessage && targetMessage.thoughts && targetMessage.thoughts.length >= MAX_THOUGHTS_LIMIT) {
            alert("Maximum number of thoughts reached.");
            return;
        }

        setMessages(messages => messages.map((message, index) => {
            if (index === messageIndex) {
                return {
                    ...message,
                    thoughts: message.thoughts ? [...message.thoughts, ""] : [""]
                };
            }
            return message;
        }));
    };

    function handleSave() {
        if (isSaving) return;

        if (messages.length === 0) {
            alert("User Message doesn't exists!");
            return;
        }

        setIsSaving(true);


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

    function handleCompare() {

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
            {type: "USER", message: "", thoughts: ["", "", ""]},
            {type: "ASSISTANT", message: "", thoughts: null},
            {type: "USER", message: "", thoughts: ["", "", ""]},
            {type: "ASSISTANT", message: "", thoughts: null},
            {type: "USER", message: "", thoughts: ["", "", ""]},
            {type: "ASSISTANT", message: "", thoughts: null},
            {type: "USER", message: "", thoughts: ["", "", ""]},
            {type: "ASSISTANT", message: "", thoughts: null},
            {type: "USER", message: "", thoughts: ["", "", ""]},
            {type: "ASSISTANT", message: "", thoughts: null},
        ]);
    }


    return (
        <>
            <div className="lg:min-h-[100px]">
                <ScrollArea className="h-[550px] w-full rounded-md">
                    {messages.map((message, index) => (
                        <MessageComponent
                            key={index}
                            // userMessage={message.userMessage}
                            message={message.message}
                            type={message.type}
                            thoughts={message.thoughts}
                            // assistantResponse={message.assistantResponse}
                            onMessageChange={(e) => handleMessageChange(index, e.target.value)}
                            deleteMessage={() => handleMessageDelete(index)}
                            onThoughtChange={(e, thoughtIndex) => handleThoughtChange(index, thoughtIndex, e.target.value)}
                            onAddThought={() => addThought(index)}
                            deleteThought={(thoughtIndex) => deleteThought(index, thoughtIndex)}
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
                    <Button onClick={handleCompare}>Compare</Button>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleReset}>Reset</Button>
                </div>
            </div>
        </>
    );
}