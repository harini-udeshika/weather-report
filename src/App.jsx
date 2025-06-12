import { useEffect, useState } from 'react'
import './App.css'
import { getWeather } from './api'
import appLogo from './assets/weather-app.png'
import { FaMagnifyingGlass } from 'react-icons/fa6'

function App() {
  const [weatherData, setWeatherData] = useState()
  const [location, setLocation] = useState('Colombo')
  useEffect(() => {
    getWeather(location)
      .then((data) => {
        setWeatherData(data)
        console.log("Weather data for", location, ":", data)
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error)
      })
  }, [])

  function handleSearch(event) {
    event.preventDefault()
    const searchInput = event.target.elements[0].value
    if (searchInput) {
      setLocation(searchInput)
      getWeather(searchInput)
        .then((data) => {
          setWeatherData(data)
          console.log("Weather data for", searchInput, ":", data)
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error)
        })
    }
  }
  return (
    <>
      <div className="App">
        <img src={appLogo} className="logo" alt="logo" />
        <header className="App-header">

          <h1>
            Simple Weather App
          </h1>
          <div>
            <form onSubmit={handleSearch}>
              <input type="text" placeholder="search for a city" name="city" />
              <button type="submit">
                <FaMagnifyingGlass />
              </button>
            </form>
          </div>
          {weatherData ? (
            <div>
              <h2>Weather in {location}</h2>
              <p>Temperature: {weatherData.current.temp_c}°C</p>
              <p>Condition: {weatherData.current.condition.text}</p>
              <p>Humidity: {weatherData.current.humidity}</p>
              <p>Wind speed: {weatherData.current.wind_kph} kph</p>
              <p>UV index: {weatherData.current.uv}</p>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}
        </header>
      </div>
    </>
  )
}

export default App
