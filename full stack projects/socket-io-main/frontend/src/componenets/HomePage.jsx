import React, { useEffect } from "react";
import LeftBar from "./LeftBar";
import UserMessageBar from "./userMessageBar";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <div className="flex flex-row">
        <LeftBar />
      </div>
    </>
  );
}

export default HomePage;
