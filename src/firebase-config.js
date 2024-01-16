import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAk9Eh9bIudmwcVcg-ZWt51nToqowNhY0c",
  authDomain: "tweetx-2af66.firebaseapp.com",
  databaseURL: "https://tweetx-2af66-default-rtdb.firebaseio.com",
  projectId: "tweetx-2af66",
  storageBucket: "tweetx-2af66.appspot.com",
  messagingSenderId: "1034015188426",
  appId: "1:1034015188426:web:03b27bd14a1463bb4c9b33",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
