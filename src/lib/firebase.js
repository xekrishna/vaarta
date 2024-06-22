import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "vaartaxe.firebaseapp.com",
  projectId: "vaartaxe",
  storageBucket: "vaartaxe.appspot.com",
  messagingSenderId: "1030831887071",
  appId: "1:1030831887071:web:e1dd43499b860702c98f6a",
  measurementId: "G-MTMKDF9BV2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();