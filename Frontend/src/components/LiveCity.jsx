
// src/components/LiveCity.jsx
import React, { useState, useEffect, useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const LiveCity = () => {
  const { address, setAddress, locationType } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (locationType !== "live") return;

    let mounted = true;
    setLoading(true);

    const geoOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (!mounted) return;
        const { latitude, longitude } = pos.coords;

        try {
          // If your backend runs on another port during dev, use the full URL (e.g. http://localhost:5000)
          const res = await fetch(`/maps/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`Reverse geocode failed: ${res.status} ${text}`);
          }

          const data = await res.json();
          const addr = data.address || {};

          const place =
            addr.suburb ||
            addr.neighbourhood ||
            addr.village ||
            addr.town ||
            addr.city ||
            "";

          const district = addr.state_district || addr.county || addr.state || "";

          const formattedAddress = [place, district].filter(Boolean).join(", ");

          setAddress(formattedAddress || data.display_name || "Location not found");
        } catch (err) {
          console.error("LiveCity reverse-geocode error:", err);
          setAddress("Failed to fetch location");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        if (!mounted) return;
        if (err.code === 1) setAddress("Location access denied"); // PERMISSION_DENIED
        else if (err.code === 3) setAddress("Location request timed out");
        else setAddress("Unable to determine location");
        setLoading(false);
      },
      geoOptions
    );

    return () => {
      mounted = false;
    };
  }, [locationType, setAddress]);

  if (loading) return <span>Detecting location...</span>;
  return <span>{address || "No location"}</span>;
};

export default LiveCity;
