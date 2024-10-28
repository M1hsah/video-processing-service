// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWwyajafuuLTNzpIY_bLBYTwSCcmkvh_I",
  authDomain: "video-processing-service-cf71b.firebaseapp.com",
  projectId: "video-processing-service-cf71b",
  appId: "1:669627397290:web:fceea16a8a0a7c42f8ccd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function signInWithGoogle(){
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut(){
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }