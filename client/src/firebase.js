// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "testate-mern.firebaseapp.com",
  projectId: "testate-mern",
  storageBucket: "testate-mern.appspot.com",
  messagingSenderId: "324981532535",
  appId: "1:324981532535:web:a9665cf878d6e443afa372"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);