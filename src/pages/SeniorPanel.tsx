
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SeniorPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const panelData = location.state?.panelData;

  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector('script[src*="convai-widget"]');
    if (existingScript) {
      console.log('ElevenLabs script already exists:', existingScript);
      return;
    }

    console.log('Adding ElevenLabs script...');
    
    // Create and add the script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = () => {
      console.log('ElevenLabs script loaded successfully');
    };

    script.onerror = (error) => {
      console.error('Error loading ElevenLabs script:', error);
    };

    document.body.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[src*="convai-widget"]');
      if (scriptToRemove) {
        console.log('Removing ElevenLabs script');
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Button 
        variant="ghost" 
        className="text-primary flex items-center gap-2 m-4"
        onClick={() => navigate('/family')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Family Panel
      </Button>
      <div className="flex justify-center items-center mt-10">
        <elevenlabs-convai 
          agent-id="xUPvftKCr58LTe0Ffz5m"
          style={{ width: '100%', maxWidth: '800px', height: '600px' }}
        ></elevenlabs-convai>
      </div>
    </div>
  );
};

export default SeniorPanel;
