import { initializeApp } from "firebase/app";
import {
   getAuth,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
   apiKey: "AIzaSyC300ebq4PLrPsCPTtEt2wNKa11GDi22ps",
   authDomain: "blog-f490d.firebaseapp.com",
   projectId: "blog-f490d",
   storageBucket: "blog-f490d.appspot.com",
   messagingSenderId: "736374436760",
   appId: "1:736374436760:web:5d5f1fb00268a8a502f1ed",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

void SignUp();
{
   var email = document.getElementsByClassName("register-email");
   var username = document.getElementsByClassName("register-username");
   var password = document.getElementsByClassName("password-register");
   createUserWithEmailAndPassword(auth)
      .then((userCredential) => {
         username = userCredential.user;
      })
      .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
      });
}

// Add a new document in collection "cities"
await setDoc(doc(db, "cities", "LA"), {
   name: "Los Angeles",
   state: "CA",
   country: "USA",
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
   } else {
      // User is signed out
      // ...
   }
});
