// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPgii7SjboecuIW8vtQrdvvmuZs95LbLg",
  authDomain: "test-5f6e8.firebaseapp.com",
  projectId: "test-5f6e8",
  storageBucket: "test-5f6e8.appspot.com",
  messagingSenderId: "200800549024",
  appId: "1:200800549024:web:7b01dc703cb91e1800b1c5",
  measurementId: "G-CG78SJ6NDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);