import { useEffect, useState, useCallback } from 'react'
import './App.css'
import { getWeather } from './api'
import Loading from './components/Loading'
import { SearchBar } from './components/SearchBar/SearchBar'
import { debounce, set } from 'lodash';
import Greeting from './components/Greeting/Greeting'
import WeatherData from './components/WeatherData/WeatherData'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'
import WeatherToday from './components/WeatherToday/WatherToday'

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
        toast.info("Weather data updated successfully!");
        console.log("Weather data for", location, ":", data)
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error fetching weather data:", error)
        toast.error(error.status + "Failed to fetch weather data. Please try again later.");
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
          toast.info("Weather data updated successfully!");
          setSearchInput('')
          setSuggestions([]);
          console.log('Weather data for', searchInput, ':', data)
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error)
          toast.error("Failed to fetch weather data. Please try again later.");
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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
        transition={Bounce}
      />

      {!loading ? (
        <>
          {weatherData ? (

            <>
              <WeatherData weatherData={weatherData} />
              <WeatherToday weatherData={weatherData}/>
            </>

          ) : (<p>Something went wrong while fetching data ...</p>)}
        </>
      ) : (
        <Loading />
      )}

    </div>
  )
}

export default App
