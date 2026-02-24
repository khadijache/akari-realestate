import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_4R6WhQbcr-7KTl_mX2fFGjTRlRDFewE", // تأكدي من جلب الـ API Key الخاص بمشروع akari-realestate من إعدادات المشروع
  authDomain: "akari-realestate.firebaseapp.com",
  databaseURL: "https://akari-realestate-default-rtdb.firebaseio.com", 
  projectId: "akari-realestate",
  storageBucket: "akari-realestate.appspot.com",
  messagingSenderId: "771995711830",
  appId: "1:771995711830:web:5b771c99a76e505d42fef7"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);