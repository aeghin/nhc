"use client"

export const Greeting = ({ name }: { name: string }) => {
    
    const hour = new Date().getHours();
    const greeting = hour < 4 ? "It's late-night" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <h1 className="text-2xl font-bold tracking-tight">
        {`${greeting}, ${name}`}
    </h1>
  )
};