
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SeniorPanel = () => {
  const navigate = useNavigate();
  const widgetContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add custom styles for the Convai widget
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

    // Dynamically load the script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.onload = () => {
      // Create and mount the widget after script loads
      if (widgetContainer.current) {
        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', 'xUPvftKCr58LTe0Ffz5m');
        widget.className = 'convai-widget';
        
        // Customize widget appearance and behavior
        const widgetConfig = {
          variant: "full",
          bg_color: "#FFFFFF",
          text_color: "#2D3648", // using our app's text color
          btn_color: "#FF9F6B", // using our primary color
          btn_text_color: "#FFFFFF",
          border_color: "#FFE4D6", // using our secondary color
          border_radius: "16",
          btn_radius: "50",
          focus_color: "#FF9F6B",
          start_call_text: "Porozmawiaj ze mną",
          speaking_text: "Słucham...",
          listening_text: "Słucham Cię...",
          action_text: "Kliknij aby rozpocząć rozmowę",
          end_call_text: "Do zobaczenia!",
          avatar: {
            type: "url"
          }
        };

        // Apply configuration
        Object.entries(widgetConfig).forEach(([key, value]) => {
          widget.setAttribute(`data-${key}`, String(value));
        });

        widgetContainer.current.appendChild(widget);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(style);
      const existingScript = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      if (widgetContainer.current) {
        widgetContainer.current.innerHTML = '';
      }
    };
  }, []);

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
