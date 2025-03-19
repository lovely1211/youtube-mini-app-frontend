import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("authToken");

    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/", { replace: true }); 
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Login to Continue</h2>
        <button 
          onClick={() => window.location.href = "https://youtube-mini-app-backend.onrender.com/api/auth/google"} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};


export default AuthPage;
