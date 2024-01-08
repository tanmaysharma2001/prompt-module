import LyzrLogo from "@/lyzr-logo-oneColor-rgb-600.png";
import {useState} from "react";

import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '@/firebase';
import {useNavigate} from "react-router-dom";

export default function SignUpPage() {

    const navigate = useNavigate();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");


    async function handleSignUp(e: any) {
        e.preventDefault()

        await createUserWithEmailAndPassword(auth, emailAddress, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigate("/login");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
    }


    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-28 w-auto"
                        src={LyzrLogo}
                        alt="Lyzr"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create a new account.
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                {/*<div className="text-sm">*/}
                                {/*    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">*/}
                                {/*        Forgot password?*/}
                                {/*    </a>*/}
                                {/*</div>*/}
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                onClick={handleSignUp}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already a member?{' '}
                        <a href="" onClick={() => navigate("/login")} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Login to your account.
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
