const currentURL = window.location.href;
const parts = currentURL.split("/"); // Split the URL by '/'
let lastPart = parts[parts.length - 1]; // Get the last part

// Remove the .html extension if it exists
if (lastPart.endsWith(".html")) {
   lastPart = lastPart.slice(0, -5);
}

if (lastPart == "register" || lastPart == "login" || lastPart == "") {
   document
      .getElementById("login-page-button")
      .addEventListener("click", function () {
         location.href = "/html/login.html";
      });

   document
      .getElementById("register-page-button")
      .addEventListener("click", function () {
         location.href = "/html/register.html";
      });
} else if (lastPart == "about") {
   document
      .getElementById("market-page-button")
      .addEventListener("click", function () {
         location.href = "/html/market.html";
      });
   document
      .getElementById("logout-page-button")
      .addEventListener("click", function () {
         location.href = "/html/login.html";
      });
} else if (lastPart == "market") {
   document
      .getElementById("logout-page-button")
      .addEventListener("click", function () {
         location.href = "/html/login.html";
      });
   document
      .getElementById("about-page-button")
      .addEventListener("click", function () {
         location.href = "/html/about.html";
      });
} else if (lastPart == "basket") {
   document
      .getElementById("logout-page-button")
      .addEventListener("click", function () {
         location.href = "/html/login.html";
      });

   document
      .getElementById("market-page-button")
      .addEventListener("click", function () {
         location.href = "/html/market.html";
      });
}
