import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const SeniorPanel = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [panelData, setPanelData] = useState<any>(null);

  useEffect(() => {
    const fetchPanelData = async () => {
      if (!id) {
        console.error('No panel ID provided');
        return;
      }

      console.log('Fetching panel data for ID:', id);
      
      const { data, error } = await supabase
        .from('panels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching panel data:', error);
        return;
      }

      console.log('Successfully fetched panel data:', data);
      setPanelData(data);
    };

    fetchPanelData();
  }, [id]);

  // Log panel data for debugging
  console.log('Current panel data:', panelData);
  
  // Get family member name from panel data
  const familyMemberName = panelData?.family_member || 'there';
  console.log('Family member name:', familyMemberName);

  return (
    <div className="relative min-h-screen">
      {/* Back button - moved outside of other divs and increased z-index */}
      <Button 
        variant="ghost" 
        className="fixed top-4 left-4 z-[99999] text-white flex items-center gap-2 hover:bg-white/10 pointer-events-auto"
        onClick={() => {
          console.log('Back button clicked');
          navigate('/family');
        }}
        style={{
          position: 'fixed',
          zIndex: 99999,
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Family Panel
      </Button>

      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#F97316] to-[#0006] animate-gradient"
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradient 15s ease infinite',
            zIndex: 1,
          }}
        />
        
        <div className="relative z-10 min-h-screen">
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
    </div>
  );
};

export default SeniorPanel;
