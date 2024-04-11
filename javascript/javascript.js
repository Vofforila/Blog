// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC300ebq4PLrPsCPTtEt2wNKa11GDi22ps",
  authDomain: "blog-f490d.firebaseapp.com",
  projectId: "blog-f490d",
  storageBucket: "blog-f490d.appspot.com",
  messagingSenderId: "736374436760",
  appId: "1:736374436760:web:5d5f1fb00268a8a502f1ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();


createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });


signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });


onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } 
  else {
    // User is signed out
    // ...
  }
});

