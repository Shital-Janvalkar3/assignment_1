const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 3000;
const apiKey = "581fcb089fbf757a09f68ac8c50a06a1";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Create a 'public' folder for stylesheets

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("weather", { weather: {} });
});

app.post("/getWeather", async (req, res) => {
  const cities = req.body.cities || [];

  const weatherData = {};

  for (const city of cities) {
    const temperature = await fetchTemperatureForCity(city);
    weatherData[city] = `${temperature}C`;
  }

  res.render("weather", { weather: weatherData });
});

async function fetchTemperatureForCity(city) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    return response.data.main.temp;
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error.message);
    return "N/A";
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
