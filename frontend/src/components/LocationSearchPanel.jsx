import React from 'react'
import 'remixicon/fonts/remixicon.css'

// Works whether suggestions are strings or objects like
// { address, city, state, country, lat, lng }
const toText = (s) =>
    typeof s === 'string'
        ? s
        : [ s.address, s.city, s.state, s.country ].filter(Boolean).join(', ')

const LocationSearchPanel = ({
    suggestions = [],
    setVehiclePanel,
    setPanelOpen,
    setPickup,
    setDestination,
    activeField
}) => {
    const handleSuggestionClick = (suggestion) => {
        const text = toText(suggestion)

        if (activeField === 'pickup') {
            setPickup(text)
        } else if (activeField === 'destination') {
            setDestination(text)
        }
        // keep the panel open so the user can fill the other field / press Find Trip
    }

    return (
        <div>
            {suggestions.map((elem, idx) => (
                <div
                    key={idx}
                    onClick={() => handleSuggestionClick(elem)}
                    className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'
                >
                    <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'>
                        <i className="ri-map-pin-fill"></i>
                    </h2>
                    <h4 className='font-medium'>{toText(elem)}</h4>
                </div>
            ))}
        </div>
    )
}

export default LocationSearchPanel