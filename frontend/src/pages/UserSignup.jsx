import React, { useState ,useContext} from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";


const UserSignup = () => {
    
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const { user: userData, setUser: setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  // const submitHandler = async (e) => {
  //   e.preventDefault();

  //   const user = {
  //     fullname: {
  //       firstname: firstName,
  //       lastname: lastName,
  //     },
  //     email: email,
  //     password: password,
  //   };

  //  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/register`, user)
   
  //   if (response.status === 201) {
  //     const data = response.data
  //     setUserData(data.user)
  //     localStorage.setItem("token", data.token);
  //     navigate('/home')
  //   }

  //   setFirstName("");
  //   setLastName("");
  //   setEmail("");
  //   setPassword("");
  // };
const submitHandler = async (e) => {
  e.preventDefault();

  const user = {
    fullname: {
      firstname: firstName,
      lastname: lastName,
    },
    email,
    password,
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/users/register`,
      user
    );

    console.log("SUCCESS:", response.data);

    if (response.status === 201) {
      const data = response.data;

      setUserData(data.user);
      localStorage.setItem("userToken", data.token);
      navigate("/home");
    }

  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("SERVER RESPONSE:", error.response?.data);
  }
};
  return (
    <div className="h-screen flex flex-col justify-between p-7">
      <div>
        <h1 className="text-4xl font-bold mb-10">Uber</h1>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* First and Last Name */}
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

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded font-semibold"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium"
          >
            Login here
          </Link>
        </p>
      </div>

      {/* Captain Signup */}
      <Link
        to="/captain-signup"
        className="w-full bg-green-500 text-white py-3 rounded font-semibold text-center"
      >
        Sign up as Captain
      </Link>
    </div>
  );
};

export default UserSignup;