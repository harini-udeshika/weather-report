import React, { useState, useEffect } from 'react';
import appLogo from '../../assets/weather-app.png'
import './Greeting.css'
const Greeting = () => {
    const [location, setLocation] = useState('');
    const [greeting, setGreeting] = useState('');
    const [date, setDate] = useState('');
    const[time,setTime]=useState('');
    

    useEffect(() => {
        // Set greeting based on time
        const now = new Date();
        const hour = now.getHours();
        const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

        if (hour >= 5 && hour < 12) setGreeting('Good morning');
        else if (hour >= 12 && hour < 18) setGreeting('Good afternoon');
        else if (hour >= 18 && hour < 22) setGreeting('Good evening');
        else setGreeting("It's getting late");

        // Format current date (e.g., Friday, June 13, 2025)
        const formattedDate = now.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setDate(formattedDate);
        setTime(time)

        const cachedLocation = sessionStorage.getItem('userLocation');
        if (cachedLocation) {
            setLocation(cachedLocation);
            return;
        }

        fetch('https://ipinfo.io/json')
            .then(res => res.json())
            .then(data => {
                const loc = `${data.city}, ${data.country}`;
                setLocation(loc);
                sessionStorage.setItem('userLocation', loc);
            })
            .catch(() => setLocation('your area'));
    }, []);

    return (
        <div className='greeting'>
            <div className='greeting-child-1'>
                <img src={appLogo} className="logo" alt="logo" />
            </div>
            <div className='greeting-child-2'>
                <span className='greeting-span-1'>Hi, {greeting}!</span>
                <br />
                <span className='greeting-span-2'>{date}<span className="dot-separator"> • </span>{time}</span>
            </div>
        </div>
    );
};

export default Greeting;
