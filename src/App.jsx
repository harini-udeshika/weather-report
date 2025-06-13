import { useEffect, useState, useCallback } from 'react'
import './App.css'
import { getWeather } from './api'
import Loading from './components/Loading'
import { SearchBar } from './components/SearchBar/SearchBar'
import { debounce } from 'lodash';
import Greeting from './components/Greeting/Greeting'
import WeatherData from './components/WeatherData/WeatherData'

function App() {
  const [weatherData, setWeatherData] = useState()
  const [location, setLocation] = useState('Colombo')
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWeather(location)
      .then((data) => {
        setWeatherData(data)
        setLoading(false)
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
    <div className='container'>
      <div className='header'>
        <Greeting />
        <SearchBar
          searchInput={searchInput}
          suggestions={suggestions}
          handleSearch={handleSearch}
          handleChange={handleChange}
          handleSelect={handleSelect}
        />
      </div>




      {!loading ? (
        <>
          <WeatherData weatherData={weatherData} />
        </>
      ) : (
        <Loading />
      )}

    </div>
  )
}

export default App
