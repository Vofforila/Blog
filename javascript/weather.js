const apiKey = "005bb0ac06871192d00add342c16d3bc";
const city = "Bucharest";

fetch(
   `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=39.099724&lon=-94.578331&dt=1643803200&appid=${apiey}`
)
   .then((response) => {
      if (!response.ok) {
         throw new Error("Network response was not ok");
      }
      return response.json();
   })
   .then((data) => {
      // Process the response data and update UI
      console.log(data);
      const temperature = data.main.temp;
      const description = data.weather[0].description;
      // Update UI with temperature and weather description
      document.getElementById("temperature").textContent = `${temperature}°C`;
      document.getElementById("description").textContent = description;
   })
   .catch((error) => {
      // Handle errors
      console.error("Error fetching weather data:", error);
   });
