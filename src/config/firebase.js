import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1UViFg5FULKy-3XX-inwHWVEs04XqxPo",
  authDomain: "fir-course-3c614.firebaseapp.com",
  projectId: "fir-course-3c614",
  storageBucket: "fir-course-3c614.appspot.com",
  messagingSenderId: "934046244271",
  appId: "1:934046244271:web:7699d6bc71bda49cbf235a",
  measurementId: "G-5X7XPE3B62"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app); 
export const storage = getStorage(app);