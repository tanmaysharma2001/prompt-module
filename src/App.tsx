// import React from 'react'
import './App.css'

import PlaygroundPage from './pages/PlaygroundPage/PlaygroundPage.tsx'
import ComparePage from "@/pages/ComparePage.tsx";
import APIKeysPage from "@/pages/APIKeysPage.tsx";
import SavedPromptsPage from "@/pages/SavedPromptsPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "@/components/Layout.tsx";




function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<PlaygroundPage />}/>
                        <Route path="/compare" element={<ComparePage />}/>
                        <Route path="/saved" element={<SavedPromptsPage />}/>
                        <Route path="/api-keys" element={<APIKeysPage />}/>
                    </Route>
                </Routes>
            </BrowserRouter>
            {/*<PlaygroundPage />*/}
            {/*  <ComparePage />*/}
            {/*  {<APIKeysPage />}*/}
            {/*<SavedPromptsPage />*/}
        </>
    )
}

export default App
