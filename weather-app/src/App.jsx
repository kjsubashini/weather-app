import React, { useState } from "react";
import WeatherCard from "./components/WeatherCard";
import { motion } from "framer-motion";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C"); // °C ↔ °F toggle

  // 🌈 Background color changes based on weather condition
  const getBackground = (code) => {
    if ([0, 1].includes(code)) return "from-yellow-200 to-blue-300"; // sunny
    if ([2, 3].includes(code)) return "from-gray-300 to-blue-200"; // cloudy
    if ([51, 61, 80].includes(code)) return "from-blue-400 to-blue-700"; // rainy
    if ([71].includes(code)) return "from-sky-100 to-blue-200"; // snowy
    if ([95].includes(code)) return "from-indigo-400 to-purple-600"; // thunderstorm
    return "from-indigo-300 to-slate-400"; // default
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("⚠️ Please enter a city name");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Get coordinates for the city
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("❌ City not found!");
        setWeather(null);
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2️⃣ Fetch weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      const { temperature, windspeed, weathercode } =
        weatherData.current_weather;

      setWeather({
        city: name,
        country,
        temperature,
        windspeed,
        weathercode,
        description: getWeatherDescription(weathercode),
      });
    } catch (err) {
      setError("⚠️ Something went wrong! Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Rime fog",
      51: "Light drizzle",
      61: "Light rain",
      71: "Light snow",
      80: "Rain showers",
      95: "Thunderstorm",
    };
    return weatherCodes[code] || "Unknown";
  };

  const toggleUnit = () => {
    if (!weather) return;
    if (unit === "C") {
      setUnit("F");
      setWeather({
        ...weather,
        temperature: (weather.temperature * 9) / 5 + 32,
      });
    } else {
      setUnit("C");
      setWeather({
        ...weather,
        temperature: ((weather.temperature - 32) * 5) / 9,
      });
    }
  };

  return (
    <motion.div
      key={weather?.weathercode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${getBackground(
        weather?.weathercode
      )} p-6 transition-all duration-700`}
    >
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-md">
          ☁️ Weather Now
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
          />
          <button
            onClick={fetchWeather}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-200 mb-2">{error}</p>}

        {loading && <p className="text-white animate-pulse">Loading...</p>}

        {weather && (
          <>
            <WeatherCard weather={weather} unit={unit} />
            <button
              onClick={toggleUnit}
              className="mt-4 bg-white/30 px-3 py-1 rounded-md text-white hover:bg-white/40 transition"
            >
              Switch to °{unit === "C" ? "F" : "C"}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
