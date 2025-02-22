
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

const SeniorPanel = () => {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center"
          style={{
            background: "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)"
          }}>
      <Button
        className="relative w-64 h-64 rounded-full shadow-lg flex flex-col items-center justify-center gap-4
                   bg-white hover:bg-white/90 text-primary border-8 border-accent/20
                   transition-all duration-500 hover:scale-105 hover:shadow-xl
                   animate-pulse hover:animate-none"
        onClick={() => {
          // Talk button functionality will be implemented here
        }}
      >
        <Mic className="w-16 h-16 text-accent" strokeWidth={1.5} />
        <span className="text-3xl font-medium tracking-wide">Talk</span>
      </Button>
    </main>
  );
};

export default SeniorPanel;
