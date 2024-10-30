// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import {getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
  authDomain: "video-processing-service-cf71b.firebaseapp.com",
  projectId: "video-processing-service-cf71b",
  appId: "1:669627397290:web:fceea16a8a0a7c42f8ccd3"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
export const functions = getFunctions(app, "us-central1");

export function signInWithGoogle(){
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut(){
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }