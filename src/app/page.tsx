"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiNightClear,
  WiDayCloudy,
  WiRaindrops,
  WiSmoke,
  WiDust, 
} from "react-icons/wi";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const API_KEY = "e3a3007c80f1a8d5cc6347f061c1282a";

// Weather Icons
const getWeatherIcon = (main: string, description: string, isNight: boolean) => {
  const condition = description.toLowerCase();
  const mainLower = main.toLowerCase();

  if (mainLower === "clear") {
    return isNight ? (
      <WiNightClear className="text-6xl text-yellow-300" />
    ) : (
      <WiDaySunny className="text-6xl text-yellow-400" />
    );
  }

  if (mainLower === "clouds") {
    return condition.includes("few") || condition.includes("scattered") ? (
      <WiDayCloudy className="text-6xl text-gray-300" />
    ) : (
      <WiCloudy className="text-6xl text-gray-400" />
    );
  }

  if (mainLower === "rain") {
    return condition.includes("light") ? (
      <WiRaindrops className="text-6xl text-blue-300" />
    ) : (
      <WiRain className="text-6xl text-blue-500" />
    );
  }

  if (mainLower === "drizzle") return <WiRaindrops className="text-6xl text-blue-300" />;
  if (mainLower === "snow") return <WiSnow className="text-6xl text-blue-200" />;
  if (mainLower === "thunderstorm") return <WiThunderstorm className="text-6xl text-yellow-500" />;
  if (["mist", "fog", "haze"].includes(mainLower)) return <WiFog className="text-6xl text-gray-400" />;
  if (mainLower === "smoke") return <WiSmoke className="text-6xl text-gray-400" />;
  if (mainLower === "dust") return <WiDust className="text-6xl text-yellow-300" />;

  return <WiCloudy className="text-6xl text-gray-400" />;
};

// Data Fetch
const fetchWeatherData = async (cityName: string) => {
  if (!cityName) throw new Error("Please enter a city name.");

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    // Simulated fallback
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve({
            name: cityName,
            main: { temp: 26 },
            weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
          });
        } else {
          reject(new Error("City not found or API unavailable."));
        }
      }, 1500);
    });
  }
};

// JSX Display
export default function Home() {
  const [city, setCity] = useState("");
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeatherData(city),
    enabled: false,
  });

  const handleSearch = () => {
    if (city.trim() !== "") {
      setFeedback(null);
      refetch();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full max-w-md p-6 bg-gradient-to-b from-sky-400 to-sky-600 rounded-2xl shadow-xl text-white mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Weather Finder</h1>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-3 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg font-semibold transition"
        >
          Search
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {isError && (
        <div className="text-center text-red-200 font-medium mt-4">
          {(error as Error).message}
        </div>
      )}

      {data && !isError && !isLoading && (
        <div className="text-center mt-6 space-y-3">
          <h2 className="text-xl font-semibold">{data.name}</h2>

          <div className="flex flex-col items-center space-y-1">
            {getWeatherIcon(
              data.weather[0].main,
              data.weather[0].description,
              data.weather[0].icon.includes("n")
            )}
            <p className="capitalize text-lg">{data.weather[0].description}</p>
          </div>

          <p className="text-3xl font-bold mt-2">
            {Math.round(data.main.temp)}°C
          </p>

          {/* Feedback */}
          <div className="flex justify-center items-center gap-6 mt-6">
            <button
              onClick={() => setFeedback("like")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                feedback === "like" ? "bg-green-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              <FaThumbsUp /> Like
            </button>
            <button
              onClick={() => setFeedback("dislike")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                feedback === "dislike" ? "bg-red-600" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              <FaThumbsDown /> Dislike
            </button>
          </div>

          {feedback && (
            <p className="text-sm text-white mt-2 italic">
              You {feedback === "like" ? "liked" : "disliked"} this weather update.
            </p>
          )}
        </div>
      )}
    </div>
  );
}