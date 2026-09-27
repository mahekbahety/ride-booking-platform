import React, { useEffect, useRef, useState, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'

import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'

import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

import LiveTracking from '../components/LiveTracking'


const Home = () => {

    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')

    const [panelOpen, setPanelOpen] = useState(false)

    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)

    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)

    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])

    const [activeField, setActiveField] = useState(null)

    const [fare, setFare] = useState({})

    const [vehicleType, setVehicleType] = useState(null)

    const [ride, setRide] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)


    // =========================
    // SOCKET CONNECTION
    // =========================

    useEffect(() => {

        if (!user?._id) {
            console.log('User not loaded yet')
            return
        }

        socket.emit('join', {
            userId: user._id,
            userType: 'user'
        })

        console.log('User joined socket:', user._id)


        // Captain accepted the ride
        const handleRideConfirmed = (data) => {

            console.log('Ride confirmed:', data)

            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(data)

        }


        // Captain started the ride
        const handleRideStarted = (data) => {

            console.log('Ride started:', data)

            setWaitingForDriver(false)

            navigate('/riding', {
                state: {
                    ride: data
                }
            })

        }


        socket.on('ride-confirmed', handleRideConfirmed)
        socket.on('ride-started', handleRideStarted)


        return () => {

            socket.off('ride-confirmed', handleRideConfirmed)
            socket.off('ride-started', handleRideStarted)

        }

    }, [user, socket, navigate])


    // =========================
    // PICKUP SUGGESTIONS
    // =========================

    const handlePickupChange = async (e) => {

        const value = e.target.value

        setPickup(value)

        if (value.trim().length < 3) {
            setPickupSuggestions([])
            return
        }

        try {

            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`,
                {
                    params: {
                        input: value
                    },
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            )

            setPickupSuggestions(response.data)

        } catch (error) {

            console.error(
                'Pickup suggestions error:',
                error.response?.data || error.message
            )

        }

    }


    // =========================
    // DESTINATION SUGGESTIONS
    // =========================

    const handleDestinationChange = async (e) => {

        const value = e.target.value

        setDestination(value)

        if (value.trim().length < 3) {
            setDestinationSuggestions([])
            return
        }

        try {

            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`,
                {
                    params: {
                        input: value
                    },
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            )

            setDestinationSuggestions(response.data)

        } catch (error) {

            console.error(
                'Destination suggestions error:',
                error.response?.data || error.message
            )

        }

    }


    // =========================
    // SUBMIT
    // =========================

    const submitHandler = (e) => {
        e.preventDefault()
    }


    // =========================
    // SEARCH PANEL
    // =========================

    useGSAP(() => {

        if (panelOpen) {

            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
            })

            gsap.to(panelCloseRef.current, {
                opacity: 1
            })

        } else {

            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
            })

            gsap.to(panelCloseRef.current, {
                opacity: 0
            })

        }

    }, [panelOpen])


    // =========================
    // VEHICLE PANEL
    // =========================

    useGSAP(() => {

        if (vehiclePanel) {

            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })

        } else {

            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })

        }

    }, [vehiclePanel])


    // =========================
    // CONFIRM RIDE PANEL
    // =========================

    useGSAP(() => {

        if (confirmRidePanel) {

            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })

        } else {

            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })

        }

    }, [confirmRidePanel])


    // =========================
    // VEHICLE FOUND PANEL
    // =========================

    useGSAP(() => {

        if (vehicleFound) {

            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })

        } else {

            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })

        }

    }, [vehicleFound])


    // =========================
    // WAITING FOR DRIVER
    // =========================

    useGSAP(() => {

        if (waitingForDriver) {

            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })

        } else {

            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })

        }

    }, [waitingForDriver])


    // =========================
    // FIND TRIP
    // =========================

    async function findTrip() {

        if (!pickup || !destination) {
            return
        }

        try {

            setVehiclePanel(true)
            setPanelOpen(false)

            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/rides/get-fare`,
                {
                    params: {
                        pickup,
                        destination
                    },
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            )

            console.log('Fare:', response.data)

            setFare(response.data)

        } catch (error) {

            console.error(
                'Fare error:',
                error.response?.data || error.message
            )

        }

    }


    // =========================
    // CREATE RIDE
    // =========================

    async function createRide() {

        try {

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/rides/create`,
                {
                    pickup,
                    destination,
                    vehicleType
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            )

            console.log('Ride created:', response.data)

            setRide(response.data)

            setConfirmRidePanel(false)

            setVehicleFound(true)

        } catch (error) {

            console.error(
                'Create ride error:',
                error.response?.data || error.message
            )

        }

    }


    // =========================
    // UI
    // =========================

    return (

        <div className='h-screen relative overflow-hidden'>


            {/* Uber Logo */}

            <img
                className='w-16 absolute left-5 top-5 z-30'
                src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                alt="Uber"
            />


            {/* MAP */}

            <div className='h-screen w-screen relative z-0'>

                <LiveTracking />

            </div>


            {/* BOTTOM SECTION */}

            <div className='flex flex-col justify-end h-screen absolute top-0 w-full z-20'>


                {/* SEARCH BOX */}

                <div className='h-[30%] p-6 bg-white relative'>

                    <h5
                        ref={panelCloseRef}
                        onClick={() => {
                            setPanelOpen(false)
                        }}
                        className='absolute opacity-0 right-6 top-6 text-2xl'
                    >
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>


                    <h4 className='text-2xl font-semibold'>
                        Find a trip
                    </h4>


                    <form
                        className='relative py-3'
                        onSubmit={submitHandler}
                    >

                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full">
                        </div>


                        {/* PICKUP */}

                        <input
                            onClick={() => {

                                setPanelOpen(true)
                                setActiveField('pickup')

                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />


                        {/* DESTINATION */}

                        <input
                            onClick={() => {

                                setPanelOpen(true)
                                setActiveField('destination')

                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
                            type="text"
                            placeholder='Enter your destination'
                        />

                    </form>


                    {/* FIND TRIP */}

                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'
                    >
                        Find Trip
                    </button>

                </div>


                {/* LOCATION SEARCH PANEL */}

                <div
                    ref={panelRef}
                    className='bg-white h-0'
                >

                    <LocationSearchPanel
                        suggestions={
                            activeField === 'pickup'
                                ? pickupSuggestions
                                : destinationSuggestions
                        }

                        setPanelOpen={setPanelOpen}

                        setVehiclePanel={setVehiclePanel}

                        setPickup={setPickup}

                        setDestination={setDestination}

                        activeField={activeField}
                    />

                </div>

            </div>


            {/* VEHICLE PANEL */}

       <div
    ref={vehiclePanelRef}
    className={`fixed w-full z-30 bottom-0 bg-white px-3 py-10 pt-12 ${
        vehiclePanel ? '' : 'hidden'
    }`}
>

                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehiclePanel={setVehiclePanel}
                />

            </div>


            {/* CONFIRM RIDE PANEL */}

            <div
                ref={confirmRidePanelRef}
                className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'
            >

                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehicleFound={setVehicleFound}
                />

            </div>


            {/* LOOKING FOR DRIVER */}

          <div
    ref={vehicleFoundRef}
    className={`fixed w-full z-30 bottom-0 bg-white px-3 py-6 pt-12 ${
        vehicleFound ? '' : 'hidden'
    }`}
>

                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound}
                />

            </div>


            {/* WAITING FOR DRIVER */}

           <div
    ref={waitingForDriverRef}
    className={`fixed w-full z-30 bottom-0 bg-white px-3 py-6 pt-12 ${
        waitingForDriver ? '' : 'hidden'
    }`}
>

                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver}
                />

            </div>

        </div>

    )
}

export default Home