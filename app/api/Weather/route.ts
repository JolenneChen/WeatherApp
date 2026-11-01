type geocodingResult = {
    name: string;
    country: string;
    admin1: string;
    latitude: number;
    longitude: number;
    timezone: string;
};

type GeocodingResponse = {
    results: geocodingResult[];
};

type ForcastResponse = {
    current: {
        time: string;
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        is_day: number;
        precipitation: number;
        weather_code: number;
        wind_speed_10m: number;
    }
    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min : number[];
        precipitation_probability_max: number[];
    }
}

const weatherDescriptions : Record<number, string> = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  56: "Light Freezing Drizzle",
  57: "Dense Freezing Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Light Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Slight Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Slight Rain Showers",
  81: "Moderate Rain Showers",
  82: "Violent Rain Showers",
  85: "Slight Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Light Hail",
  99: "Thunderstorm with Heavy Hail"
};

function getWeatherDescription(code: number): string {
  return weatherDescriptions[code] || "Unknown Weather Condition";
}

function getDatelabel(date: string){
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00`));
}
export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const city = searchParams.get('city')?.trim();
    if (!city) {
        return Response.json({ error: 'City parameter is required ex: /api/weather?city=Jakarta' }, { status: 400 });
    }
    try {
        const geocodingUrl = new URL(`https://geocoding-api.open-meteo.com/v1/search`);
        geocodingUrl.searchParams.set('name', city);
        geocodingUrl.searchParams.set('count', '1');
        geocodingUrl.searchParams.set('language', 'en');
        geocodingUrl.searchParams.set('format', 'json');
        const geocodingResponse = await fetch(geocodingUrl);
        const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;
        const location = geocodingData.results[0];
        if(!location) {
            return Response.json({ error: 'Location not found' }, { status: 404 });
        }
        const forcastUrl = new URL(`https://api.open-meteo.com/v1/forecast`);
        forcastUrl.searchParams.set('latitude', String(location.latitude));
        forcastUrl.searchParams.set('longitude', String(location.longitude));
        forcastUrl.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m');
        forcastUrl.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max');
        forcastUrl.searchParams.set('timezone', location.timezone);
        forcastUrl.searchParams.set('forecast_days', '5');
        const forcastResponse = await fetch(forcastUrl);
        console.log('Fetching weather data from:', forcastUrl.toString());
        if (!forcastResponse.ok) {
            const errorText = await forcastResponse.text();
            console.error('Error fetching weather data:', errorText);
            return Response.json({ error: 'Failed to fetch weather data' }, { status: 500 });
        }
        const forcastData = (await forcastResponse.json()) as ForcastResponse;
        console.log('Weather data fetched successfully:', forcastData);
        return Response.json({
            location: {
                name: location.name,
                country: location.country,
                admin1: location.admin1,
                latitude: location.latitude,
                longitude: location.longitude,
                timezone: location.timezone
            },
            current: {
                time: forcastData.current.time,
                temperature_2m: forcastData.current.temperature_2m,
                relative_humidity_2m: forcastData.current.relative_humidity_2m,
                apparent_temperature: forcastData.current.apparent_temperature,
                is_day: forcastData.current.is_day,
                precipitation: forcastData.current.precipitation,
                weather_code: forcastData.current.weather_code,
                wind_speed_10m: forcastData.current.wind_speed_10m,
                description: getWeatherDescription(forcastData.current.weather_code)
            },
            daily: forcastData.daily.time.map((date, index) => ({
                date: date,
                date_label: getDatelabel(date),
                weather_code: forcastData.daily.weather_code[index],
                description: getWeatherDescription(forcastData.daily.weather_code[index]),
                temperature_2m_max: forcastData.daily.temperature_2m_max[index],
                temperature_2m_min: forcastData.daily.temperature_2m_min[index],
                precipitation_probability_max: forcastData.daily.precipitation_probability_max[index]
            }))
        });
    }
    catch (error) {
        console.error('Error fetching weather data:',error);
        return Response.json({ error: 'Failed to fetch weather data'}, { status: 500 });
    }
}

