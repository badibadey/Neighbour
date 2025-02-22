
import React from 'react';
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

const SeniorPanel = () => {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <Button
        className="senior-button text-4xl w-48 h-48 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground 
                   animate-pulse hover:animate-none transition-all duration-300 hover:scale-105"
        onClick={() => {
          // Talk button functionality will be implemented here
        }}
      >
        <Volume2 className="w-12 h-12 mb-2" />
        Talk
      </Button>
    </main>
  );
};

export default SeniorPanel;
