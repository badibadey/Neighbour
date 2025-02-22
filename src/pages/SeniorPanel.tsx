
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SeniorPanel = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="p-4">
        <Button 
          variant="ghost" 
          className="text-primary flex items-center gap-2"
          onClick={() => navigate('/family')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Family Panel
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center"
           style={{
             background: "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)"
           }}>
        <Button
          className="relative w-64 h-64 rounded-full shadow-lg flex flex-col items-center justify-center gap-4
                     bg-white hover:bg-white/90 text-primary border-8 border-accent/20
                     transition-all duration-500 hover:scale-105 hover:shadow-xl"
          onClick={() => {
            // Talk button functionality will be implemented here
          }}
        >
          <Mic className="w-16 h-16 text-accent" strokeWidth={1.5} />
          <span className="text-3xl font-medium tracking-wide">Talk</span>
        </Button>
      </div>
    </main>
  );
};

export default SeniorPanel;
