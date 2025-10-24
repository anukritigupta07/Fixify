// src/components/LiveCity.jsx
import React, { useState, useEffect, useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const LiveCity = () => {
  const { address, setAddress, locationType } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (locationType === "live") {
      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            // Backend reverse geocode endpoint (proxy)
            const res = await fetch(
              `http://localhost:4000/maps/reverse-geocode?lat=${latitude}&lon=${longitude}`
            );
            if (!res.ok) throw new Error("Failed to fetch location");

            const data = await res.json();
            const addressData = data.address || {};

            const place =
              addressData.suburb ||
              addressData.neighbourhood ||
              addressData.village ||
              addressData.town ||
              addressData.city ||
              "";
            const district =
              addressData.state_district ||
              addressData.county ||
              addressData.state ||
              "";
            const formattedAddress = `${place}, ${district}`;

            setAddress(formattedAddress || "Location not found");
          } catch (err) {
            console.error("LiveCity reverse-geocode error:", err);
            setAddress("Failed to fetch location");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setAddress("Location access denied");
          setLoading(false);
        }
      );
    }
  }, [locationType]);

  if (loading) return <span>Detecting location...</span>;
  return <span>{address || "No location"}</span>;
};

export default LiveCity;

