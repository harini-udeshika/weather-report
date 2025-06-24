import { useEffect, useState, useCallback } from 'react'
import './App.css'
import { getLocation, getWeather } from './api'
import Loading from './components/Loading'
import { SearchBar } from './components/SearchBar/SearchBar'
import { debounce } from 'lodash';
import Greeting from './components/Greeting/Greeting'
import WeatherData from './components/WeatherData/WeatherData'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'
import WeatherToday from './components/WeatherToday/WatherToday'
import DeepSeekChat from './components/DeepSeekChat/DeepSeekChat'
import chatbot from './assets/chatbot.png'


function App() {
  const [weatherData, setWeatherData] = useState()
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false);


  useEffect(() => {
    getLocation()
      .then((data) => {
        const loc = data.city || "Colombo";
        return getWeather(loc);
      })
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
        toast.info("Weather data updated successfully!");
        // console.log("Weather data:", data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching weather data:", error);
        toast.error("Failed to fetch weather data. Please try again later.");
      });
  }, []);



  const fetchSuggestions = useCallback(
    debounce((input) => {
      if (!input.trim()) {
        setSuggestions([]);
        return;
      }

      if (!window.google) return;

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input, types: ['(cities)'] },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(
              predictions.map((pred) => ({
                description: pred.description,
                placeId: pred.place_id,
              }))
            );
          } else {
            setSuggestions([]);
          }
        }
      );
    }, 300),
    []
  );


  const handleChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    fetchSuggestions(value);
  };

  const handleSelect = (description) => {
    setSearchInput(description)
    setSuggestions([])
  }

  const handleSearch = async (query, event) => {
    if (event) event.preventDefault();

    const term = query || searchInput || (suggestions[0]?.description ?? '');
    if (!term) return;

    getWeather(term)
      .then((data) => {
        setWeatherData(data);
        toast.info("Weather data updated successfully!");
        setSearchInput('');
        setSuggestions([]);
        // console.log('Weather data for', term, ':', data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        toast.error("Failed to fetch weather data. Please try again later.");
      });
  };

  const handleSuggestionSelectAndSearch = (description) => {
    handleSelect(description); // Update input
    getWeather(description)
      .then((data) => {
        setWeatherData(data);
        toast.info("Weather data updated successfully!");
        setSearchInput('');
        setSuggestions([]);
        // console.log('Weather data for', description, ':', data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        toast.error("Failed to fetch weather data. Please try again later.");
      });
  };


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
          handleSuggestionSelectAndSearch={handleSuggestionSelectAndSearch}
        />



      </div>
      <button className="chatbot-icon" onClick={() => setShowDialog(true)}>
        <img src={chatbot} alt="" />
      </button>
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
              <WeatherToday weatherData={weatherData} />

              <DeepSeekChat isOpen={showDialog}
                onClose={() => setShowDialog(false)} />
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
