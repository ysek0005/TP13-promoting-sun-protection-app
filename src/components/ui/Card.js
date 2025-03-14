import React from "react";

export function Card({ children, className }) {
    return (
      <div className={`relative p-4 rounded-xl shadow-lg bg-black overflow-hidden ${className}`}>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 opacity-40"></div>
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }