"use client"
import React, { useState } from 'react'
import { Badge } from './ui/badge'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr'
type WeatherData = {
    location: {
        name: string;
        country: string;
        admin1: string;
        latitude: number;
        longitude: number;
        timezone: string;
    },
    current: {
        time: string;
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        is_day: number;
        precipitation: number;
        weather_code: number;
        wind_speed_10m: number;
        description: string;
    },
    daily: Array<{
        date: string;
        date_label: string;
        weather_code: number;
        description: string;
        temperature_2m_max: number;
        temperature_2m_min: number;
        precipitation_probability_max: number;
    }>
    source: string;
}

export default function Home() {
    const [CityInput, setCityInput] = useState('');
    const [weather, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [Loading, setLoading] = useState(false);
    const FetchWeather = async (CityName: string) => {
        if (!CityName.trim()) {
            setError('Please enter a city name');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/Weather?city=${encodeURIComponent(CityName)}`);
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Failed to fetch weather data');
                setWeatherData(null);
            }
            setWeatherData(data);
        }
        catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Failed to fetch weather data');
            setWeatherData(null);
        }
        finally {
            setLoading(false);
        }
    };
    const HandleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        FetchWeather(CityInput);
    };
    const HandleCity = (CityName: string) => {
        setCityInput(CityName);
        FetchWeather(CityName);
    }

    function parseTime(timeString: string) {
        const [datePart, timePart] = timeString.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');
        return {
            date: datePart,
            time: timePart,
            year,
            month,
            day,
            hour,
            minute
        };
    }

    return (
        <div className="bg-[#060E20] ">
            <div className="flex p-8">
                <p className="text-white text-2xl pl-12">Weather App</p>
                <div className=" bg-[#171F33] justify-self-end flex items-center px-2 rounded-2xl ml-auto mr-12">
                    <MagnifyingGlassIcon size={20} className='mx-4' />
                    <form onSubmit={HandleSearch} className="w-full">
                        <input type="text" placeholder="Search" value={CityInput} onChange={(e) => setCityInput(e.target.value)} className="w-full h-12  text-white rounded-lg focus:outline-none" />
                    </form>
                </div>

            </div>
            {weather &&
                (<div className="bg-[#060E20] w-full h-200 flex items-center justify-center">

                    <div className="mx-12 bg-surface-container-low bg-[#131B2E] blur(20px) sat(160%) w-full h-full rounded-2xl text-center items-center justify-center flex flex-col gap-4">
                        <Badge className="bg-[#353535] text-white text-md p-4">{weather?.current.description}</Badge>
                        <h1 className="text-4xl font-mono text-white font-bold">{weather?.location.name}, {weather?.location.country}</h1>
                        <p className="text-[#bdbdbd]">{parseTime(weather?.current.time).year}-{parseTime(weather?.current.time).month}-{parseTime(weather?.current.time).day}, {parseTime(weather?.current.time).time} PM GMT+7</p>
                        <h1 className="text-8xl text-white">{weather?.current.temperature_2m}<span className="text-4xl relative -top-10 font-bold text-[#b5d6e9dd]">°C</span></h1>
                        <p className="text-[#bdbdbd] font-bold">{weather?.current.apparent_temperature}<span className="text-[#b5d6e9dd]">°F</span> · {weather?.current.relative_humidity_2m} · {weather?.current.precipitation}</p>
                        <p className="text-[#bdbdbd] max-w-md">{weather?.daily[0]?.description}</p>
                        <div className="flex gap-4 mt-4 ">
                            <div className="bg-[#0a0b0f] w-25 h-25 p-3 rounded-2xl">
                                <h1 className="text-white font-mono text-left">{weather?.current.wind_speed_10m} mph</h1>
                                <p className="text-[#bdbdbd] text-[14px] font-bold text-left ">Wind Speed</p>
                            </div>
                            <div className="bg-[#0a0b0f] w-25 h-25 p-3 rounded-2xl">
                                <h1 className="text-white font-mono text-left">{weather?.current.relative_humidity_2m}%</h1>
                                <p className="text-[#bdbdbd] text-[14px] font-bold text-left ">Humidity</p>
                            </div>
                            <div className="bg-[#0a0b0f] w-25 h-25 p-3 rounded-2xl">
                                <h1 className="text-white font-mono text-left">{weather?.current.air_quality}</h1>
                                <p className="text-[#bdbdbd] text-[14px] font-bold text-left ">Air Quality</p>
                            </div>
                            <div className="bg-[#0a0b0f] w-25 h-25 p-3 rounded-2xl">
                                <h1 className="text-white font-mono text-left">{weather?.current.pressure_msl} hPa</h1>
                                <p className="text-[#bdbdbd] text-[14px] font-bold text-left ">Pressure</p>
                            </div>
                            <div className="bg-[#0a0b0f] w-25 h-25 p-3 rounded-2xl">
                                <h1 className="text-white font-mono text-left">Solar Cycle</h1>
                                <p className="text-[#bdbdbd] text-[14px] font-bold text-left ">19:58</p>
                            </div>

                        </div>
                    </div>
                </div>

                )}
            <div className="bg-[#060E20 ] p-12 mx-auto w-full flex items-center justify-center">
                 {weather &&
                (
                <div className="bg-surface-container-low bg-[#131B2E] blur(20px) sat(160%) p-4 max-w-6xl h-full rounded-2xl border-2 justify-center gap-4">
                    <h1 className="text-white text-2xl p-5">Next 5 Days</h1>
                    <div className="flex justify-center items-center flex-col-5 gap-8 py-3">
                        <div className="bg-[#0a0b0f] w-60 h-30 p-4 rounded-2xl">
                            <p className="text-white">{weather?.daily?.[0]?.date_label}</p>
                            <p className="text-[#b5d6e9dd]">{weather?.daily?.[0]?.description}</p>
                            <p className="text-white text-2xl">72°F</p>
                        </div>
                        <div className="bg-[#0a0b0f] w-60 h-30 p-4 rounded-2xl">
                            <p className="text-white">{weather?.daily?.[1]?.date_label}</p>
                            <p className="text-[#b5d6e9dd]">{weather?.daily?.[1]?.description}</p>
                            <p className="text-white text-2xl">72°F</p>
                        </div>
                        <div className="bg-[#0a0b0f] w-60 h-30 p-4 rounded-2xl">
                            <p className="text-white">{weather?.daily?.[2]?.date_label}</p>
                            <p className="text-[#b5d6e9dd]">{weather?.daily?.[2]?.description}</p>
                            <p className="text-white text-2xl">72°F</p>
                        </div>
                        <div className="bg-[#0a0b0f] w-60 h-30 p-4 rounded-2xl">
                            <p className="text-white">{weather?.daily?.[3]?.date_label}</p>
                            <p className="text-[#b5d6e9dd]">{weather?.daily?.[3]?.description}</p>
                            <p className="text-white text-2xl">72°F</p>
                        </div>
                        <div className="bg-[#0a0b0f] w-60 h-30 p-4 rounded-2xl">
                            <p className="text-white">{weather?.daily?.[4]?.date_label}</p>
                            <p className="text-[#b5d6e9dd]">{weather?.daily?.[4]?.description}</p>
                            <p className="text-white text-2xl">72°F</p>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}
