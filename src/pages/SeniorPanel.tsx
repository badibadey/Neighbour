
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
    <div className="relative h-screen bg-gradient-to-br from-[#F97316] to-[#0006] flex flex-col">
      <Button 
        variant="ghost" 
        className="fixed top-4 left-4 z-[99999] text-white flex items-center gap-2 hover:bg-white/10"
        onClick={() => navigate('/neighbours')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Neighbours
      </Button>

      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
              <span className="text-orange-200">I'm your neighbour</span>
            </h1>
          </div>

          <div className="order-1 md:order-2 flex items-center justify-center">
            {scriptLoaded && panelData?.agent_id && (
              <div className="w-[500px] h-[500px]">
                <elevenlabs-convai 
                  agent-id={panelData.agent_id}
                  style={{
                    width: '100%',
                    height: '100%',
                    '--convai-widget-height': '500px',
                    '--convai-widget-width': '500px'
                  } as React.CSSProperties}
                ></elevenlabs-convai>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorPanel;
