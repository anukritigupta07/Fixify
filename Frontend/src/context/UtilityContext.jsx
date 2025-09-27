import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UtilityDataContext = createContext();

const UtilityContext = ({ children }) => {
  const [utility, setUtility] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const utilityData = localStorage.getItem("utilityData");
    
    if (token && utilityData) {
      try {
        setUtility(JSON.parse(utilityData));
      } catch (e) {
        console.error("Error parsing utility data:", e);
        setUtility(null);
      }
    } else {
      setUtility(null);
    }
    
    setIsLoading(false);
  }, []);

  const logout = () => {
    setUtility(null);
    localStorage.removeItem('token');
    localStorage.removeItem('utilityData');
  };

  return (
    <UtilityDataContext.Provider
      value={{ utility, setUtility, isLoading, error, logout }}
    >
      {children}
    </UtilityDataContext.Provider>
  );
};

export default UtilityContext;
