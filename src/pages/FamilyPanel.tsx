
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Settings, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FamilyPanel = () => {
  const navigate = useNavigate();

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
          <h2 className="text-2xl font-semibold mb-4">Care Assistants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="senior-card p-6 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-accent">
              <Plus className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-medium">Create New Assistant</h3>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Configure a new care assistant for your loved one
              </p>
            </Card>

            {/* Example existing assistant */}
            <Card className="senior-card p-6 flex flex-col min-h-[200px]">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-medium">Mom's Assistant</h3>
                <Settings className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  Daily reminders and care assistance
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Voice: Sarah
                </div>
              </div>
              <Button className="w-full mt-4">
                Manage Assistant
              </Button>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FamilyPanel;
