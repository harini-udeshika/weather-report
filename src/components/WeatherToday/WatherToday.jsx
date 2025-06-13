import { FaRegSun } from "react-icons/fa6";
import "./WeatherToday.css"
import WeatherCard from "./WeatherCard";

const WeatherToday = ({ weatherData }) => {

    return (
        <div className="weather-today">
            <div className="heading"><FaRegSun /> Today's Weather</div>
            
            <div className="card-container">
                {weatherData.forecast.forecastday[0].hour.map((data, index) => (
                    <WeatherCard key={index} data={data} />
                ))}

            </div>
        </div>
    )


}

export default WeatherToday;