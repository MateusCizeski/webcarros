import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNdeqhs2wX7ILlH8lS9j325_mTIHTt-HU",
  authDomain: "webcarros-21989.firebaseapp.com",
  projectId: "webcarros-21989",
  storageBucket: "webcarros-21989.firebasestorage.app",
  messagingSenderId: "89826688745",
  appId: "1:89826688745:web:0fb9c0c25199ce2488ba78"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
