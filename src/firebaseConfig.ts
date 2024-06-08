import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyDtBx6-QJY7n8YwO62mQLqd9oNj0IFOym0",
    authDomain: "nabia-app.firebaseapp.com",
    projectId: "nabia-app",
    storageBucket: "nabia-app.appspot.com",
    messagingSenderId: "948534853499",
    appId: "1:948534853499:web:aed6d617cb377fc77e47de",
    measurementId: "G-BM9QGHJVY7"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);


export async function loginUser(username: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        return userCredential.user;
    } catch (error) {
        throw new Error('Login Failed');
    }
}