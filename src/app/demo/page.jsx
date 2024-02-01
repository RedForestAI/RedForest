"use server";

import WebGazer from "./_components/webgazer"

export default async function HomePage() {

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <WebGazer/>
    </div>
  );
};