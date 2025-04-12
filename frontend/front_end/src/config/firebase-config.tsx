import { getStorage } from "firebase/storage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA_DX6klUwoZp6UF4wclU3VPjPQOALJnJg",
    authDomain: "printerest-clone-773aa.firebaseapp.com",
    projectId: "printerest-clone-773aa",
    storageBucket: "printerest-clone-773aa.appspot.com",
    messagingSenderId: "16581331396",
    appId: "1:16581331396:web:d44f9b1ecc47caca343c91",
    measurementId: "G-7DYF2BSN3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
