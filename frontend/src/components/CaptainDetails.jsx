import React, { useContext } from 'react'
import 'remixicon/fonts/remixicon.css'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext)

    // captain is null until the profile has loaded
    if (!captain) {
        return (
            <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-xl p-6 text-center text-gray-500">
                Loading...
            </div>
        )
    }

    const firstname = captain.fullname?.firstname || ''
    const lastname = captain.fullname?.lastname || ''
    const earnings = Number(captain.earnings ?? 0)

    return (
        <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-xl">

            {/* Handle */}
            <div className="flex justify-center pt-3">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Captain Info */}
            <div className="flex items-center justify-between px-5 pt-5 pb-5">

                <div className="flex items-center gap-3">

                    {/* Profile icon (no external image, so it can't break) */}
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                        <i className="ri-user-3-fill"></i>
                    </div>

                    {/* Name */}
                    <h2 className="text-lg font-semibold capitalize">
                        {captain.fullname.firstname} {captain.fullname.lastname}
                    </h2>

                </div>

                {/* Earnings */}
                <div className="text-right">
                    <h2 className="text-xl font-bold">
                        ₹{earnings.toFixed(2)}
                    </h2>
                    <p className="text-sm text-gray-500">Earned</p>
                </div>

            </div>

            {/* Statistics (static placeholder values for now) */}
            <div className="px-5 pb-6">
                <div className="bg-gray-100 rounded-2xl py-5 grid grid-cols-3">

                    <div className="flex flex-col items-center">
                        <i className="ri-time-line text-2xl mb-2"></i>
                        <h3 className="text-lg font-semibold">10.2</h3>
                        <p className="text-xs text-gray-500">Hours Online</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <i className="ri-speed-up-line text-2xl mb-2"></i>
                        <h3 className="text-lg font-semibold">24</h3>
                        <p className="text-xs text-gray-500">Distance (km)</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <i className="ri-booklet-line text-2xl mb-2"></i>
                        <h3 className="text-lg font-semibold">8</h3>
                        <p className="text-xs text-gray-500">Trips</p>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CaptainDetails