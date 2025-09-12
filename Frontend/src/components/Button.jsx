import React from "react";

export function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-xl text-white hover:opacity-90 transition ${className}`}
    >
      {children}
    </button>
  );
}
