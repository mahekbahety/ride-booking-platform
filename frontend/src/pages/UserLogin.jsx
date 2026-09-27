import React, { useState ,useContext} from "react";
import { Link,useNavigate } from "react-router-dom";
import {UserDataContext}from "../context/UserContext";
import axios from 'axios';

const UserLogin =  () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {user, setUser} = useContext(UserDataContext);
  const navigate = useNavigate();

  // const submitHandler = async (e) => {
  //   e.preventDefault();

  //   const userData={
  //     email:email,
  //     password:password
  //   }

  //   const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/login`, userData)
    
  //     if(response.status === 200){
  //       setUser(response.data.user);
  //       localStorage.setItem("token", response.data.token);
  //       navigate("/home");
  //     }
  
  //   setEmail("");
  //   setPassword("");
  // };
  const submitHandler = async (e) => {
  e.preventDefault();

  console.log("LOGIN BUTTON CLICKED");

  const userData = {
    email,
    password
  };

  console.log("SENDING:", userData);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/users/login`,
      userData
    );

    console.log("LOGIN RESPONSE:", response);
    console.log("LOGIN DATA:", response.data);

  if (response.status === 200) {
  setUser(response.data.user);

  localStorage.setItem("userToken", response.data.token);
  localStorage.setItem("userId", response.data.user._id);

  console.log("USER ID SAVED:", response.data.user._id);
  console.log("TOKEN SAVED");
  console.log("NAVIGATING HOME");

  navigate("/home");
}

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    console.log("STATUS:", error.response?.status);
    console.log("SERVER RESPONSE:", error.response?.data);
  }
};

  return (
    <div className="h-screen flex flex-col justify-between p-7">
      <div>
        <h1 className="text-4xl font-bold mb-10">Uber</h1>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <h3 className="text-lg font-medium mb-2">What's your email</h3>

            <input
              required
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-200 rounded px-4 py-3 outline-none"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Enter Password</h3>

            <input
              required
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-200 rounded px-4 py-3 outline-none"
            />
          </div>
<button
  type="submit"
  className="w-full bg-black text-white py-3 rounded font-semibold"
>
  Login
</button>
        </form>

        <p className="text-center mt-5">
          New here?{" "}
          <Link to="/signup" className="text-blue-600 font-medium">
            Create new Account
          </Link>
        </p>
      </div>

      <Link
        to="/captain-signup"
        className="w-full bg-green-500 text-white py-3 rounded font-semibold text-center"
      >
        Sign up as Captain
      </Link>

       
    </div>
  );
};

export default UserLogin;