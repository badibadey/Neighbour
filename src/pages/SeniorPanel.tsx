
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

    const style = document.createElement('style');
    style.textContent = `
      .convai-chat-button {
        width: 16rem !important;
        height: 16rem !important;
        border-radius: 50% !important;
        background: white !important;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
        border: 8px solid rgba(255, 159, 107, 0.2) !important;
        transition: all 500ms !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        position: relative !important;
        z-index: 10 !important;
      }
      
      .convai-chat-button:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important;
        background: rgba(255, 255, 255, 0.9) !important;
      }
      
      .convai-chat-button svg {
        width: 4rem !important;
        height: 4rem !important;
        color: #FF9F6B !important;
      }
      
      .convai-chat-button span {
        font-size: 1.875rem !important;
        font-weight: 500 !important;
        letter-spacing: 0.025em !important;
        color: #FF9F6B !important;
      }

      .convai-widget {
        position: relative !important;
        z-index: 10 !important;
        display: block !important;
        min-height: 200px !important;
      }

      #widget-container {
        width: 100% !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 400px !important;
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.src = 'https://api.us.elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onerror = (error) => {
      console.error('Error loading ElevenLabs widget script:', error);
    };

    script.onload = () => {
      try {
        if (widgetContainer.current) {
          const widget = document.createElement('elevenlabs-convai');
          widget.setAttribute('agent-id', 'xUPvftKCr58LTe0Ffz5m');
          widget.className = 'convai-widget';
          
          widget.setAttribute('data-variant', 'full');
          widget.setAttribute('data-feedback-mode', 'during');
          widget.setAttribute('data-avatar-type', 'url');
          widget.setAttribute('data-bg-color', '#FFFFFF');
          widget.setAttribute('data-text-color', '#2D3648');
          widget.setAttribute('data-btn-text-color', '#FFFFFF');
          widget.setAttribute('data-btn-color', '#FF9F6B');
          widget.setAttribute('data-border-color', '#FFE4D6');
          widget.setAttribute('data-border-radius', '16');
          widget.setAttribute('data-btn-radius', '50');
          widget.setAttribute('data-focus-color', '#FF9F6B');
          
          widget.setAttribute('data-start-call-text', `Hello ${primaryFamilyMember}! Click to start our conversation`);
          widget.setAttribute('data-speaking-text', 'I\'m listening...');
          widget.setAttribute('data-listening-text', 'I hear you...');
          widget.setAttribute('data-action-text', 'Click to start talking');
          widget.setAttribute('data-end-call-text', 'Goodbye! Take care!');
          widget.setAttribute('data-expand-text', '');
          widget.setAttribute('data-shareable-page-text', '');
          widget.setAttribute('data-terms-text', '');
          widget.setAttribute('data-terms-html', '');
          widget.setAttribute('data-language-selector', 'false');
          widget.setAttribute('data-custom-avatar-path', '');

          widgetContainer.current.appendChild(widget);
        }
      } catch (error) {
        console.error('Error initializing ElevenLabs widget:', error);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(style);
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
      <div className="flex-1 flex items-center justify-center"
           style={{
             background: "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)"
           }}>
        <div className="flex flex-col items-center justify-center gap-4 relative z-10">
          <div id="widget-container" ref={widgetContainer}></div>
        </div>
      </div>
    </main>
  );
};

export default SeniorPanel;
