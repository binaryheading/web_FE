/*


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIlrgCoQSWrtE485K3lOdSMgARfcU7r_g",
  authDomain: "react-todo-practice-ec3a6.firebaseapp.com",
  projectId: "react-todo-practice-ec3a6",
  storageBucket: "react-todo-practice-ec3a6.appspot.com",
  messagingSenderId: "921505456167",
  appId: "1:921505456167:web:eec486eef1f8d71285ee02",
  measurementId: "G-P5C7N8QEEP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app); // 추가

export { firestore }; // 추가


*/


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJTxKxmfQipsrBgqj4z9PncBK0rwYX_W8",
  authDomain: "binarymmm-789b2.firebaseapp.com",
  projectId: "binarymmm-789b2",
  storageBucket: "binarymmm-789b2.appspot.com",
  messagingSenderId: "713355150012",
  appId: "1:713355150012:web:857ab1c160d51de1cd86b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };