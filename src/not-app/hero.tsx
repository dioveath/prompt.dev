import React from "react";
import Button from "@/ui/button";

export default function Hero() {
  return (
    <div className="w-full flex flex-col justify-center items-center py-20">
      <div className="w-full max-w-4xl flex flex-col justify-center items-center">
        <div className="text-4xl font-bold text-center">
          Train yourself to be AI Expert
        </div>
        <div className="text-xl text-center mt-4">
          Teach yourself to prompt an ai. The next big skill of new generation.
        </div>
      </div>

      <Button> Explore Now </Button>
    </div>
  );
}
