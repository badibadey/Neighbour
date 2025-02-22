
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Volume2, Mic, MessageSquare, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BotSettings = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-primary flex items-center gap-2"
              onClick={() => navigate('/family')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold">Bot Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6 max-w-3xl">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">General Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Voice Volume</h3>
                  <p className="text-sm text-muted-foreground">Adjust the bot's speaking volume</p>
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="70"
                className="w-32"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Voice Recognition</h3>
                  <p className="text-sm text-muted-foreground">Adjust microphone sensitivity</p>
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="80"
                className="w-32"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Voice Type</h3>
                  <p className="text-sm text-muted-foreground">Select the bot's voice</p>
                </div>
              </div>
              <select className="px-3 py-2 rounded-md border bg-background">
                <option>Female (Default)</option>
                <option>Male</option>
                <option>Child</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate('/family')}>
            Cancel
          </Button>
          <Button onClick={() => {
            // Save settings logic here
            navigate('/family');
          }}>
            Save Changes
          </Button>
        </div>
      </div>
    </main>
  );
};

export default BotSettings;
