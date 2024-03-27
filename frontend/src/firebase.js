// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "tbilisi-comfort.firebaseapp.com",
  projectId: "tbilisi-comfort",
  storageBucket: "tbilisi-comfort.appspot.com",
  messagingSenderId: "212806842567",
  appId: "1:212806842567:web:f69e9498509703f326a6e2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
