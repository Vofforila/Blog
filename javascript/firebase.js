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
import {
   getFirestore,
   collection,
   addDoc,
   getDoc,
   setDoc,
   doc,
   query,
   where,
   getDocs,
   deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
   getStorage,
   ref,
   uploadBytes,
   getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

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
/// Event Listeners
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
} else if (lastPart == "login" || lastPart == "") {
   const loginButton = document.getElementById("login-button");
   loginButton.addEventListener("click", Login);
} else if (lastPart == "dev") {
   const addProductButton = document.getElementById("product-button");
   addProductButton.addEventListener("click", function () {
      AddProduct();
      AddProductImage();
   });
} else if (lastPart == "market") {
   LoadProducts();
} else if (lastPart == "basket") {
   LoadBasket();
}

///
/// FireAuth
///

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

var currentEmail;

function Login() {
   console.log("Login");
   var email = document.getElementById("login-email").value;
   var password = document.getElementById("login-password").value;
   signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
         currentEmail = userCredential.user.email;
         window.location.href = "/html/about.html";
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

async function AddProduct() {
   const db = getFirestore(app);
   const product_name = document.getElementById("product-name").value;
   const product_type = document.getElementById("product-type").value;
   const product_price = document.getElementById("product-price").value;
   const product_sale_price =
      document.getElementById("product-sale-price").value;

   var new_price;
   if (product_sale_price == 0 || product_sale_price == "") {
      new_price = 0;
   } else {
      new_price = product_price - product_sale_price;
   }

   const docRef = doc(db, "produse_blog", product_type).withConverter(
      productConverter
   );
   try {
      await setDoc(docRef, new Product(product_name, product_price, new_price));
   } catch (e) {
      console.error("Error document: ", e);
   }
}

///
/// Firestorage
///

function AddProductImage() {
   const product_name = document.getElementById("product-name").value;
   const product_img = document.getElementById("product-image");
   const file = product_img.files[0];

   const storage = getStorage(app);

   const imageLocation = "produse_blog/" + product_name;
   const imgRef = ref(storage, imageLocation);

   console.log(storage);

   uploadBytes(imgRef, file).then((snapshop) => {
      console.log("Uploaded Photo");
   });
}

async function LoadProducts() {
   const db = getFirestore(app);

   const q = query(collection(db, "produse_blog"));
   const querySnapshop = await getDocs(q);
   querySnapshop.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());

      const storage = getStorage();
      const imageLocation = "produse_blog/" + doc.data().name;
      const imageRef = ref(storage, imageLocation);

      getDownloadURL(imageRef)
         .then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = (event) => {
               const blob = xhr.response;
            };
            xhr.open("GET", url);
            xhr.send();

            const product_list = document.getElementById("product-list");
            product_list.classList.add("product-list-container");

            const product = document.createElement("div");
            product.classList.add("product");

            const product_name_containet = document.createElement("div");
            product_name_containet.classList.add("product-name");
            const product_name = document.createElement("p");
            product_name.classList.add("big", "mediumweight");
            product_name.textContent = doc.data().name;
            product_name_containet.appendChild(product_name);
            product.appendChild(product_name_containet);

            const product_image_container = document.createElement("div");
            product_image_container.classList.add("product-image-container");
            const product_image = document.createElement("img");
            product_image.classList.add("product-image");
            product_image.src = url;
            product_image.alt = "error";
            const product_image_sale = document.createElement("div");
            product_image_sale.classList.add("product-image-sale");
            const product_image_sale_text = document.createElement("p");
            product_image_sale_text.textContent = "Super Sale!";
            product_image_container.appendChild(product_image);
            product_image_container.appendChild(product_image_sale);
            product_image_sale.appendChild(product_image_sale_text);
            product.appendChild(product_image_container);

            const product_price = document.createElement("div");
            product_price.classList.add("product-price");
            const product_price_container = document.createElement("div");
            product_price_container.classList.add("product-price-container");
            const product_price_text = document.createElement("p");
            product_price_text.textContent = doc.data().price + " €";
            product_price_text.classList.add("big", "product-price-text");
            const product_sale_price_text = document.createElement("p");
            product_sale_price_text.classList.add("big", "product-price-text");
            const product_sale_price_text_del = document.createElement("del");
            const del_node = document.createTextNode(doc.data().sale + " €");
            product_sale_price_text_del.appendChild(del_node);
            product_sale_price_text.appendChild(product_sale_price_text_del);
            const add_product_button = document.createElement("button");
            add_product_button.classList.add("bigbutton", "add-product-button");
            add_product_button.id = doc.data().name;
            add_product_button.type = "button";
            add_product_button.addEventListener("click", AddToBasket);
            const add_product_button_text =
               document.createTextNode("Add to Cart");
            add_product_button.appendChild(add_product_button_text);
            product_price_container.appendChild(product_price_text);
            product_price_container.appendChild(product_sale_price_text);
            product_price.appendChild(product_price_container);
            product_price.appendChild(add_product_button);
            product.appendChild(product_price);

            product_list.appendChild(product);
         })
         .catch((error) => {
            console.log("Error getting image: " + error);
         });
   });
}

async function AddToBasket() {
   const db = getFirestore(app);
   currentEmail = "polberci@yahoo.ro";

   const docRef = doc(db, "produse_blog", this.id);
   const productSnap = await getDoc(docRef);

   if (productSnap.exists()) {
      const db = getFirestore(app);
      const docRef = doc(db, currentEmail, this.id);
      const accountSnap = await getDoc(docRef);

      if (accountSnap.exists()) {
         let accountProduct = accountSnap.data();
         accountProduct.count++;

         await setDoc(doc(db, currentEmail, this.id), accountProduct);
         return;
      }
      let product = productSnap.data();
      product.count = 0;
      console.log(product.count);
      await setDoc(doc(db, currentEmail, this.id), product);
   } else {
      console.log("No such document!");
   }
}

async function RemoveFromBasket() {
   const db = getFirestore(app);
   currentEmail = "polberci@yahoo.ro";

   const docRef = doc(db, currentEmail, this.id);
   const productSnap = await getDoc(docRef);

   if (productSnap.exists()) {
      let product = productSnap.data();
      if (product.count <= 0) {
         console.log(this.id);
         await deleteDoc(doc(db, currentEmail, this.id));
         LoadBasket();
         return;
      }
      product.count--;
      console.log(product.count);
      await setDoc(doc(db, currentEmail, this.id), product);
   } else {
      console.log("No such document!");
   }
}

var total = 0;

async function LoadBasket() {
   const db = getFirestore(app);
   currentEmail = "polberci@yahoo.ro";

   const q = query(collection(db, currentEmail));
   const querySnapshop = await getDocs(q);
   querySnapshop.forEach((doc) => {
      let accountData = doc.data();
      total = doc.data().price;

      const product_list = document.getElementById("product-list");

      const product = document.createElement("div");
      product.classList.add("product");

      const product_image_container = document.createElement("div");
      product_image_container.classList.add("product-image-container");
      const product_image = document.createElement("img");
      product_image.classList.add("product-image");
      product_image.src = "/default/default.png";
      product_image.alt = "error";
      product_image_container.appendChild(product_image);
      product.appendChild(product_image_container);

      const product_details = document.createElement("div");
      product_details.classList.add("product-details");
      const product_name = document.createElement("p");
      product_name.classList.add("big", "product-price-text", "mediumweight");
      const product_name_text = document.createTextNode(accountData.name);
      product_name.appendChild(product_name_text);
      const product_price_text = document.createElement("p");
      product_price_text.classList.add("big", "product-price-text");
      const product_price_var = document.createTextNode(
         accountData.price + " €"
      );
      product_price_text.appendChild(product_price_var);
      product_details.appendChild(product_name);
      product_details.appendChild(product_price_text);
      product.appendChild(product_details);

      const remove_product_button = document.createElement("button");
      remove_product_button.type = "button";
      remove_product_button.classList.add("bigbutton", "remove-product-button");
      remove_product_button.id = accountData.name;
      remove_product_button.addEventListener("click", RemoveFromBasket);
      const remove_product_button_text = document.createTextNode("Remove");
      remove_product_button.appendChild(remove_product_button_text);
      product.appendChild(remove_product_button);

      product_list.appendChild(product);
   });

   const total_price = document.getElementById("total-price");
   total_price.textContent = "Total Price: " + total + " €";
}

///
/// Objects
///

const productConverter = {
   toFirestore: (product) => {
      return {
         name: product.name,
         price: product.price,
         sale: product.sale.toString(),
      };
   },
   fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new Product(data.name, data.price, data.sale);
   },
};

class Product {
   constructor(name, price, sale) {
      this.name = name;
      this.price = price;
      this.sale = sale;
   }
   toString() {
      return this.name + ", " + this.price + ", " + this.sale;
   }
}
