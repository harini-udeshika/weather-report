import "./WeatherData.css"

const WeatherData = ({ weatherData }) => {
    return (
        <div className='rounded-box'>
            <div className="section">
               <img src={weatherData.current.condition.icon} alt="Weather Icon" />
               <div>{weatherData.current.condition.text}</div>
            </div>
             <div className="section">
                <div className="title">{weatherData.location.name}</div>
                <div>{weatherData.location.country}</div>
            </div>
             <div className="section">
                <div className="title">{weatherData.current.temp_c}°</div>
                <div>Temperature</div>
            </div>
             <div className="section">
                <div className="title">{weatherData.current.humidity}%</div>
                <div>Humidity</div>
            </div>
             <div className="section">
                <div className="title">{weatherData.current.uv}</div>
                <div>UV index</div>
            </div>
             <div className="section">
                <div className="title">{weatherData.current.wind_kph}</div>
                <div>Wind speed km/h</div>
            </div>
        </div>
    )
};

export default WeatherData;