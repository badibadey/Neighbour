
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from '@/lib/supabase';

const SeniorPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const widgetContainer = useRef<HTMLDivElement>(null);
  const panelData = location.state?.panelData;
  const primaryFamilyMember = panelData?.family_member || 'there';

  const updateAgentConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiKey = session?.user?.user_metadata?.elevenlabs_api_key;

      if (!apiKey) {
        console.error('No ElevenLabs API key found');
        return;
      }

      const response = await fetch('https://api.elevenlabs.io/v1/convai/agents/create?use_tool_ids=false', {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversation_config: {
            agent: {
              prompt: {
                llm: "gpt-4",
                prompt: panelData?.assistant_prompt || "You are a helpful assistant."
              }
            }
          },
          platform_settings: {
            widget: {
              variant: "full",
              feedback_mode: "during",
              avatar: {
                type: "url"
              },
              bg_color: "#FFFFFF",
              text_color: "#2D3648",
              btn_text_color: "#FFFFFF",
              btn_color: "#FF9F6B",
              border_color: "#FFE4D6",
              border_radius: 16,
              btn_radius: 50,
              focus_color: "#FF9F6B",
              start_call_text: `Hello ${primaryFamilyMember}! Click to start our conversation`,
              speaking_text: "I'm listening...",
              listening_text: "I hear you...",
              action_text: "Click to start talking",
              end_call_text: "Goodbye! Take care!",
              expand_text: "",
              shareable_page_text: "",
              terms_text: "",
              terms_html: "",
              language_selector: false,
              custom_avatar_path: ""
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update agent config: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Agent configuration updated:', data);

    } catch (error) {
      console.error('Error updating agent configuration:', error);
    }
  };

  useEffect(() => {
    updateAgentConfig();

    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onerror = (error) => {
      console.error('Error loading ElevenLabs widget script:', error);
    };

    script.onload = () => {
      try {
        if (widgetContainer.current) {
          widgetContainer.current.innerHTML = '<elevenlabs-convai agent-id="xUPvftKCr58LTe0Ffz5m"></elevenlabs-convai>';
        }
      } catch (error) {
        console.error('Error initializing ElevenLabs widget:', error);
      }
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="convai-widget/index.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      if (widgetContainer.current) {
        widgetContainer.current.innerHTML = '';
      }
    };
  }, [primaryFamilyMember, panelData]);

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
      <div className="flex-1 flex items-center justify-center">
        <div ref={widgetContainer}></div>
      </div>
    </main>
  );
};

export default SeniorPanel;
