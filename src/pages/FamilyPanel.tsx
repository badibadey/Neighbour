
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Settings, Volume2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

const FamilyPanel = () => {
  const navigate = useNavigate();

  const createSeniorPanel = () => {
    navigate('/senior');
    toast.success('Senior panel created successfully');
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="senior-heading text-primary">Family Panel</h1>
          <Button variant="outline" onClick={() => navigate('/')}>Back</Button>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Senior Panels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="senior-card p-6 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-accent"
                  onClick={createSeniorPanel}>
              <Plus className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-medium">Create New Senior Panel</h3>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Create a new senior-friendly interface
              </p>
            </Card>

            <Card className="senior-card p-6 flex flex-col min-h-[200px]">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-medium">Mom's Panel</h3>
                <Settings 
                  className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-accent"
                  onClick={() => navigate('/bot-settings')}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  Simple voice interface for daily use
                </p>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Voice Assistant Active
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => navigate('/senior')}>
                  Open Panel
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/bot-settings')}
                >
                  Settings
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FamilyPanel;
