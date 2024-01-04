import {useState} from "react";
import './App.css'
import LyzerLogo from "@/lyzr-logo-oneColor-rgb-600.png";

import PlaygroundPage from './pages/PlaygroundPage/PlaygroundPage.tsx'
import ComparePage from "@/pages/ComparePage.tsx";
import APIKeysPage from "@/pages/APIKeysPage.tsx";
import SavedPromptsPage from "@/pages/SavedPromptsPage.tsx";
import { Toaster } from "@/components/ui/toaster"



interface NavbarProps {
    activePage: string;
    setActivePage: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {

    const tabClass = (tabName: string) =>
        `shrink-0 rounded-lg p-2 text-sm font-medium ${activePage === tabName ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`;

    return (
        <div className={"flex flex-row items-center space-x-6 space-y-1"}>
            <img src={LyzerLogo} className={"h-28 w-28"} />
            {/*... Other parts of your Navbar ...*/}
            <div className="hidden sm:block">
                <nav className="flex gap-6" aria-label="Tabs">
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
                </nav>
            </div>
        </div>
    );
}

function App() {

    const [activePage, setActivePage] = useState("Playground");

    return (
        <div className={"ml-10 mr-10"}>
            <Navbar activePage={activePage} setActivePage={setActivePage} />
            <Toaster />
            {activePage === "Playground" && <PlaygroundPage setActivePage={setActivePage} />}
            {activePage === "Compare" && <ComparePage setActivePage={setActivePage} />}
            {activePage === "SavedPrompts" && <SavedPromptsPage setActivePage={setActivePage} />}
            {activePage === "APIKeys" && <APIKeysPage />}
        </div>
    )
}

export default App
