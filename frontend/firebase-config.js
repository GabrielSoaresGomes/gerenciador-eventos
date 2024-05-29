import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyD18tqYo_GQY6PQ1id72ZgXfm4DhswWzh8",
    authDomain: "gerenciador-eventos-2abc0.firebaseapp.com",
    projectId: "gerenciador-eventos-2abc0",
    storageBucket: "gerenciador-eventos-2abc0.appspot.com",
    messagingSenderId: "957534108537",
    appId: "1:957534108537:web:12b17130b6dca86723cda8"
};

const app = initializeApp(firebaseConfig);
const dbFirebase = getFirestore(app);

export {dbFirebase};