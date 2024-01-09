import {useEffect, useState} from "react";
import './App.css'
import LyzerLogo from "@/lyzr-logo-oneColor-rgb-600.png";

import PlaygroundPage from './pages/PlaygroundPage/PlaygroundPage.tsx'
import ComparePage from "@/pages/ComparePage.tsx";
import APIKeysPage from "@/pages/APIKeysPage.tsx";
import SavedPromptsPage from "@/pages/SavedPromptsPage.tsx";
import { Toaster } from "@/components/ui/toaster"
import SignUpPage from "@/pages/Authentication/SignUpPage.tsx";
import LoginPage from "@/pages/Authentication/LoginPage.tsx";

import {BrowserRouter as Router, useNavigate} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/firebase.ts';
import {Button} from "@/components/ui/button.tsx";
import { signOut } from "firebase/auth";
import {Prompt} from "@/lib/types.ts";
import {
    getPromptsOfCurrentUser,
    savePromptsToFirebase
} from "@/pages/PlaygroundPage/Components/PromptingTechniques/utils/UtilityFunctions.ts";



interface NavbarProps {
    navigate: any,
    activePage: string;
    setActivePage: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navigate, activePage, setActivePage }) => {

    const tabClass = (tabName: string) =>
        `shrink-0 rounded-lg p-2 text-sm font-medium ${activePage === tabName ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`;

    function handleLogout() {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/login");
            console.log("Signed out successfully")
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className={"flex flex-row justify-between items-center space-x-6 space-y-6"}>
            <img src={LyzerLogo} className={"h-14 w-auto"} />
            <div className="hidden sm:block">
                <nav className="flex flex-row justify-between items-center space-x-8" aria-label="Tabs">
                    <div>
                        <a
                            className={tabClass("Playground")}
                            onClick={() => setActivePage("Playground")}
                        >
                            Playground
                        </a>

                        <a
                            className={tabClass("Compare")}
                            onClick={() => setActivePage("Compare")}
                        >
                            Compare
                        </a>

                        <a
                            className={tabClass("Saved Prompts")}
                            onClick={() => setActivePage("SavedPrompts")}
                        >
                            Saved Prompts
                        </a>

                        <a
                            className={tabClass("API Keys")}
                            onClick={() => setActivePage("APIKeys")}
                        >
                            API Keys
                        </a>
                    </div>
                    <div>
                        <Button onClick={handleLogout}>Log Out</Button>
                    </div>
                </nav>
            </div>
        </div>
    );
}

const Prompts = () => {

    const navigate = useNavigate();

    const [activePage, setActivePage] = useState("Playground");

    const [currentUser, setCurrentUser] = useState("");

    const [prompts, setPrompts] = useState<Prompt[]>([]);

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                setCurrentUser(uid)
            } else {
                console.log("user is logged out")
                navigate('/login')
            }
        });

    }, [])

    useEffect(() => {
        async function fetchPrompts() {
            // Get prompts from Firebase
            try {
                const prompts: Prompt[] = await getPromptsOfCurrentUser(currentUser);

                localStorage.setItem("savedPrompts", JSON.stringify(prompts));

                if (prompts.length > 0) {
                    setPrompts(prompts);
                } else {
                    setPrompts([]);
                }
            } catch (error) {
                console.error('Error fetching prompts:', error);
            }
        }

        fetchPrompts();
    }, [currentUser]); // Dependency array to re-run this effect if currentUser changes

    // Save any changes in prompts to session storage!!
    useEffect(() => {
        savePromptsToFirebase(currentUser, prompts).then(() => {
            console.log('Changes to Prompt saved to Firebase');
        })
        localStorage.setItem("savedPrompts", JSON.stringify(prompts));
    }, [prompts]);


    return (
        <div className={"ml-10 mr-10"}>
            <Navbar navigate={navigate} activePage={activePage} setActivePage={setActivePage} />
            <Toaster />
            {activePage === "Playground" && <PlaygroundPage prompts={prompts} setPrompts={setPrompts} currentUser={currentUser} activePage={activePage} setActivePage={setActivePage} />}
            {activePage === "Compare" && <ComparePage prompts={prompts} setPrompts={setPrompts} currentUser={currentUser} setActivePage={setActivePage} />}
            {activePage === "SavedPrompts" && <SavedPromptsPage prompts={prompts} setPrompts={setPrompts} currentUser={currentUser} setActivePage={setActivePage} />}
            {activePage === "APIKeys" && <APIKeysPage />}
        </div>
    );
}

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path={"/signup"} element={<SignUpPage />} />
                    <Route path={"/login"} element={<LoginPage />} />
                    <Route path={"/prompts/"} element={<Prompts />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
