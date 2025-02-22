
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SeniorPanel = () => {
  const navigate = useNavigate();

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
      }
    `;
    document.head.appendChild(style);

    // Ensure the script is loaded only once
    if (!document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }

    return () => {
      document.head.removeChild(style);
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
        <div className="flex flex-col items-center justify-center gap-4">
          <elevenlabs-convai 
            agent-id="xUPvftKCr58LTe0Ffz5m"
            className="convai-widget"
          ></elevenlabs-convai>
        </div>
      </div>
    </main>
  );
};

export default SeniorPanel;
