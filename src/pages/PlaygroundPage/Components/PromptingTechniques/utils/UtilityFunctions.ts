import {Prompt, PromptTabProps} from "@/lib/types.ts";

// Firebase
import {collection } from "firebase/firestore";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";
import {db} from "@/firebase.ts";
// import Firestore from "firebase/firestore";
// import QueryDocumentSnapshot = Firestore.QueryDocumentSnapshot;
// import DocumentData = Firestore.DocumentData;
// import firebase from "firebase/compat";
// import DocumentReference = firebase.firestore.DocumentReference;

// import {signInWithEmailAndPassword} from "firebase/auth";
// import { auth } from "./firebase.ts";

export function sendingOneShotRequest(
    requestUrl: string,
    props: PromptTabProps,
    userMessage: any,
    setIsLoading: (value: boolean) => void,
    setIsSubmitting: (value: boolean) => void,
    setMessages: (value: any) => void,
    messages: any,
) {

    // Step 1: Check if there is an existing array in local storage
    const existingKeys = localStorage.getItem('apiKeys');

    // Step 2: Parse the existing array or create a new empty array
    let keysArray = existingKeys ? JSON.parse(existingKeys) : [];

    if (keysArray.length === 0) {
        alert("You don't have any API Key Stored!");
        return;
    }

    const KeyObject = keysArray.find((key: { model: string, key: string }) => key.model === props.playgroundPrompt.model);

    if (!KeyObject) {
        alert("You don't have the API Key for the model selected.");
        return;
    }

    const apiKey = KeyObject.api_key;

    setIsSubmitting(true);

    setIsLoading(true);

    const requestData = {
        api_key: apiKey,
        model: props.playgroundPrompt.model,
        system_message: props.playgroundPrompt.system_message || "You are a helpful assistant", // Assuming systemMessage is passed as a prop
        user_message: userMessage,
        temperature: props.playgroundPrompt.temperature[0].toString(),
        maxLength: props.playgroundPrompt.maxLength[0].toString(),
        topP: props.playgroundPrompt.topP[0].toString(),
        frequencyPenalty: props.playgroundPrompt.frequencyPenalty[0].toString(),
        presencePenalty: props.playgroundPrompt.presencePenalty[0].toString()
    };

    fetch(requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then(response => {
            if (!response.ok) {
                setIsLoading(false)
                setIsSubmitting(false);
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
            // setErrorMessage("Unable to receive the response from the server.");
            setIsLoading(false);
            console.error('Error:', error);
        })
        .finally(() => {
            setIsLoading(false)
            setIsSubmitting(false);
        });
}

export function sendingChainOfThoughtRequest(
    requestUrl: string,
    props: PromptTabProps,
    userMessage: any,
    setIsLoading: (value: boolean) => void,
    setIsSubmitting: (value: boolean) => void,
    setMessages: (value: any) => void,
    messages: any
) {
    // Step 1: Check if there is an existing array in local storage
    const existingKeys = localStorage.getItem('apiKeys');

    // Step 2: Parse the existing array or create a new empty array
    let keysArray = existingKeys ? JSON.parse(existingKeys) : [];

    if (keysArray.length === 0) {
        alert("You don't have any API Key Stored!");
        return;
    }

    const KeyObject = keysArray.find((key: { model: string, key: string }) => key.model === props.playgroundPrompt.model);

    if (!KeyObject) {
        alert("You don't have the API Key for the model selected.");
        return;
    }

    const apiKey = KeyObject.api_key;

    setIsSubmitting(true);

    setIsLoading(true);

    const requestData = {
        api_key: apiKey,
        model: props.playgroundPrompt.model,
        system_message: props.playgroundPrompt.system_message || "You are a helpful assistant", // Assuming systemMessage is passed as a prop
        user_message: userMessage,
        temperature: props.playgroundPrompt.temperature[0].toString(),
        maxLength: props.playgroundPrompt.maxLength[0].toString(),
        topP: props.playgroundPrompt.topP[0].toString(),
        frequencyPenalty: props.playgroundPrompt.frequencyPenalty[0].toString(),
        presencePenalty: props.playgroundPrompt.presencePenalty[0].toString()
    };

    fetch(requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then(response => {
            if (!response.ok) {
                setIsLoading(false)
                setIsSubmitting(false);
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
            // setErrorMessage("Unable to receive the response from the server.");
            setIsLoading(false);
            console.error('Error:', error);
        })
        .finally(() => {
            setIsLoading(false)
            setIsSubmitting(false);
        });
}


export function sendingReactPromptRequest(
    requestUrl: string,
    props: PromptTabProps,
    userMessage: any,
    setIsLoading: (value: boolean) => void,
    setIsSubmitting: (value: boolean) => void,
    setMessages: (value: any) => void,
    messages: any
) {
    // Step 1: Check if there is an existing array in local storage
    const existingKeys = localStorage.getItem('apiKeys');

    // Step 2: Parse the existing array or create a new empty array
    let keysArray = existingKeys ? JSON.parse(existingKeys) : [];

    if (keysArray.length === 0) {
        alert("You don't have any API Key Stored!");
        return;
    }

    const KeyObject = keysArray.find((key: { model: string, key: string }) => key.model === props.playgroundPrompt.model);

    if (!KeyObject) {
        alert("You don't have the API Key for the model selected.");
        return;
    }

    const apiKey = KeyObject.api_key;

    setIsSubmitting(true);

    setIsLoading(true);

    const requestData = {
        api_key: apiKey,
        model: props.playgroundPrompt.model,
        system_message: props.playgroundPrompt.system_message || "You are a helpful assistant", // Assuming systemMessage is passed as a prop
        user_message: userMessage,
        temperature: props.playgroundPrompt.temperature[0].toString(),
        maxLength: props.playgroundPrompt.maxLength[0].toString(),
        topP: props.playgroundPrompt.topP[0].toString(),
        frequencyPenalty: props.playgroundPrompt.frequencyPenalty[0].toString(),
        presencePenalty: props.playgroundPrompt.presencePenalty[0].toString()
    };

    fetch(requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then(response => {
            if (!response.ok) {
                setIsLoading(false)
                setIsSubmitting(false);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === undefined) {
                throw new Error('Invalid response from the server');
            }

            const input = data.message;

            // Define the regular expressions for each field
            const thoughtRegex = /Thought: (.+?)\n/;
            const actionRegex = /Action: (.+?)\n/;
            const observationRegex = /Observation: (.+?)\n/;

            // Extract the values using the regex match function
            const thoughtMatch = input.match(thoughtRegex);
            const actionMatch = input.match(actionRegex);
            const observationMatch = input.match(observationRegex);

            // Extract the first capturing group if the match is successful, else default to an empty string
            const thought = thoughtMatch ? thoughtMatch[1] : "";
            const action = actionMatch ? actionMatch[1] : "";
            const observation = observationMatch ? observationMatch[1] : "";

            setMessages([
                ...messages,
                {
                    type: "ASSISTANT",
                    message: "",
                    reactResponses: {
                        thought: thought,
                        act: action,
                        observation: observation
                    }
                }
            ]);
        })
        .catch((error) => {
            // setErrorMessage("Unable to receive the response from the server.");
            setIsLoading(false);
            console.error('Error:', error);
        })
        .finally(() => {
            setIsLoading(false)
            setIsSubmitting(false);
        });
}



export async function savePromptsToFirebase(currentUser: string, promptsArray: any) {
    const collectionRef = collection(db, 'saved-prompts');
    const q = query(collectionRef, where('author', '==', currentUser));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // Create a new document if no document exists
            const newDocRef = doc(collectionRef);
            await setDoc(newDocRef, {
                author: currentUser,
                prompts: promptsArray
            });
        } else {
            // Update the existing document
            querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, {
                    author: currentUser,
                    prompts: promptsArray
                }); // Merge with existing data
            });
        }

        console.log('Prompts saved successfully');
    } catch (error) {
        console.error('Error saving prompts:', error);
    }
}


export async function getPromptsOfCurrentUser(currentUser: string): Promise<Prompt[]> {
    const collectionRef = collection(db, 'saved-prompts');
    const q = query(collectionRef, where('author', '==', currentUser));

    try {
        const querySnapshot = await getDocs(q);

        // Assuming each user has only one document
        if (!querySnapshot.empty) {
            const docSnapshot = querySnapshot.docs[0];
            const data = docSnapshot.data();

            if (data.prompts && Array.isArray(data.prompts)) {
                return data.prompts; // Return the prompts array
            }
        }

        return []; // Return an empty array if no document is found or the document has no prompts
    } catch (error) {
        console.error('Error fetching prompts:', error);
        throw error; // Rethrow the error to handle it in the caller function
    }
}


export function handleSavingPrompt(
    isSaving: boolean,
    messages: any,
    setIsSaving: (value: boolean) => void,
    props: PromptTabProps
): boolean {

    if (isSaving) return false;

    // const lastMessage = [...messages].reverse().find(message => message.type === "USER");

    if (messages.length === 0) {
        alert("User Message doesn't exists!");
        return false;
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
        // change by id not index
        promptsArray = promptsArray.map((prompt: Prompt) => {
            if(prompt.id === props.playgroundPrompt.id) {
                return {
                    id: props.playgroundPrompt.id,
                    type: props.playgroundPrompt.type,
                    model: props.playgroundPrompt.model,
                    system_message: props.playgroundPrompt.system_message, // Assuming systemMessage is passed as a prop
                    messages: messages,
                    temperature: props.playgroundPrompt.temperature,
                    maxLength: props.playgroundPrompt.maxLength,
                    topP: props.playgroundPrompt.topP,
                    frequencyPenalty: props.playgroundPrompt.frequencyPenalty,
                    presencePenalty: props.playgroundPrompt.presencePenalty
                };
            }
            return prompt;
        })
    } else {
        // If prompt with the same id doesn't exist, append the new one
        const requestData = {
            id: props.playgroundPrompt.id,
            type: props.playgroundPrompt.type,
            model: props.playgroundPrompt.model,
            system_message: props.playgroundPrompt.system_message, // Assuming systemMessage is passed as a prop
            messages: messages,
            temperature: props.playgroundPrompt.temperature,
            maxLength: props.playgroundPrompt.maxLength,
            topP: props.playgroundPrompt.topP,
            frequencyPenalty: props.playgroundPrompt.frequencyPenalty,
            presencePenalty: props.playgroundPrompt.presencePenalty
        };
        promptsArray.push(requestData);
    }

    savePromptsToFirebase(props.currentUser, promptsArray)
        .then(() => {
            console.log('Prompts are saved to Firebase');
        });

    // Save to Prompts State too
    props.setPrompts(promptsArray);

    // Step 4: Save the updated array back to local storage
    localStorage.setItem('savedPrompts', JSON.stringify(promptsArray));

    setIsSaving(false);

    return true;
}


export function handleResetPrompt(
    props: PromptTabProps,
    setMessages: (value: any) => void,
    emptyMessages: any
) {
    const existingPrompts = localStorage.getItem('savedPrompts');

    let promptsArray = existingPrompts ? JSON.parse(existingPrompts) : [];

    const prompt: Prompt = {
        id: generateRandomID(promptsArray),
        type: props.playgroundPrompt.type,
        model: props.playgroundPrompt.model,
        system_message: "",
        messages: [],
        temperature: [0.9],
        maxLength: [256],
        topP: [0.9],
        frequencyPenalty: [1],
        presencePenalty: [1],
    }


    sessionStorage.setItem("playgroundPrompt", JSON.stringify(prompt));

    props.setPlaygroundPrompt(prompt);
    setMessages(emptyMessages);
}


export function handleCompareNavigation(props: PromptTabProps) {
    props.setActivePage('Compare');
}

export function generateRandomID(promptsArray: Prompt[]) {
    let uniqueID: number;

    // Function to generate a random number as ID
    // const generateID = () => Math.floor(Math.random() * 1000000); // Adjust range as needed
    let counter = 1;

    do {
        uniqueID = counter;
        counter = counter + 1;
    } while (promptsArray.some(prompt => prompt.id === uniqueID));

    return uniqueID;
}
