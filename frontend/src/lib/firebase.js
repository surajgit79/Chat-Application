import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBcrNmosivvcoI9oFkB07FFzSLiZ0y5HPM",
    authDomain: "chatty-40890.firebaseapp.com",
    projectId: "chatty-40890",
    storageBucket: "chatty-40890.firebasestorage.app",
    messagingSenderId: "189583791062",
    appId: "1:189583791062:web:c533fb66f42dd4e17f0a77",
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
}