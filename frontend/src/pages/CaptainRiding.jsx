import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {

    const location = useLocation()
    const ride = location.state?.ride

    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)

    useGSAP(() => {

        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0%)',
                duration: 0.4,
                ease: 'power2.out'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.4,
                ease: 'power2.in'
            })
        }

    }, [finishRidePanel])


    return (
        <div className="h-screen w-full relative bg-[#f3f3f3] overflow-hidden">
            {/* Live Map Background */}
            <div className="absolute inset-0 z-0">
                <LiveTracking />
            </div>



            {/* Header */}
            <div className="absolute top-0 left-0 w-full px-5 py-5 flex items-center justify-between z-20">

                <div className="bg-white rounded-xl px-4 py-2 shadow-md">

                    <img
                        className="w-16"
                        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                        alt="Uber"
                    />

                </div>


                <Link
                    to="/captain-home"
                    className="h-11 w-11 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                    <i className="ri-logout-box-r-line text-xl"></i>
                </Link>

            </div>


            {/* Arrival */}
            <div className="absolute top-[30%] left-[10%] bg-white rounded-xl px-4 py-3 shadow-md z-10">

                <p className="text-xs text-gray-500">
                    Arrival
                </p>

                <h2 className="text-2xl font-semibold">
                    6 min
                </h2>

            </div>


            {/* Bottom Ride Card */}
            <div className="absolute bottom-0 left-0 w-full px-3 pb-3 z-20">

                <div
                    onClick={() => setFinishRidePanel(true)}
                    className="bg-white rounded-2xl shadow-xl px-5 py-4 cursor-pointer"
                >

                    {/* Handle */}
                    <div className="flex justify-center mb-4">

                        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>

                    </div>


                    <div className="flex items-center justify-between">

                        {/* Distance */}
                        <div>

                            <p className="text-sm text-gray-500">
                                Remaining distance
                            </p>

                            <h3 className="text-xl font-semibold">
                                4 KM away
                            </h3>

                        </div>


                        {/* Complete */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setFinishRidePanel(true)
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                        >
                            Complete Ride
                        </button>

                    </div>

                </div>

            </div>


            {/* Finish Ride Panel */}
            <div
                ref={finishRidePanelRef}
                className="fixed w-full z-[500] bottom-0 translate-y-full bg-white rounded-t-3xl px-5 py-6 pt-10 shadow-2xl"
            >

                {/* Close */}
                <button
                    onClick={() => setFinishRidePanel(false)}
                    className="absolute top-3 left-1/2 -translate-x-1/2"
                >
                    <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
                </button>

                <FinishRide
                    ride={ride}
                    setFinishRidePanel={setFinishRidePanel}
                />

            </div>

        </div>
    )
}

export default CaptainRiding