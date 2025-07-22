import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">
          Salaseh - Comedy Show Platform
        </h1>
        <p className="text-xl mb-8">
          Welcome to the official platform for Al-Salaseh comedy troupe
        </p>

        <div className="space-y-4">
          <div>
            <Link
              href="/events/create-sample"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
            >
              Create Sample Event & Test Seating Map
            </Link>
          </div>

          <div>
            <Link
              href="/sign-in"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
