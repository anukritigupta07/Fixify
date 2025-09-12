import React, { useState } from "react";
import axios from "axios";

const BookService = ({ userId }) => {
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");

  const handleBook = async () => {
    if (!userId) {
      alert("❌ Please login first.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/book-service`,
        {
          userId,
          category,
          details,
        }
      );
      alert("✅ Booking created!");
      console.log(res.data);
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ Booking failed.");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-3">Book a Service</h2>
      <input
        type="text"
        placeholder="Category (e.g., plumber)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <textarea
        placeholder="Booking details..."
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        onClick={handleBook}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg"
      >
        Book
      </button>
    </div>
  );
};

export default BookService;
