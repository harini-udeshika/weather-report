import { useState } from 'react';
import WeatherMCP from '../../mcp/WeatherMCP';
import { getWeather } from '../../api';
import './DeepSeekChat.css';
function DeepSeekChat({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherSummary, setWeatherSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mcp = new WeatherMCP();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setWeatherData(null);
    setWeatherSummary('');

    try {
      // Step 1: Process user query with MCP to extract location
      const mcpResponse = await mcp.processQuery(query);

      if (mcpResponse.intent !== 'weather_request' || !mcpResponse.location) {
        throw new Error("Please ask about weather in a specific location (e.g., 'What's the weather in Paris?')");
      }

      // Step 2: Fetch raw weather data from weather API
      const rawWeatherData = await getWeather(mcpResponse.location);
      setWeatherData(rawWeatherData);

      // Step 3: Send raw data to DeepSeek for interpretation
      const summary = await interpretWeatherWithDeepSeek(rawWeatherData);
      setWeatherSummary(summary);

    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  // Interpret raw weather data with DeepSeek
  const interpretWeatherWithDeepSeek = async (weatherData) => {
    const prompt = {
      model: 'deepseek-chat',
      messages: [{
        role: 'system',
        content: `You are a weather presenter analyzing data for ${weatherData.location.name}, ${weatherData.location.country}.
    Create a 3-5 sentence summary with:
    1. Location context (always start with "In [city], [country]")
    2. Current temp in Celsius and Fahrenheit
    3. Weather condition
    4. Notable observations (unusual values)
    5. Friendly advice when appropriate
    6. 1-2 relevant emojis
    
    Current weather data:
    ${JSON.stringify(weatherData.current)}`
      }],
      temperature: 0.7
    };

    const deepSeekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (!deepSeekApiKey) {
      throw new Error("DEEPSEEK_API_KEY is not defined. Please set it in your environment variables.");
    }
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepSeekApiKey}`
      },
      body: JSON.stringify(prompt)
    });

    const data = await response.json();
    return data.choices[0].message.content;
  };
  if (!isOpen) return null;
  return (
    <div className="weather-dialog-overlay" onClick={onClose}>
      <div className="weather-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="dialog-close" onClick={onClose}>✖</button>
        <div className="weather-app">
          <h1>Weather Assistant</h1>

          <form onSubmit={handleSubmit} className="weather-search-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about weather in any location..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Get Weather"}
            </button>
          </form>

          {isLoading && <div className="loading">Consulting weather experts...</div>}

          {error && <div className="error">⚠️ {error}</div>}

          {weatherSummary && (
            <div className="weather-summary">
              <h2>
                Weather in {weatherData.location.name},{" "}
                {weatherData.location.country}
              </h2>
              <div className="summary-text">{weatherSummary}</div>

              <div className="detailed-data">
                <h3>Detailed Metrics:</h3>
                <ul>
                  <li>🌡️ Feels like: {weatherData.current.feelslike_c}°C</li>
                  <li>💧 Humidity: {weatherData.current.humidity}%</li>
                  <li>
                    🌬️ Wind: {weatherData.current.wind_kph} km/h{" "}
                    {weatherData.current.wind_dir}
                  </li>
                  <li>☀️ UV Index: {weatherData.current.uv}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeepSeekChat;