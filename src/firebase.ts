// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYa06ajuU9Z8REgO4JJhzSsZgSnGZIjYk",
    authDomain: "lyzr-prompt-studio.firebaseapp.com",
    projectId: "lyzr-prompt-studio",
    storageBucket: "lyzr-prompt-studio.appspot.com",
    messagingSenderId: "550126209849",
    appId: "1:550126209849:web:e13991f838e99332c7f6e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;