import React, { useState, useEffect, createContext, useContext } from "react";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token) => {
    if (!token) {
        console.log("Token is undefined or null");
        return;
    }
    console.log("Storing token in localStorage:", token);
    localStorage.setItem("authToken", token);
    setUser({ accessToken: token });  
  }; 

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
  
    if (storedToken) {
      setUser({ accessToken: storedToken }); 
    }
  
    setLoading(false);
  }, []);  

  return (
    <AuthContext.Provider value={{ user, setAuthToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
