import { useEffect, useState } from 'react'
import './App.css'
import { getWeather } from './api'
import appLogo from './assets/weather-app.png'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import Loading from './components/Loading'

function App() {
  const [weatherData, setWeatherData] = useState()
  const [location, setLocation] = useState('Colombo')
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])

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

  const fetchSuggestions = (input) => {
    if (!window.google) return;

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input, types: ['(cities)'] },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.map(pred => ({
            description: pred.description,
            placeId: pred.place_id
          })))
        } else {
          setSuggestions([])
        }
      }
    );
  };

  const handleChange = (event) => {
    const value = event.target.value
    setSearchInput(value)
    if (value) {
      fetchSuggestions(value)
    } else {
      setSuggestions([])
    }
  }

  const handleSelect = (description) => {
    setSearchInput(description)
    setSuggestions([])
  }

  const handleSearch = async (event) => {
    if (!searchInput && suggestions.length > 0) {
      setSearchInput(suggestions[0].description);
    }

    event.preventDefault()
    if (searchInput) {
      getWeather(searchInput)
        .then((data) => {
          setWeatherData(data)
          console.log('Weather data for', searchInput, ':', data)
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error)
        })
    }
  }

  return (
    <div className="App">
      <img src={appLogo} className="logo" alt="logo" />
      <header className="App-header">
        <h1>Simple Weather App</h1>
        <div>
          <div style={{ position: 'relative', width: '100%', maxWidth: 400, margin: '0 auto' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex' }}>
              <input
                type="text"
                placeholder="Search for a city"
                value={searchInput}
                onChange={handleChange}
                style={{ flex: 1, padding: '10px', borderRadius: '6px 0 0 6px', border: '1px solid #ccc' }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#2b915d',
                  border: 'none',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '0 6px 6px 0',
                  cursor: 'pointer'
                }}
              >
                <FaMagnifyingGlass />
              </button>
            </form>

            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((item, index) => (
                  <li key={index} onClick={() => handleSelect(item.description)}>
                    {item.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {weatherData ? (
          <div>
            <h2>Weather in {weatherData.location.name}</h2>
            <p>Temperature: {weatherData.current.temp_c}°C</p>
            <p>Condition: {weatherData.current.condition.text}</p>
            <p>Humidity: {weatherData.current.humidity}</p>
            <p>Wind speed: {weatherData.current.wind_kph} kph</p>
            <p>UV index: {weatherData.current.uv}</p>
          </div>
        ) : (
          <Loading/>
        )}
      </header>
    </div>
  )
}

export default App
