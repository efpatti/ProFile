"use client";
import React from "react";
import { useState } from "react";

export default function Home() {
 const [time, setTime] = useState(0);
 React.useEffect(() => {
  const interval = setInterval(() => {
   setTime((prevTime) => prevTime + 1);
  }, 1000);
  return () => clearInterval(interval);
 }, []);

 return (
  <div className="flex flex-col items-center min-h-screen justify-center p-8 gap-8">
   <h1 className="text-5xl min-h-screen">Home</h1>
  </div>
 );
}
