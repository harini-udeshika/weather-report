import "./WeatherCard.css"
import { useEffect, useState } from 'react'

const WeatherCard = ({ data }) => {

    const [rainPercent, setRainPercent] = useState(0);

    useEffect(() => {
        setTimeout(() => setRainPercent(data.chance_of_rain), 100); // delay to trigger animation
    }, [data.chance_of_rain]);

    function formatToHourLabel(datetimeString) {
        const date = new Date(datetimeString);
        let hours = date.getHours();
        const suffix = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;

        return `${hours} ${suffix}`;
    }
    return (
        <div className="card">
            <div className="time">
                {formatToHourLabel(data.time)}
            </div>
            <div className="icon">
                <img src={data.condition.icon} alt="" />
            </div>
            <div className="temp">
                {data.temp_c}&deg;
            </div>
            <div className="rain">
                <div><span>Rain</span>  <span>{data.chance_of_rain}%</span></div>
                <div className="rain-bar">
                    <div className="rain-fill" style={{ width: `${rainPercent}%` }}></div>
                </div>
            </div>

        </div>
    )
}

export default WeatherCard;