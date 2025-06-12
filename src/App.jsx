import { useEffect, useState, useCallback } from 'react'
import './App.css'
import { getWeather } from './api'
import appLogo from './assets/weather-app.png'
import Loading from './components/Loading'
import { SearchBar } from './components/SearchBar'
import { debounce } from 'lodash';

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

  const fetchSuggestions = useCallback(debounce((input) => {
    if (!window.google) return;

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input, types: ['(cities)'] },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.map(pred => ({
            description: pred.description,
            placeId: pred.place_id
          })));
        } else {
          setSuggestions([]);
        }
      }
    );
  }, 300), []);

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
          setSearchInput('')
          setSuggestions([]);
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
            <SearchBar
              searchInput={searchInput}
              suggestions={suggestions}
              handleSearch={handleSearch}
              handleChange={handleChange}
              handleSelect={handleSelect}
            />
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
          <Loading />
        )}
      </header>
    </div>
  )
}

export default App
