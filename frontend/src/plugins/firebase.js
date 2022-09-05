import Vue from 'vue';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyA4g2I5-L2npC7cr75Ld8Orak8-8UdTx6A",
  authDomain: "pudding-82d48.firebaseapp.com",
  databaseURL: "https://pudding-82d48-default-rtdb.firebaseio.com",
  projectId: "pudding-82d48",
  storageBucket: "pudding-82d48.appspot.com",
  messagingSenderId: "1092996076927",
  appId: "1:1092996076927:web:a768827a1db269dea8f64a",
  measurementId: "G-1N11JHZYFM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
