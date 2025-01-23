"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function Navbar() {
  const [hasFavorites, setHasFavorites] = useState(false);

  useEffect(() => {
    // Check if there are any favorites in local storage
    const favorites = localStorage.getItem("favorites");
    setHasFavorites(!!favorites && JSON.parse(favorites).length > 0);
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center">
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={200}
          height={200}
          priority
          className="w-[200px] md:w-[250px] h-auto"
        />
        <span className="ml-2 text-xl font-bold"></span>
      </div>
      <button
        className={`p-2 rounded-full ${hasFavorites ? "bg-red-500 text-white" : "bg-gray-200 text-gray-400"}`}
        disabled={!hasFavorites}
      >
        <Heart size={24} />
      </button>
    </nav>
  );
}
