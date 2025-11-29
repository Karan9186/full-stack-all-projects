import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getLocalStorage } from "../../../../backend/utils/GlobalLocalstorage";
import { LOCAL_STORAGE } from "../../../../backend/utils/constant";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null); // State to track if the token is valid or not

  useEffect(() => {
    const token = getLocalStorage(LOCAL_STORAGE.TOKEN);
    if (!token) {
      setIsValid(false);
      return;
    }

    // Manually decode the JWT (header and payload are Base64 encoded)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      setIsValid(false);
      return;
    }

    // Call the API to validate the token
    fetch("http://localhost:3000/api/v1/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isValid) {
          // If the token is valid
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      })
      .catch(() => {
        // In case of an error (e.g., network failure or invalid token)
        setIsValid(false);
      });
  }, []);

  if (isValid === null) {
    // Optionally, you can show a loading state here while waiting for validation
    return <div>Loading...</div>;
  }

  if (!isValid) {
    // Redirect to the signup/login page if the token is invalid
    return <Navigate to="/signup" />;
  }

  return children;
};

export default ProtectedRoute;
