import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StandaloneSearchBox, useLoadScript } from "@react-google-maps/api";
import { UserDataContext } from "../context/UserContext";

const libraries = ["places"];

const ChooseAddress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const liveLocation = location.state?.live || "Unknown";

  const { setAddress, setLocationType } = useContext(UserDataContext);

  const [manualAddress, setManualAddress] = useState("");
  const [searchBox, setSearchBox] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places && places.length > 0) {
      const selectedAddress = places[0].formatted_address;
      setManualAddress(selectedAddress);
    }
  };

  const handleSave = (address, type = "live") => {
    if (!address || address === "Unknown") {
      alert("Please select a valid address");
      return;
    }

    // ✅ Update Context + LocalStorage both
    setAddress(address);
    setLocationType(type);
    localStorage.setItem("selectedAddress", address);
    localStorage.setItem("addressType", type);

    navigate("/portal");
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-2xl max-w-md mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🏠 Select Address
      </h2>

      {/* Live Location */}
      <div className="mb-6 p-4 border border-green-200 rounded-xl bg-green-50">
        <p className="font-semibold text-gray-700 mb-1">Live Location</p>
        <p className="text-sm text-gray-600 mb-3">{liveLocation}</p>
        <button
          onClick={() => handleSave(() => { setAddress(liveLocation); setLocationType("live"); })}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition"
        >
          ✅ Use This Location
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <span className="absolute bg-white px-3 text-gray-500 text-sm">OR</span>
        <div className="w-full h-px bg-gray-300"></div>
      </div>

      {/* Manual Address */}
      <div className="p-4 border border-blue-200 rounded-xl bg-blue-50">
        <p className="font-semibold text-gray-700 mb-2">Enter Manually</p>
        {isLoaded && (
          <StandaloneSearchBox
            onLoad={(ref) => setSearchBox(ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Search address..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mb-3"
            />
          </StandaloneSearchBox>
        )}

        {manualAddress && (
          <button
            onClick={() => handleSave(manualAddress, "manual")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
          >
            📌 Use Manual Address
          </button>
        )}
      </div>
    </div>
  );
};

export default ChooseAddress;
