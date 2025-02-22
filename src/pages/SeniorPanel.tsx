
import React from 'react';
import SeniorDashboard from "@/components/SeniorDashboard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SeniorPanel = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="senior-heading text-primary">Senior Panel</h1>
          <Button variant="outline" onClick={() => navigate('/')}>Back</Button>
        </div>
      </header>
      <SeniorDashboard />
    </main>
  );
};

export default SeniorPanel;
