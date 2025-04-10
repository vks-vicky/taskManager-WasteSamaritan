
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_bqVtismlq3UbSG0hzhdGvfp5s8mmUgQ",
  authDomain: "taskmanagement-wastesamaritan.firebaseapp.com",
  projectId: "taskmanagement-wastesamaritan",
  storageBucket: "taskmanagement-wastesamaritan.firebasestorage.app",
  messagingSenderId: "170895993130",
  appId: "1:170895993130:web:80e751f0db50dbf6195653",
  measurementId: "G-WB9VZDC4Q6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);