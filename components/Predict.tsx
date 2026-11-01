import React from 'react'
interface WeatherData{
    daily?:{
        date_label?: string;
        description?: string;
    }[];
}
const Predict = ({ weather }: { weather: WeatherData }) => {
    console.log(weather);
    if (!weather) return null;
  return (
    <div className="bg-[#060E20 ] p-12 mx-auto w-full flex items-center justify-center">
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
       
    </div>
  )
}

export default Predict