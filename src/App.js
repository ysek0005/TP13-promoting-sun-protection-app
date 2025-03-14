import React, { useEffect, useState } from "react";
import { Search, Sun, CloudRain, CloudSnow, Cloud, Wind, CloudLightning, Timer, MapPin } from "lucide-react";
import { Card } from "./components/ui/Card";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { fetchCancerRateData, fetchCancerGenderData, fetchWeatherData, fetchProtectionRecommendations } from "./services/api";
import SunSVG from "./components/ui/SunSVG"; // Import your custom SVG component


// Function to determine the recommended SPF level
const getSunscreenRecommendation = (uvIndex, skinType) => {


  const uv = parseFloat(uvIndex);
  const skin = skinType.toLowerCase();

  if (uv <= 2) return "No sunscreen needed 🌿"; // Low UV level
  if (uv <= 5) return skin === "dark" ? "Sunscreen SPF 30 recommended" : "Sunscreen SPF 50 recommended";
  if (uv <= 7) return skin === "light" ? "Sunscreen SPF 50 highly recommended" : "Sunscreen SPF 30 recommended";
  return "Sunscreen SPF 50 is a must! 🔥"; // Very High or Extreme UV
};
// Function to determine UV index color and category
const getUVInfo = (uvIndex) => {
  if (uvIndex <= 2) return { label: "Low", color: "text-green-500", sunColor: "green", count: 1 };
  if (uvIndex <= 5) return { label: "Moderate", color: "text-yellow-400", sunColor: "yellow", count: 2 };
  if (uvIndex <= 7) return { label: "High", color: "text-orange-500", sunColor: "orange", count: 3 };
  if (uvIndex <= 10) return { label: "Very High", color: "text-red-500", sunColor: "red", count: 4 };
  return { label: "Extreme", color: "text-purple-600", sunColor: "purple", count: 5 };
};

// Function to get appropriate weather icon
const getWeatherIcon = (weatherDescription) => {
  const lowerCaseWeather = weatherDescription.toLowerCase();

  if (lowerCaseWeather.includes("clear")) {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="flex justify-center items-center"
      >
        <Sun size={50} color="yellow" />
      </motion.div>
    );
  }
  if (lowerCaseWeather.includes("cloud")) return <Cloud size={50} color="gray" />;
  if (lowerCaseWeather.includes("rain")) return <CloudRain size={50} color="blue" />;
  if (lowerCaseWeather.includes("thunderstorm")) return <CloudLightning size={50} color="purple" />;
  if (lowerCaseWeather.includes("snow")) return <CloudSnow size={50} color="lightblue" />;
  if (lowerCaseWeather.includes("wind")) return <Wind size={50} color="white" />;

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      className="flex justify-center items-center"
    >
      <Sun size={50} color="yellow" />
    </motion.div>
  );
};

export default function App() {
  const COLORS = [ "#FFBB28", "#00C49F"];
  const [protectionItems, setProtectionItems] = useState([]);

  const [cancerRateData, setCancerRateData] = useState([]);
  const [genderRateData , setGenderData] = useState([{ name: "Male", value: 80 }, { name: "Female", value: 20 }]);

  const [searchCity, setSearchCity] = useState(""); // Store user input
  const [weather, setWeather] = useState({ temperature: "N/A", uvIndex: 1, suburb: "Unknown", weather: "Enter your current Location to search" });
  // Get UV details
  const uvIndex = weather?.uvIndex ? parseFloat(weather.uvIndex) : 0;
  const { label, color, sunColor, count } = getUVInfo(uvIndex);
  // Get local strage data (blank if not exsisting)
  const [age, setAge] = useState(localStorage.getItem("age") || "24");
  const [gender, setGender] = useState(localStorage.getItem("gender") || "female");
  const [skinType, setSkinType] = useState(localStorage.getItem("skinType") || "dark");


  useEffect(() => {
    const getProtectionData = async () => {
      if (gender && uvIndex) {
        const items = await fetchProtectionRecommendations(gender, uvIndex);
        setProtectionItems(items);
      }
    };
  
    getProtectionData();
  }, [gender, uvIndex]); // Runs when gender or UV level changes
  

  // Function to fetch weather when user clicks search
  const handleSearch = async () => {
    if (!searchCity) return; // Prevent empty searches

    const weatherData = await fetchWeatherData(searchCity);
    if (weatherData) {
      setWeather(weatherData);
    }
  };


  // Fetch cancer rate data by gender from AWS API
  useEffect(() => {
    async function getData() {
      const apiData = await fetchCancerGenderData();
      
      // Format data for Recharts
      const formattedData = apiData.map(item => ({
        name: item.gender,
        value: item.rate,
      }));
      
      setGenderData(formattedData);
    }
    
    getData();
  }, []);

  // Fetch cancer rate data from AWS API
  useEffect(() => {
    async function getData() {
      const apiData = await fetchCancerRateData();
      
      // Format data for Recharts
      const formattedData = apiData.map(item => ({
        year: item.year,
        rate: item.rate,
        gender: item.gender
      }));
      
      setCancerRateData(formattedData);
    }
    
    getData();
  }, []);

  

  // Store user info at local strage everytime user update info
  useEffect(() => {
    if (age !== "") localStorage.setItem("age", age);
  }, [age]);

  useEffect(() => {
    if (gender !== "") localStorage.setItem("gender", gender);
  }, [gender]);

  useEffect(() => {
    if (skinType !== "") localStorage.setItem("skinType", skinType);
  }, [skinType]);

  const [timerOn, setTimerOn] = useState(false); // Whether timer is on or off. Off by default
  const [timeLeft, setTimeLeft] = useState(10); // Timer time. 10 seconds for testing purpose
  const [showPopup, setShowPopup] = useState(false);
  
  // Get data when timer started from local storage (cookkie)
  useEffect(() => {
    const savedTime = parseInt(localStorage.getItem("sunscreenTimerStart"), 10);
    if (savedTime) {
      const elapsed = Math.floor((Date.now() - savedTime) / 1000);
      const remainingTime = 10 - elapsed; // Timer 10 seconds for testing purpose
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setTimerOn(true);
      } else {
        setShowPopup(true);
        setTimeLeft(0);
      }
    }
  }, []);

  useEffect(() => {
    if (timerOn && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setShowPopup(true); // Show popup when timer goes 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [timerOn, timeLeft]);

  const toggleTimer = () => {
    if (timerOn) {
      setTimerOn(false);
      setTimeLeft(10);
      localStorage.removeItem("sunscreenTimerStart");
    } else {
      setTimerOn(true);
      localStorage.setItem("sunscreenTimerStart", Date.now());
      setTimeLeft(10); // Timer 10 seconds for testing purpose
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const closePopup = () => {
    setShowPopup(false);
    setTimerOn(false); // Stop restarting automatically
    setTimeLeft(10);   // Timer 10 seconds for testing purpose
    localStorage.removeItem("sunscreenTimerStart"); // Remove local storage
  };
  

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-cyan-300">UV Guardian</h1>

      <div className="grid grid-cols-3 gap-4 mt-6">
       
        {/* Location Search */}
        <Card className="p-4 flex flex-col  border border-gray-700 shadow-xl">
          <h2 className="text-lg">Enter Location</h2>
          <div className="flex mt-2">
            <input
              className="flex-1 p-2 rounded-md text-black"
              type="text"
              placeholder="Enter suburb (e.g., Clayton)"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <button
              className="ml-2 bg-purple-600 p-2 rounded-md"
              onClick={handleSearch}
            >
              <Search size={20} />
            </button>
          </div>
        </Card>

        

        {/* User Info */}
        <Card className="p-4 flex flex-col  border border-gray-700 shadow-xl">
          <h2 className="text-lg">Age</h2>
          <input className="p-2 rounded-md w-full mt-2 text-black" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          <h2 className="text-lg mt-4">Gender</h2>
          <select className="p-2 rounded-md w-full mt-2 text-black" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option>Male</option>
            <option>Female</option>
          </select>
          <h2 className="text-lg mt-4">Skin Type</h2>
          <select className="p-2 rounded-md w-full mt-2 text-black" value={skinType} onChange={(e) => setSkinType(e.target.value)}>
            <option value="Light">Light Skin</option>
            <option value="Medium" >Medium Skin</option>
            <option value="Dark">Dark Skin</option>
          </select>
        </Card>

        {/* Cancer Rate Trend Card */}
        <Card className="p-6 flex flex-col border border-gray-700 shadow-xl">
          <h2 className="text-xl font-semibold text-center mb-4">Cancer Rate Trend (1982 - Present)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cancerRateData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
              {/* Grid for better readability */}
              <CartesianGrid strokeDasharray="3 3" stroke="gray" />
              <XAxis dataKey="year" stroke="#FFFFFF" tick={{ fill: "#FFFFFF" }}>
                <text x="50%" y={325} textAnchor="middle" fill="#FFFFFF" fontSize="14px">
                  Year
                </text>
              </XAxis>
              <YAxis stroke="#FFFFFF" tick={{ fill: "#FFFFFF" }}>
                <text transform="rotate(-90)" x={-150} y={10} textAnchor="middle" fill="#FFFFFF" fontSize="14px">
                  Cancer Rate (per 100,000)
                </text>
              </YAxis>
              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#FFF", borderRadius: "8px" }} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ color: "#FFFFFF" }} />
              <Line type="monotone" dataKey="rate" stroke="#D926A9" strokeWidth={3} dot={{ fill: "#FFFFFF", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>

          {/* Message on Sun Protection */}
          <p className="text-sm text-gray-400 mt-4 text-center">
            🌞 <strong>Protect Your Skin!</strong> Skin cancer rates have steadily increased over the years.  
            Wearing <strong>sunscreen</strong>, seeking <strong>shade</strong>, and wearing <strong>protective clothing</strong> can <strong>reduce your risk</strong>.
          </p>
        </Card>

      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* Weather Info */}
        <Card className="p-6 flex flex-col justify-center items-center border border-gray-700 shadow-xl">
          <h2 className="text-xl font-semibold justify-center flex items-center">
            <MapPin className="mr-2 " /> {weather ? weather.suburb : "City"}
          </h2>
          <p className="text-3xl flex flex-col justify-center  items-center mt-2">
            {weather ? `${weather.temperature}°C` : "--"}
          </p>
          <div className="flex justify-center items-center">
          {weather ? getWeatherIcon(weather.weather) : <Sun size={50} color="yellow" />}
          
          </div>
          <div className="flex justify-center items-center">
          <p className="text-lg mt-1 capitalize flex flex-col justify-center ">
            {weather ? weather.weather : "Enter a city to get weather"}
          </p>
          </div>
          <div className={`p-6 flex flex-col items-center ${color}`}>
          <h2 className={`mt-2 ${color} flex flex-col justify-center `}>
            UV Index: {weather ? weather.uvIndex : "--"}
          </h2>
          <p className= {`flex flex-col justify-center text-lg font-bold ${color}`}>{label}</p>

          {/* Sun Icon Visualization */}
          <div className="flex mt-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <SunSVG
              key={index}
              size={30}
              color={index < count ? sunColor : "gray"}
            />
             
            ))}
          </div>
          </div>
        </Card>

       {/* Protection Info */}
        <Card className="p-6 flex flex-col h-full border border-gray-700 shadow-xl">
          {/* Title */}
          <h2 className="text-lg font-semibold">Protection</h2> 

          {/* Sunscreen Recommendation - Expands to push Reminder Card down */}
          <p className="text-2xl font-bold mt-4 text-center flex-grow flex items-center justify-center">
            {getSunscreenRecommendation(weather?.uvIndex, skinType)}
          </p>

          {/* Protection Gallery */}
          {protectionItems.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Recommended Protection Items</h3>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {protectionItems.map((item) => (
                  <div key={item.record_id} className="flex flex-col items-center bg-gray-800 p-4 rounded-lg">
                    <img src={item.img_link} alt={item.item_name} className="w-24 h-24 object-cover rounded-md shadow-lg" />
                    <p className="text-sm font-semibold mt-2">{item.item_name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add spacing before Reminder Card */}
          <div className="mt-40 "></div> 

          {/* Reminder Card - Sticks to the Bottom */}
          <div className="mt-auto w-full">
            <Card className="p-4 flex flex-col border border-gray-700 shadow-xl">
              <h2 className="text-lg">Reapply Sunscreen Reminder</h2>
              <div className="flex justify-between items-center mt-2">
                <Timer size={30} color={timeLeft === 0 ? "red" : "green"} />
                <p className="text-3xl ml-2">{formatTime(timeLeft)}</p>
                <button
                  className={`ml-4 px-4 py-2 rounded-md ${timerOn ? "bg-red-500" : "bg-green-500"}`}
                  onClick={toggleTimer}
                >
                  {timerOn ? "Stop" : "Start"}
                </button>
              </div>
            </Card>
          </div>
        </Card>



        {/* Gender-based Skin Cancer Rate Pie Chart */}
        <Card className="p-6 border border-gray-700 shadow-xl flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Male vs. Female Skin Cancer Rate</h2>

          {/* Enhanced Pie Chart */}
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderRateData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50} 
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`} 
              >
                {genderRateData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#FFF", borderRadius: "8px" }} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>

          {/* Message on Gender-based Risks */}
          <p className="text-sm text-gray-400 mt-4 text-center">
            ⚠️ <strong>Men have a higher risk of skin cancer.</strong> Studies show that males are less likely to use sunscreen,  
            leading to <strong>higher rates of skin damage and cancer</strong>. <strong>Protect yourself</strong> by applying sunscreen daily!
          </p>
        </Card>

       

     
      
      </div>
  {/* Pop-up Alert */}
  {showPopup && (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closePopup} // Clicking outside the popup closes it
    >
      <div
        className="bg-white p-6 rounded-md text-black shadow-lg w-96 relative z-50"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        <h2 className="text-lg font-bold text-red-600">Reapply Sunscreen!</h2>
        <p className="mt-2">It's been 3 hours. Time to protect your skin again.</p>
        
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none"
          onClick={(e) => {
            e.stopPropagation(); // Prevents event bubbling
            closePopup(); // Closes the popup
          }}
        >
          Got it
        </button>
      </div>
    </div>
  )}

      
    </div>
  );
}


