
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, CalendarDays, Pill, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BotSettings = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-primary flex items-center gap-2 hover:text-primary/80 hover:bg-primary/10"
              onClick={() => navigate('/family')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary animate-fade-in">
          Bot Configuration
        </h1>
        
        <Card className="p-6 shadow-lg border-primary/10 animate-slide-up [animation-delay:200ms] opacity-0">
          <Tabs defaultValue="podstawowe" className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-4 bg-secondary/20 p-1">
              <TabsTrigger 
                value="podstawowe" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Settings2 className="h-4 w-4" />
                Basic
              </TabsTrigger>
              <TabsTrigger 
                value="rodzina" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Users className="h-4 w-4" />
                Family
              </TabsTrigger>
              <TabsTrigger 
                value="leki" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Pill className="h-4 w-4" />
                Medications
              </TabsTrigger>
              <TabsTrigger 
                value="wydarzenia" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <CalendarDays className="h-4 w-4" />
                Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="podstawowe" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="group animate-slide-up [animation-delay:400ms] opacity-0">
                  <label className="text-sm font-medium block mb-2 text-gray-700">Assistant Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all bg-white/50"
                    placeholder="Senior Assistant"
                  />
                </div>

                <div className="group animate-slide-up [animation-delay:600ms] opacity-0">
                  <label className="text-sm font-medium block mb-2 text-gray-700">Welcome Message</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all bg-white/50"
                    placeholder="Hi! How can I help you today?"
                  />
                </div>

                <div className="group animate-slide-up [animation-delay:800ms] opacity-0">
                  <label className="text-sm font-medium block mb-2 text-gray-700">Assistant's Main Prompt</label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all min-h-[200px] bg-white/50"
                    placeholder="Configure how your assistant should behave..."
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 animate-slide-up [animation-delay:1000ms] opacity-0">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/family')}
                    className="hover:bg-primary/10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/family');
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rodzina">
              <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                Family settings coming soon...
              </div>
            </TabsContent>
            
            <TabsContent value="leki">
              <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                Medication settings coming soon...
              </div>
            </TabsContent>
            
            <TabsContent value="wydarzenia">
              <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                Event settings coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
};

export default BotSettings;
