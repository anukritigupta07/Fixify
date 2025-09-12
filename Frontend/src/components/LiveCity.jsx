import React, { useState, useEffect, useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const LiveCity = () => {
  const { address, setAddress, locationType } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (locationType === "live") {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
            .then((res) => res.json())
            .then((data) => {
              const area = data.address.suburb || data.address.town || data.address.village || "";
              const city = data.address.city || data.address.state_district || "";
              setAddress(`${area}, ${city}`);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        },
        () => setLoading(false)
      );
    }
  }, [locationType]); // ✅ run only when live is selected

  if (loading) return <span>Loading...</span>;

  return <span>{address || "No location"}</span>;
};

export default LiveCity;
