import { FaDroplet, FaEye, FaEyeLowVision, FaGlassWaterDroplet, FaLocationArrow, FaLocationDot, FaLocationPin, FaMapLocationDot, FaRegEye, FaRegSun, FaWind } from "react-icons/fa6";
import "./WeatherData.css"
import { FaSun } from "react-icons/fa";

const WeatherData = ({ weatherData }) => {
    return (
        <div className='rounded-box'>
            <div className="left">
                <div className="location">
                    <FaLocationDot size={25} />
                    <div className="location-text">
                        <div className="title">{weatherData.location.name}</div>
                        <div className="sub-title">{weatherData.location.country}</div>
                    </div>

                </div>
                <div className="condition">
                    <img src={weatherData.current.condition.icon} alt="Weather Icon" />
                    <div className="temp">
                        <div>{weatherData.current.temp_c}&deg;</div>
                        <div>{weatherData.current.condition.text}</div>
                        <div>Feels like {weatherData.current.feelslike_c}&deg;</div>
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="row">
                    <div className="section">
                        <div><FaRegSun color="#9fcadf" /> UV index</div>
                        <div className="title">{weatherData.current.uv}</div>

                    </div>
                    <div className="section">
                        <div> <FaDroplet color="#9fcadf" /> Humidity</div>
                        <div className="title">{weatherData.current.humidity}%</div>

                    </div>
                </div>
                <div className="row">
                    <div className="section">
                        <div><FaRegEye color="#9fcadf" /> Visibility</div>
                        <div className="title">{weatherData.current.vis_km}</div>
                        <div>km</div>

                    </div>

                    <div className="section">
                        <div><FaWind color="#9fcadf" /> Wind</div>
                        <div className="title">{weatherData.current.wind_kph}</div>
                        <div>km/h</div>
                    </div>
                </div>

            </div>

        </div>
    )
};

export default WeatherData;