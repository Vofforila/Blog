import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
   getAuth,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { firestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
   initializeAppCheck,
   ReCaptchaEnterpriseProvider,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-check.js";
import firebase from "firebase/compat/app";

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
/// AppCheck
///

const appCheck = initializeAppCheck(app, {
   provider: new ReCaptchaEnterpriseProvider(
      "6LdICMQpAAAAAA31_vb4VWlqjnrKHnrbi1agvCBB"
   ),
   isTokenAutoRefreshEnabled: true,
});

app.use(appCheck.middleware());

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

if (lastPart == "register") {
   const registerButton = document.getElementById("register-button");
   registerButton.addEventListener("click", Register);
} else if (lastPart == "login") {
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
   var email = document.getElementById("login-email").value;
   var password = document.getElementById("login-password").value;
   signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
         const username = userCredential.user;
         window.location.href = "/html/index.html";
      })
      .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         console.log(errorCode + "/n" + errorMessage);
      });
}

onAuthStateChanged(auth, (user) => {
   if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log("Login");
   } else {
      console.log("LogOut");
   }
});
