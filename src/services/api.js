export async function fetchCancerRateData() {
    try {
      const response = await fetch("https://bx2a420ddi.execute-api.ap-southeast-2.amazonaws.com/cancer?datatype=history"); // Replace with your actual API URL
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching cancer rate data:", error);
      return [];
    }
  }

  export async function fetchCancerGenderData() {
    try {
      const response = await fetch("https://bx2a420ddi.execute-api.ap-southeast-2.amazonaws.com/cancer?datatype=gender"); // Replace with your actual API URL
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching cancer rate data:", error);
      return [];
    }
  }

  export async function fetchWeatherData(location) {
    try {
      const response = await fetch(
        `https://bx2a420ddi.execute-api.ap-southeast-2.amazonaws.com/location?place=${location}`
      );
  
      if (!response.ok) throw new Error("Failed to fetch weather data");
  
      const data = await response.json();
      return {
        suburb: data.location.locality,
        temperature: data.weather.current.temp,
        uvIndex: data.weather.current.uvi , // Some APIs may not provide UV index
        weather: data.weather.current.weather[0].description,
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  }

  export const fetchProtectionRecommendations = async (gender, uvLevel) => {
    try {
      const response = await fetch(
        `https://bx2a420ddi.execute-api.ap-southeast-2.amazonaws.com/protection?gender=${gender}&uv=${uvLevel}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch protection recommendations");
      }
  
      const data = await response.json();
      return data; // Returns an array of protection items
    } catch (error) {
      console.error("Error fetching protection recommendations:", error);
      return [];
    }
  };
  