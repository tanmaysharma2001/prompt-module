import {useEffect, useState} from "react";

// Shadcn Components
import {Badge} from "@/components/ui/badge.tsx"
import {Button} from "@/components/ui/button.tsx";

// Types
import {APIKey, Prompt} from "@/lib/types.ts";

interface UserMessagesProp {
    prompt: Prompt;
}

const UserMessages: React.FC<UserMessagesProp> = ({prompt}) => {

    return (
        <div>
            {prompt.type === 'one-shot'
                ?
                <div>
                    <textarea
                        id={`userMessageBox-${prompt.id}`}
                        value={
                            prompt.messages.map((message) => {
                                return `${message.type}: ${message.message}`;
                            }).join("\n\n")
                        }
                        className="flex min-h-[220px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder=""
                    >
                        </textarea>
                </div>
                :
                <></>}
            {prompt.type === 'chain-of-thought'
                ?
                <div>
                    <textarea
                        id={`userMessageBox-${prompt.id}`}
                        value={
                            prompt.messages.map((message) => {
                                const formattedThoughts = message.thoughts
                                    ? message.thoughts.map((thought: string, index: number) => `Thought ${index + 1}: ${thought}`).join('\n')
                                    : '';
                                return `${message.type}: ${message.message}\n${formattedThoughts}`;
                            }).join("\n\n")
                        }
                        className="flex min-h-[220px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder=""
                    >
                        </textarea>
                </div>
                : <></>
            }
            {prompt.type === 'five-shot' ?
                <div>
                    <textarea
                        id={`userMessageBox-${prompt.id}`}
                        value={
                            prompt.messages.map((message) => {
                                return `${message.type}: ${message.message}`;
                            }).join("\n\n")
                        }
                        className="flex min-h-[220px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder=""
                    >
                        </textarea>
                </div>
                : <></>}
            {prompt.type === 'cot+5-shot' ?
                <div>
                    <textarea
                        id={`userMessageBox-${prompt.id}`}
                        value={
                            prompt.messages.map((message) => {
                                const formattedThoughts = message.thoughts
                                    ? message.thoughts.map((thought: string, index: number) => `Thought ${index + 1}: ${thought}`).join('\n')
                                    : '';
                                return `${message.type}: ${message.message}\n${formattedThoughts}`;
                            }).join("\n\n")
                        }
                        className="flex min-h-[220px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder=""
                    >
                        </textarea>
                </div>
                : <></>}
        </div>
    );
}


interface TableComponentProps {
    prompts: Prompt[];
    setPrompts: (value: Prompt[]) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({prompts, setPrompts}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    // View Prompts: Duplicate use to modify prompts view without the need of modifying the original prompts.
    // Change in prompts also results in change in viewPrompts as both are reloaded when the component is reloaded.
    const [viewPrompts, setViewPrompts] = useState<Prompt[]>(prompts);

    const [promptResponses, setPromptResponses ] = useState(() => {
        return viewPrompts.map((prompt) => {
            return {
                id: prompt.id,
                response: "",
            };
        });
    })

    function handleSubmit(prompt: Prompt) {

        if (isSubmitting) return;

        // Step 1: Check if there is an existing array in local storage
        const existingKeys = localStorage.getItem('apiKeys');

        // Step 2: Parse the existing array or create a new empty array
        let keysArray = existingKeys ? JSON.parse(existingKeys) : [];

        if (keysArray.length === 0) {
            alert("You don't have any API Key Stored!");
            return ;
        }

        const KeyObject = keysArray.find((key: APIKey) => key.model === prompt.model);

        if(!KeyObject) {
            alert("You don't have the API Key for the model selected.");
            return ;
        }

        const api_key = KeyObject.api_key;

        const UserMessageBox = document.getElementById(`userMessageBox-${prompt.id}`) as HTMLTextAreaElement;

        if (!UserMessageBox) {
            alert('User Message not provided');
            return ;
        }

        const UserMessage = UserMessageBox.value;

        setIsSubmitting(true);

        const requestData = {
            api_key: api_key,
            model: prompt.model,
            system_message: prompt.system_message,
            user_message: UserMessage,
            temperature: prompt.temperature,
            maxLength: prompt.maxLength,
            topP: prompt.topP,
            frequencyPenalty: prompt.frequencyPenalty,
            presencePenalty: prompt.presencePenalty,
        };

        console.log(requestData);

        fetch('http://localhost:8000/prompts/one-shot-completion', {
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

                setPromptResponses(promptResponses.map((promptResponse) => {
                    if (promptResponse.id === prompt.id) {
                        return {
                            ...promptResponse,
                            response: data.message
                        }
                    }
                    return promptResponse;
                }))

                setViewPrompts(viewPrompts.map((prompt, idx) => {
                    if (idx === prompt.id) {
                        return {
                            ...prompt,
                            response: data.message,
                        }
                    }
                    return prompt;
                }))

            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }

    function handleSave(index: number) {

        setPrompts(prompts.map((prompt, idx) => {
            if (idx === index) {
                console.log(idx);
                return viewPrompts[index];
            }
            return prompt;
        }));
    }


    return (
        <div className={"flex flex-row"}>
            {viewPrompts.map((prompt, idx) => (
                <div className="flex flex-col w-80">
                    <div className="text-center">
                        <div>
                            {prompt.model.toUpperCase()}
                        </div>
                        {/*<svg*/}
                        {/*    xmlns="http://www.w3.org/2000/svg"*/}
                        {/*    fill="none"*/}
                        {/*    viewBox="0 0 24 24"*/}
                        {/*    stroke-width="1.5"*/}
                        {/*    stroke="currentColor"*/}
                        {/*    className="mt-1 ml-1 w-4 h-4"*/}
                        {/*    onClick={(e) => {*/}
                        {/*        handleModelOpen(prompt.id);*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <path*/}
                        {/*        stroke-linecap="round"*/}
                        {/*        stroke-linejoin="round"*/}
                        {/*        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"*/}
                        {/*    />*/}
                        {/*</svg>*/}
                        <div>
                            {prompt.type.toUpperCase()}
                        </div>
                    </div>
                    <div className="p-2">
                        <div className={"p-2"}>
                            System Message
                        </div>
                        <div className="p-2">
                            <textarea
                                id="systemMessage"
                                value={prompt.system_message}
                                className="flex min-h-[220px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder=""
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className="p-2">
                        <div className={"p-2"}>
                            User Message
                        </div>
                        {/*<textarea*/}
                        {/*    id="userMessage"*/}
                        {/*    className="flex min-h-[220px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"*/}
                        {/*    placeholder=""*/}
                        {/*>*/}
                        {/*    {prompt.messages}*/}
                        {/*</textarea>*/}
                        <UserMessages prompt={prompt}/>
                    </div>

                    <div className="py-1 text-center">
                        <Button onClick={() => handleSubmit(prompt)}>Submit</Button>
                    </div>
                    <div className="p-2">
                        <div className={"p-2 text-center"}>
                            Response {idx + 1}
                        </div>
                        <textarea
                            id="responseMessage"
                            value={promptResponses.find((prompt) => (prompt.id-1) === idx)?.response}
                            className="flex min-h-[220px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder=""
                        >
                        </textarea>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                            <Button onClick={() => handleSave(idx)}>Save</Button>
                            {/*<Button onClick={handleSubmit}>Production</Button>*/}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ComparePage() {

    const [prompts, setPrompts] = useState<Prompt[]>(() => {
        const promptsJson = localStorage.getItem("savedPrompts");
        if (promptsJson) {
            const savedPromptsArray = JSON.parse(promptsJson);
            return savedPromptsArray.slice(0, 4);
        }
        return promptsJson ? JSON.parse(promptsJson) : [];
    });

    // Save any changes in prompts to session storage!!
    useEffect(() => {
        localStorage.setItem("savedPrompts", JSON.stringify(prompts));
    }, [prompts]);


    return (
        <div className={"m-20"}>
            <div className={"flex flex-row m-6"}>
                <div>Prompts {"->"}</div>
                <div>
                    <Badge className={"inline-block"} variant="outline">Compare</Badge>
                </div>
            </div>
            <TableComponent prompts={prompts} setPrompts={setPrompts}/>
        </div>
    );
}