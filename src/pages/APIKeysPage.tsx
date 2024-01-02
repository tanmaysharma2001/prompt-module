import {useEffect, useState} from "react";

// Shadcn Components

import {Badge} from "@/components/ui/badge.tsx"
import {Button} from "@/components/ui/button.tsx";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx"

// Types
import { APIKey } from "@/lib/types.ts";

interface EditKeyBoxInterface {
    llmModel: string;
    apiKeys: APIKey[];
    setAPIKeys: (value: APIKey[]) => void;
}

const EditKeyBox: React.FC<EditKeyBoxInterface> = ({llmModel, apiKeys, setAPIKeys}) => {

    const [llmAPIKey, setLLMAPIKey] = useState("");

    const handleSave = () => {
        if (llmAPIKey === "" || llmAPIKey.length < 30 || llmAPIKey.length > 128) {
            alert("Invalid API Key");
            return;
        }

        setAPIKeys(apiKeys.map((key) => {
            if (key.model === llmModel) {
                return {
                    ...key,
                    api_key: llmAPIKey
                };
            }
            return key;
        }));
    }

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger>edit</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Edit {llmModel.toUpperCase()} key</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Input
                                onChange={(e) => setLLMAPIKey(e.target.value)}
                                value={llmAPIKey}
                                type={"password"}
                                placeholder="Enter new API Key"
                            />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSave}>Save Key</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


interface DeleteKeyBoxInterface {
    llmModel: string;
    apiKeys: APIKey[];
    setAPIKeys: (value: APIKey[]) => void;
}


const DeleteKeyBox: React.FC<DeleteKeyBoxInterface> = ({llmModel, apiKeys, setAPIKeys}) => {

    const handleDelete = () => {
        setAPIKeys(apiKeys.filter((apiKey) => apiKey.model !== llmModel))
    }

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger>delete</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Key</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {llmModel.toUpperCase()} key?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete Key</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

interface TableComponentInterface {
    apiKeys: APIKey[];
    setAPIKeys: (value: APIKey[]) => void;
}

const TableComponent: React.FC<TableComponentInterface> = ({apiKeys, setAPIKeys}) => {

    // const [isSubmitting, setIsSubmitting] = useState(false);

    // View Prompts: Duplicate use to modify prompts view without the need of modifying the original prompts.
    // Change in prompts also results in change in viewPrompts as both are reloaded when the component is reloaded.
    const [viewAPIKeys, setViewAPIKeys] = useState<APIKey[]>(apiKeys);


    const [areVisible, setAreVisible] = useState<boolean[]>([]);

    useEffect(() => {

        const visibleArray = viewAPIKeys.map((_) => {
            return false; // Replace this with your actual condition/logic
        });

        setAreVisible(visibleArray);

    }, []);

    useEffect(() => {
        setViewAPIKeys(apiKeys);
    }, [apiKeys]);


    function handleVisible(index: number) {
        setAreVisible(areVisible.map((visibility, idx) => {
            if (idx === index) {
                return !visibility;
            }
            return visibility;
        }))
    }


    return (
        <div className={"pl-16 pr-16 pt-8"}>
            <Table>
                <TableCaption>A list of your saved API Keys.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Model</TableHead>
                        <TableHead>API Key</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {viewAPIKeys.map((apiKey, idx) => {
                        return (
                            <TableRow>
                                <TableCell className="font-medium">{apiKey.model.toUpperCase()}</TableCell>
                                <TableCell>
                                    <div className={"flex flex-row items-center"}>
                                        {areVisible[idx] ? apiKey.api_key :
                                            <div>*******************************************************</div>}
                                        {areVisible[idx] ?
                                            <div className={"ml-2 mt-1"} onClick={() => handleVisible(idx)}>
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L10.6828 3.61012C9.70652 3.21671 8.63759 3 7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C0.902945 9.08812 2.02314 10.1861 3.36061 10.9323L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L4.31723 11.3899C5.29348 11.7833 6.36241 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C14.0971 5.9119 12.9769 4.81391 11.6394 4.06771L13.3536 2.35355ZM9.90428 4.38861C9.15332 4.1361 8.34759 4 7.5 4C4.80285 4 2.52952 5.37816 1.09622 7.50001C1.87284 8.6497 2.89609 9.58106 4.09974 10.1931L9.90428 4.38861ZM5.09572 10.6114L10.9003 4.80685C12.1039 5.41894 13.1272 6.35031 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11C6.65241 11 5.84668 10.8639 5.09572 10.6114Z"
                                                        fill="currentColor" fillRule="evenodd"
                                                        clipRule="evenodd"></path>
                                                </svg>
                                            </div>
                                            :
                                            <div className={"ml-2 mb-1"} onClick={() => handleVisible(idx)}>
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"
                                                        fill="currentColor" fillRule="evenodd"
                                                        clipRule="evenodd"></path>
                                                </svg>
                                            </div>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className={"inline-block"}>
                                        <EditKeyBox
                                            llmModel={apiKey.model}
                                            apiKeys={apiKeys}
                                            setAPIKeys={setAPIKeys}/>
                                    </div>
                                    /
                                    <div className={"inline-block"}>
                                        <DeleteKeyBox
                                            llmModel={apiKey.model}
                                            apiKeys={apiKeys}
                                            setAPIKeys={setAPIKeys}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

interface AddNewBoxInterface {
    apiKeys: APIKey[];
    setAPIKeys: (value: APIKey[]) => void;
    llmModel: string;
    setLLMModel: (value: string) => void;
}

const AddNewBox: React.FC<AddNewBoxInterface> = ({apiKeys, setAPIKeys, llmModel, setLLMModel}) => {

    const [llmAPIKey, setLLMAPIKey] = useState("");

    const handleLLMSelect = (value: string) => {
        setLLMModel(value);
    }

    const handleSave = () => {

        // API Key Check
        if (apiKeys.find((apiKey: {model: string, api_key: string}) => llmModel === apiKey.model)) {
            alert('LLM Key Already Exists! If you want to change existing key, click on edit!');
            return;
        }

        if (llmAPIKey === "" || llmAPIKey.length < 30 || llmAPIKey.length > 128) {
            alert("Invalid API Key");
            return;
        }

        const newAPIKeyObject: APIKey = {
            model: llmModel,
            api_key: llmAPIKey,
        }

        setAPIKeys([...apiKeys, newAPIKeyObject]);
    }

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button className={""}>Add New</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Enter your API Key</AlertDialogTitle>
                        <AlertDialogDescription>
                            Select the LLM Model and Enter your API Key:
                            <div className="mt-2">
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
                            {llmModel !== "" ?
                                <div className={"mt-2 mr-6"}>
                                    <Input onChange={(e) => setLLMAPIKey(e.target.value)} value={llmAPIKey}
                                           type={"password"} placeholder="API Key"/>
                                </div>
                                :
                                <>
                                </>
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSave} asChild>
                            <Button type={"submit"}>Add Key</Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function APIKeysPage() {

    const [apiKeys, setAPIKeys] = useState<APIKey[]>(() => {
        const apiKeysJSON = localStorage.getItem("apiKeys");
        return apiKeysJSON ? JSON.parse(apiKeysJSON) : [];
    });

    // Save any changes in prompts to session storage!!
    useEffect(() => {
        localStorage.setItem("apiKeys", JSON.stringify(apiKeys));
    }, [apiKeys]);

    const [llmModel, setLLMModel] = useState("");


    return (
        <div className={"m-20"}>
            <div className={"flex flex-row justify-between"}>
                <div className={"flex flex-row m-2 items-center space-x-1"}>
                    <div className={"flex flex-row items-center"}>
                        Prompts
                        <svg className={"ml-1"} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </div>
                    <div>
                        <Badge className={"inline-block"} variant="outline">API Keys</Badge>
                    </div>
                </div>
                <div className={"m-2"}>
                    <AddNewBox apiKeys={apiKeys} setAPIKeys={setAPIKeys} llmModel={llmModel} setLLMModel={setLLMModel}/>
                </div>
            </div>
            <TableComponent apiKeys={apiKeys} setAPIKeys={setAPIKeys}/>
        </div>
    );
}