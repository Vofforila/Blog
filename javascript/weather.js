const weatherContainer = document.getElementById("weather-holder");

function GetWeather(city) {
   fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3711678ae32fffdb5ba84b9485d55655`
   )
      .then((response) => {
         if (!response.ok) {
            throw new Error("Network response was not ok");
         }
         return response.json();
      })
      .then((data) => {
         const temperature = data.main.temp;
         const celsiutemperature = Math.round(temperature - 273.15);
         const description = data.weather[0].description;

         const weatherElement = document.createElement("p");
         weatherElement.textContent =
            city + " : " + description + " " + celsiutemperature + "°C";
         weatherContainer.appendChild(weatherElement);
      })
      .catch((error) => {
         // Handle errors
         console.error("Error fetching weather data:", error);
      });
}

GetWeather("Bucharest");
GetWeather("New York");
GetWeather("Paris");
