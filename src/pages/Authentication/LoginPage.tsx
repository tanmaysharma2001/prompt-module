import LyzrLogo from "@/lyzr-logo-oneColor-rgb-600.png";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

import {signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
// import {auth} from '@/firebase';
import { auth } from "@/firebase.ts"
import {Toaster} from "@/components/ui/toaster.tsx";
import {useToast} from "@/components/ui/use-toast.ts";

export default function LoginPage() {

    const navigate = useNavigate();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    function togglePasswordVisibility() {
        setIsPasswordVisible((prevState) => !prevState);
    }


    const {toast} = useToast()

    function handleLogin(e: any) {
        e.preventDefault();
        signInWithEmailAndPassword(auth, emailAddress, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                if (!user.emailVerified) {
                    throw new Error("The email is not verified. Look into your inbox to find the verification link and verify your account.")
                }
                navigate("/prompts/")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast({
                    title: `Error ${errorCode}:`,
                    description: `${errorMessage}`,
                })
                console.log(errorCode, errorMessage)
            });

        setEmailAddress("");
        setPassword("");
    }


    function handleForgotPassword(e: any) {
        e.preventDefault();
        sendPasswordResetEmail(auth, emailAddress)
            .then(() => {
                toast({
                    title: `Password Reset`,
                    description: `Password Reset Mail Sent`,
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast({
                    title: `Error ${errorCode}:`,
                    description: `${errorMessage}`,
                })
                console.log(errorCode, errorMessage)
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
            <Toaster/>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-28 w-auto"
                        src={LyzrLogo}
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" method="POST">
                        <div>
                            <label
                                htmlFor="email"
                                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                            >
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    autoComplete="email"
                                    required
                                    className="w-full peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                    placeholder="Email"
                                />

                                <span
                                    className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                        <path
                                            fillRule="evenodd"
                                            d="M5.404 14.596A6.5 6.5 0 1116.5 10a1.25 1.25 0 01-2.5 0 4 4 0 10-.571 2.06A2.75 2.75 0 0018 10a8 8 0 10-2.343 5.657.75.75 0 00-1.06-1.06 6.5 6.5 0 01-9.193 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>

                                <span
                                    className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                                >Email</span>
                            </label>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">

                                </label>
                                <div className="text-sm">
                                    <a href="" onClick={handleForgotPassword} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <label
                                    htmlFor="password"
                                    className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                                >
                                    <input
                                        id="password"
                                        name="password"
                                        type={isPasswordVisible ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        required
                                        className="w-full peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                        placeholder="Password"
                                    />

                                    <div onClick={togglePasswordVisibility}>
                                        <span
                                            className="absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500"
                                        >

                                            {isPasswordVisible
                                                ?
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                                                </svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                </svg>
                                            }
                                </span>
                                    </div>

                                    <span
                                        className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                                    >Password</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleLogin}
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <a href="" onClick={() => navigate('/signup')}
                           className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Sign Up Now!
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
