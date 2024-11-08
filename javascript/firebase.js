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
   updateDoc,
   collectionGroup,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
   getStorage,
   ref,
   uploadBytes,
   getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const firebaseConfig = {
   apiKey: "AIzaSyCTqwXevwoUAxf2oC7LAKSeFxP-CJ2W_3k",
   authDomain: "flutter-85128.firebaseapp.com",
   databaseURL:
      "https://flutter-85128-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "flutter-85128",
   storageBucket: "flutter-85128.appspot.com",
   messagingSenderId: "875733790804",
   appId: "1:875733790804:web:97c331ecf936c7637e3dc1",
};

// Get the variable value from localStorage on another page
var currentEmail = localStorage.getItem("myVariable");

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
   const dropdown = document.getElementById("filter");
   dropdown.addEventListener("change", LoadProducts);
   const checkbox = document.getElementById("sale-filter");
   checkbox.addEventListener("change", LoadProducts);
   const logout = document.getElementById("logout-page-button");
   logout.addEventListener("click", Logout);
   await LoadMarker();
   LoadProducts();
} else if (lastPart == "basket") {
   const logout = document.getElementById("logout-page-button");
   logout.addEventListener("click", Logout);
   LoadBasket();
} else if (lastPart == "about") {
   const logout = document.getElementById("logout-page-button");
   logout.addEventListener("click", Logout);
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
         window.location.href = "/html/login.html";
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
         //currentEmail = userCredential.user.email;
         localStorage.setItem("myVariable", userCredential.user.email);
         currentEmail = localStorage.getItem("myVariable");
         window.location.href = "/html/about.html";
      })
      .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         console.log(errorCode + "/n" + errorMessage);
      });
}

function Logout() {
   signOut(auth)
      .then(() => {
         currentEmail = "";
         window.location.href = "/html/login.html";
      })
      .catch((error) => {
         console.log(error.message);
      });
}

///
/// Firestore
///

async function AddProduct() {
   const db = getFirestore(app);
   const product_name = document.getElementById("product-name").value;
   const product_type = document.getElementById("product-type").value;
   var product_price = document.getElementById("product-price").value;
   const product_sale_price =
      document.getElementById("product-sale-price").value;

   var new_price;
   if (product_sale_price == 0 || product_sale_price == "") {
      new_price = product_price;
      product_price = 0;
   } else {
      new_price = product_price - product_sale_price;
      console.log(new_price);
   }

   const docRef1 = doc(db, "type", product_type);

   const docSnap = await getDoc(docRef1);

   if (docSnap.exists()) {
      let type = docSnap.data();
      type.count++;
      await updateDoc(docRef1, type);
   } else {
      await setDoc(docRef1, {
         count: 1,
      });
   }

   const docRef2 = doc(db, product_type, product_name).withConverter(
      productConverter
   );
   try {
      await setDoc(
         docRef2,
         new Product(product_name, new_price, product_price)
      );
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

   const imageLocation = "products/" + product_name;
   const imgRef = ref(storage, imageLocation);

   uploadBytes(imgRef, file).then((snapshop) => {
      console.log("Uploaded Photo");
   });
}

async function LoadMarker() {
   const db = getFirestore(app);
   const filter = document.getElementById("filter");

   const q1 = query(collection(db, "type"));

   const querySnapshop1 = await getDocs(q1);

   querySnapshop1.forEach((type) => {
      const option = document.createElement("option");
      const option_text = document.createTextNode(
         capitalizeFirstLetter(type.id)
      );
      option.appendChild(option_text);
      option.value = type.id;
      filter.appendChild(option);
   });
}

async function LoadProducts() {
   const db = getFirestore(app);
   const filter = document.getElementById("filter");
   const sale_filter = document.getElementById("sale-filter");

   const docRef = doc(db, "type", filter.value);
   const docSnap = await getDoc(docRef);

   const filter_number = document.getElementById("filter-number");
   filter_number.innerHTML = "";
   const filter_number_text = document.createTextNode(
      "Found: " + docSnap.data().count
   );
   filter_number.appendChild(filter_number_text);

   const product_list = document.getElementById("product-list");
   product_list.innerHTML = "";
   const q3 = query(collection(db, filter.value));
   const querySnapshop3 = await getDocs(q3);
   querySnapshop3.forEach((_productData) => {
      let _product = _productData.data();
      if (sale_filter.checked == true && _product.sale == 0) {
         return;
      }

      const storage = getStorage();
      const imageLocation = "products/" + _product.name;
      const imageRef = ref(storage, imageLocation);

      _product.name = capitalizeFirstLetter(_product.name);

      getDownloadURL(imageRef)
         .then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = (event) => {
               const blob = xhr.response;
            };
            xhr.open("GET", url);
            xhr.send();

            product_list.classList.add("product-list-container");

            const product = document.createElement("div");
            product.classList.add("product");

            const product_name_containet = document.createElement("div");
            product_name_containet.classList.add("product-name");
            const product_name = document.createElement("p");
            product_name.classList.add("big", "mediumweight");
            product_name.textContent = _product.name;
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
            product_image_sale_text.classList.add(
               "big",
               "bigweight",
               "product-sale"
            );
            if (_product.sale != 0) {
               product_image_sale_text.textContent = "Super Sale!";
            } else {
               product_image_sale_text.textContent = "";
            }
            product_image_container.appendChild(product_image);
            product_image_container.appendChild(product_image_sale);
            product_image_sale.appendChild(product_image_sale_text);
            product.appendChild(product_image_container);

            const product_price = document.createElement("div");
            product_price.classList.add("product-price");
            const product_price_container = document.createElement("div");
            product_price_container.classList.add("product-price-container");
            const product_price_text = document.createElement("p");
            product_price_text.textContent = _product.price + " €";
            product_price_text.classList.add("big", "product-price-text");
            const product_sale_price_text = document.createElement("p");
            product_sale_price_text.classList.add("big", "product-price-text");
            const product_sale_price_text_del = document.createElement("del");
            var del_node;
            if (_product.sale == 0) {
               del_node = document.createTextNode("");
            } else {
               del_node = document.createTextNode(_product.sale + " €");
            }
            product_sale_price_text_del.appendChild(del_node);
            product_sale_price_text.appendChild(product_sale_price_text_del);
            const add_product_button = document.createElement("button");
            add_product_button.classList.add(
               "bigbutton",
               "add-product-button",
               "button1"
            );
            add_product_button.id =
               filter.value + "/" + _product.name.toLowerCase();
            add_product_button.type = "button";
            add_product_button.addEventListener("click", AddToBasket);
            const span = document.createElement("span");
            span.innerHTML = "Add to Cart";
            add_product_button.appendChild(span);
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

   const loc = this.id.split("/");
   loc[1] = capitalizeEachWord(loc[1]);
   const docRef = doc(db, loc[0], loc[1]);

   const productSnap = await getDoc(docRef);
   console.log(currentEmail);
   if (productSnap.exists()) {
      const docRef = doc(db, currentEmail, loc[1]);
      const accountSnap = await getDoc(docRef);

      if (accountSnap.exists()) {
         let accountProduct = accountSnap.data();
         accountProduct.count++;
         await setDoc(doc(db, currentEmail, loc[1]), accountProduct);
         return;
      }
      let product = productSnap.data();
      product.count = 1;
      await setDoc(doc(db, currentEmail, loc[1]), product);
   } else {
      console.log("No such document!");
   }
}

async function RemoveFromBasket() {
   const db = getFirestore(app);

   const loc = this.id.split("/");

   const docRef = doc(db, currentEmail, this.id);
   const productSnap = await getDoc(docRef);

   if (productSnap.exists()) {
      let product = productSnap.data();
      product.count--;
      if (product.count <= 0) {
         loc[1] = capitalizeFirstLetter(loc[0]);
         await deleteDoc(doc(db, currentEmail, loc[0]));
         LoadBasket();
         return;
      }

      await setDoc(doc(db, currentEmail, this.id), product);
   } else {
      console.log("No such document!");
   }
}

var total = 0;

async function LoadBasket() {
   const db = getFirestore(app);

   const q = query(collection(db, currentEmail));

   const product_list = document.getElementById("product-list");
   product_list.innerHTML = "";
   const querySnapshop = await getDocs(q);
   total = 0;
   querySnapshop.forEach((doc) => {
      let accountData = doc.data();
      total = total + doc.data().count * parseInt(doc.data().price);

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
      const product_name_text = document.createTextNode(
         capitalizeFirstLetter(accountData.name)
      );
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

      const product_count_container = document.createElement("div");
      product_count_container.classList.add("product-count-container");
      const product_count = document.createElement("p");
      product_count.classList.add("product-count", "big");
      product_count.innerHTML = "Total: " + accountData.count;
      product_count_container.appendChild(product_count);
      product.appendChild(product_count_container);

      const remove_product_button = document.createElement("button");
      remove_product_button.type = "button";
      remove_product_button.classList.add(
         "bigbutton",
         "remove-product-button",
         "button1"
      );
      remove_product_button.id = accountData.name;
      remove_product_button.addEventListener("click", RemoveFromBasket);
      remove_product_button.addEventListener("click", LoadBasket);
      const span = document.createElement("span");
      span.innerHTML = "Remove";
      remove_product_button.appendChild(span);
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

///
/// Special Functions
///

function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeEachWord(str) {
   // Split the string into an array of words
   const words = str.split(" ");

   // Capitalize the first letter of each word
   const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
   );

   // Join the words back into a single string
   const capitalizedStr = capitalizedWords.join(" ");

   return capitalizedStr;
}
