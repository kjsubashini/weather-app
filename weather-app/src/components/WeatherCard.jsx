import React from "react";
import { motion } from "framer-motion";
import {
  Sun,
  CloudRain,
  Cloud,
  Snowflake,
  CloudLightning,
  Wind,
  CloudFog,
} from "lucide-react";

export default function WeatherCard({ weather, unit }) {
  const getIcon = (code) => {
    if ([0, 1].includes(code))
      return <Sun className="text-yellow-400 w-14 h-14" />;
    if ([2, 3].includes(code))
      return <Cloud className="text-gray-600 w-14 h-14" />;
    if ([51, 61, 80].includes(code))
      return <CloudRain className="text-blue-500 w-14 h-14" />;
    if ([71].includes(code))
      return <Snowflake className="text-blue-300 w-14 h-14" />;
    if ([45, 48].includes(code))
      return <CloudFog className="text-gray-400 w-14 h-14" />;
    if ([95].includes(code))
      return <CloudLightning className="text-yellow-500 w-14 h-14" />;
    return <Wind className="text-gray-400 w-14 h-14" />;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mt-6 p-5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-inner text-gray-800"
    >
      <div className="flex flex-col items-center">
        {getIcon(weather.weathercode)}
        <h2 className="text-2xl font-semibold mt-2">
          {weather.city}, {weather.country}
        </h2>
        <p className="text-lg mt-2">
          🌡️ Temperature: {weather.temperature.toFixed(1)}°{unit}
        </p>
        <p className="text-lg">💨 Wind Speed: {weather.windspeed} km/h</p>
        <p className="text-lg">🌈 Condition: {weather.description}</p>
      </div>
    </motion.div>
  );
}
