import React, { createContext, useState, useEffect } from "react";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [locationType, setLocationType] = useState("live");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        // Ensure the user object has a consistent ID property, favoring _id
        if (parsedUserData.id && !parsedUserData._id) {
          parsedUserData._id = parsedUserData.id; // Assign 'id' to '_id' for consistency
        }
        setUser(parsedUserData);
      } catch (e) {
        console.error("Error parsing user data:", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  };

  return (
    <UserDataContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        address,
        setAddress,
        locationType,
        setLocationType,
        logout,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
