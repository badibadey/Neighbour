
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const SeniorPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const panelData = location.state?.panelData;
  const primaryFamilyName = panelData?.family_member || 'there';

  useEffect(() => {
    const existingScript = document.querySelector('script[src*="convai-widget"]');
    if (existingScript) {
      console.log('ElevenLabs script already exists:', existingScript);
      return;
    }

    console.log('Adding ElevenLabs script...');
    
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#F97316] to-[#0006] animate-gradient"
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient 15s ease infinite',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <Button 
          variant="ghost" 
          className="text-white flex items-center gap-2 m-4 hover:bg-white/10 absolute top-0 left-0"
          onClick={() => navigate('/family')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Family Panel
        </Button>

        <div className="container mx-auto px-4 h-[calc(100vh-2rem)] flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
            {/* Left column - Welcome text */}
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
                Welcome my neighbor,
                <br />
                <span className="text-orange-200">{primaryFamilyName}</span>
              </h1>
            </div>

            {/* Right column - Widget */}
            <div className="animate-fade-in order-1 md:order-2" style={{ animationDelay: '0.2s' }}>
              <elevenlabs-convai 
                agent-id="xUPvftKCr58LTe0Ffz5m"
                style={{ width: '100%', height: '600px' }}
              ></elevenlabs-convai>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorPanel;
