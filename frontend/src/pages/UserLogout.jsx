import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    axios
      .get(`${import.meta.env.VITE_API_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("userToken");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log("Logout error:", error);

        // Even if backend logout fails,
        // remove the local token and send user to login.
        localStorage.removeItem("userToken");
        navigate("/login");
      });
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default UserLogout;