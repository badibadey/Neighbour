
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
  const [scriptLoaded, setScriptLoaded] = useState(false);

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

      console.log('Panel data fetched:', data);
      setPanelData(data);
    };

    fetchPanelData();
  }, [id, location.state]);

  useEffect(() => {
    if (document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    
    script.onload = () => {
      console.log('ElevenLabs script loaded successfully');
      setScriptLoaded(true);
    };

    script.onerror = (error) => {
      console.error('Error loading ElevenLabs script:', error);
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const familyMemberName = panelData?.family_member || 'there';

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#9A3412] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-[99999]">
        <Button 
          variant="ghost" 
          className="text-white flex items-center gap-2 hover:bg-white/10"
          onClick={() => navigate('/neighbours')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Neighbours
        </Button>
        <h1 
          className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2"
          style={{ fontFamily: 'Crimson Text, serif' }}
        >
          neighbour
        </h1>
        <div className="w-[120px]"></div>
      </div>

      {/* Animated glut with subtle movement */}
      <div 
        className="absolute top-0 right-0 w-[200px] sm:w-[250px] md:w-[300px] lg:w-[400px] h-screen bg-gradient-to-b from-[#FEC6A1]/30 to-[#FEC6A1]/10 backdrop-blur-sm"
        style={{
          animation: 'moveGlut 20s ease-in-out infinite',
        }}
      />

      <div className="container mx-auto h-screen flex items-center justify-center relative z-10">
        <div className="max-w-3xl px-6 md:px-8">
          <div className="space-y-6 md:space-y-8">
            <h1 
              className={cn(
                "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white",
                "opacity-0 animate-fade-in tracking-tight"
              )}
              style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                animationDelay: '0.4s',
                animationFillMode: 'forwards'
              }}
            >
              Welcome {familyMemberName},
            </h1>
            <h2 
              className={cn(
                "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-200",
                "opacity-0 animate-fade-in tracking-tight"
              )}
              style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                animationDelay: '0.6s',
                animationFillMode: 'forwards'
              }}
            >
              I'm your neighbour
            </h2>
          </div>

          <div className="mt-12">
            {scriptLoaded && panelData?.agent_id && (
              <elevenlabs-convai 
                agent-id={panelData.agent_id}
              ></elevenlabs-convai>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorPanel;
