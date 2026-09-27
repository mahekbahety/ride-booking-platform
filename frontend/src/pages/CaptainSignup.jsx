import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {CaptainDataContext} from "../context/CaptainContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");


const { captain, setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: {
        firstname: firstName,   
      lastname: lastName,
      },
      email: email,
      password: password, 
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/register`, captainData);
    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("captainToken", data.token);
      navigate("/captain-home");
    }
   
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="min-h-screen flex flex-col p-7">
      <div>
        <h1 className="text-4xl font-bold mb-10">Uber</h1>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Name */}
          <div>
            <h3 className="text-lg font-medium mb-2">
              What's your name
            </h3>

            <div className="flex gap-3">
              <input
                required
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 bg-gray-200 rounded px-4 py-3 outline-none"
              />

              <input
                required
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 bg-gray-200 rounded px-4 py-3 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <h3 className="text-lg font-medium mb-2">
              What's your email
            </h3>

            <input
              required
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-200 rounded px-4 py-3 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <h3 className="text-lg font-medium mb-2">
              Enter Password
            </h3>

            <input
              required
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-200 rounded px-4 py-3 outline-none"
            />
          </div>

          {/* Vehicle Info Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              Vehicle Info
            </h3>

            {/* First Row - Color and Plate */}
            <div className="flex gap-3 mb-3">
              <div className="w-1/2">
                <input
                  required
                  type="text"
                  placeholder="Vehicle color"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  className="w-full bg-gray-200 rounded px-4 py-3 outline-none"
                />
              </div>

              <div className="w-1/2">
                <input
                  required
                  type="text"
                  placeholder="Vehicle plate"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full bg-gray-200 rounded px-4 py-3 outline-none"
                />
              </div>
            </div>

            {/* Second Row - Capacity and Type */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <input
                  required
                  type="number"
                  placeholder="Vehicle capacity"
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                  className="w-full bg-gray-200 rounded px-4 py-3 outline-none"
                />
              </div>

              <div className="w-1/2">
                <select
                  required
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-gray-200 rounded px-4 py-3 outline-none"
                >
                  <option value="">Vehicle Type</option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="moto">Moto</option>
                </select>
              </div>
            </div>
          </div>


          {/* Signup */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded font-semibold"
          >
            Create Captain Account
          </button>
        </form>

        {/* Login */}
        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link
            to="/captain-login"
            className="text-blue-600 font-medium"
          >
            Login here
          </Link>
        </p>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 mt-8">
        This site is protected by reCAPTCHA and the Google Privacy
        Policy and Terms of Service apply.
      </p>
    </div>
  );
};

export default CaptainSignup;