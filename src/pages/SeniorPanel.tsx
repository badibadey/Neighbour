
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface PanelData {
  id: string;
  name: string;
  welcome_message: string;
  assistant_prompt: string;
  voice_type: string;
  family_member: string;
  agent_id: string;
}

const SeniorPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [panelData, setPanelData] = useState<PanelData | null>(null);

  useEffect(() => {
    const fetchPanelData = async () => {
      const panelId = id || location.state?.panelId;
      
      if (!panelId) {
        console.error('No panel ID provided in params or state');
        return;
      }

      console.log('Fetching panel data for ID:', panelId);
      
      const { data, error } = await supabase
        .from('panels')
        .select('*')
        .eq('id', panelId)
        .single();

      if (error) {
        console.error('Error fetching panel data:', error);
        return;
      }

      console.log('Successfully fetched panel data:', data);
      setPanelData(data);
    };

    fetchPanelData();
  }, [id, location.state]);

  useEffect(() => {
    if (panelData?.agent_id) {
      console.log('Initializing ElevenLabs widget with agent_id:', panelData.agent_id);
    }
  }, [panelData?.agent_id]);

  const familyMemberName = panelData?.family_member || 'there';

  const renderAssistant = () => {
    if (!panelData?.agent_id) {
      console.log('No agent_id available, showing loading state');
      return (
        <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-lg">
          <p className="text-gray-500">Loading assistant...</p>
        </div>
      );
    }

    console.log('Rendering ElevenLabs widget with agent_id:', panelData.agent_id);
    return (
      <elevenlabs-convai 
        agent-id={panelData.agent_id}
        style={{ width: '100%', height: '600px', border: 'none' }}
      ></elevenlabs-convai>
    );
  };

  return (
    <div className="relative min-h-screen">
      <Button 
        variant="ghost" 
        className="fixed top-4 left-4 z-[99999] text-white flex items-center gap-2 hover:bg-white/10 pointer-events-auto"
        onClick={() => {
          console.log('Back button clicked');
          navigate('/neighbours');
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Neighbours
      </Button>

      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#F97316] to-[#0006] animate-gradient"
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradient 15s ease infinite',
          }}
        />
        
        <div className="relative z-20">
          <div className="container mx-auto px-4 h-[calc(100vh-2rem)] flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
              <div className="text-center md:text-left order-2 md:order-1">
                <h1 
                  className={cn(
                    "text-4xl md:text-6xl font-bold text-white",
                    "opacity-0 animate-fade-in"
                  )}
                  style={{ 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    animationDelay: '0.4s',
                    animationFillMode: 'forwards'
                  }}
                >
                  Welcome {familyMemberName},
                  <br />
                  <span className="text-orange-200">I'm your neighbor</span>
                </h1>
              </div>

              <div className="animate-fade-in order-1 md:order-2 relative z-20" style={{ animationDelay: '0.2s' }}>
                {renderAssistant()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorPanel;
