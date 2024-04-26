import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
   getAuth,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
   initializeAppCheck,
   ReCaptchaEnterpriseProvider,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-check.js";

const firebaseConfig = {
   apiKey: "AIzaSyAIvQKBeruvLdV74ySuHFPWHIgWw9uzy5A",
   authDomain: "projects-175f8.firebaseapp.com",
   databaseURL:
      "https://projects-175f8-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "projects-175f8",
   storageBucket: "projects-175f8.appspot.com",
   messagingSenderId: "481400981162",
   appId: "1:481400981162:web:383fb53435eedc2568f2d3",
   measurementId: "G-MF9LGR4C33",
};

const app = initializeApp(firebaseConfig);

///
/// FireAuth
///

const currentURL = window.location.href;
const parts = currentURL.split("/"); // Split the URL by '/'
let lastPart = parts[parts.length - 1]; // Get the last part

// Remove the .html extension if it exists
if (lastPart.endsWith(".html")) {
   lastPart = lastPart.slice(0, -5);
}

console.log(lastPart);

if (lastPart == "register") {
   const registerButton = document.getElementById("register-button");
   registerButton.addEventListener("click", Register);
} else if (lastPart == "login" || lastPart == "") {
   console.log(lastPart);
   console.log("Wrok");
   const loginButton = document.getElementById("login-button");
   loginButton.addEventListener("click", Login);
} else if (lastPart == "register") {
}

const auth = getAuth(app);

function Register() {
   var email = document.getElementById("register-email").value;
   var username = document.getElementById("register-username").value;
   var password = document.getElementById("register-password").value;
   console.log(email + username + password);
   createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
         const username = userCredential.user;
      })
      .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         console.log(errorCode + "/n" + errorMessage);
      });
}

function Login() {
   console.log("Login");
   var email = document.getElementById("login-email").value;
   var password = document.getElementById("login-password").value;
   signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
         const username = userCredential.user;
         window.location.href = "/html/about.html";
         console.log("Login");
      })
      .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         console.log(errorCode + "/n" + errorMessage);
      });
}

///
/// Firestore
///

// Get a reference to the Firestore database service
const db = firebase.firestore();

// Example: Add a document to a collection
db.collection("users")
   .add({
      first: "Ada",
      last: "Lovelace",
      born: 1815,
   })
   .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
   })
   .catch((error) => {
      console.erro   r("Error adding document: ", error);
   });
