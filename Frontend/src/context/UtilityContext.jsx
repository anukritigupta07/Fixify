import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UtilityDataContext = createContext();

const UtilityContext = ({ children }) => {
  const [utility, setUtility] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
        const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    const fetchUtility = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/utilities/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Map backend data safely into your state
        const data = response.data;
       
        setUtility({
          _id: data._id,
          fullname: {
            firstname: data.fullname?.firstname || "",
            lastname: data.fullname?.lastname || "",
          },
          email: data.email || "",
          contact: data.contact || "",
          profession: data.profession || "",
          experience: data.experience || "",
          status: data.status || "inactive",
        });
        localStorage.setItem("provider", JSON.stringify(data.data));
      } catch (err) {
        console.error("Error fetching utility profile:", err);
        setError(err);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      fetchUtility();
    }
  }, []);

  return (
    <UtilityDataContext.Provider
      value={{ utility, setUtility, isLoading, error }}
    >
      {children}
    </UtilityDataContext.Provider>
  );
};

export default UtilityContext;
