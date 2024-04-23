function getExhange(base_code) {
   const exhangeContainer = document.getElementById("exchange-holder");

   fetch(`https://open.er-api.com/v6/latest/${base_code}`)
      .then((response) => {
         if (!response.ok) {
            throw new Error("Network response was not ok");
         }
         return response.json();
      })
      .then((data) => {
         for (const currency in data.rates) {
            const rate = document.createElement("p");
            rate.textContent =
               base_code + " : " + data.rates[currency] + " " + currency;

            exhangeContainer.appendChild(rate);
         }
      })
      .catch((error) => {
         // Handle errors
         console.error("Error fetching exhange data:", error);
      });
}

getExhange("RON");
