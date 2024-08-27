// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWaNklwvq271W6hGhx5ChkVuFR5HMFxS0",
  authDomain: "tp2-pb-adf31.firebaseapp.com",
  projectId: "tp2-pb-adf31",
  storageBucket: "tp2-pb-adf31.appspot.com",
  messagingSenderId: "154159783240",
  appId: "1:154159783240:web:54ab84823eb2fefedee77d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);