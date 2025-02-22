
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SeniorPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const panelData = location.state?.panelData;
  const primaryFamilyMember = panelData?.family_member || 'there';

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
        <elevenlabs-convai agent-id="xUPvftKCr58LTe0Ffz5m"></elevenlabs-convai>
        <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
      </div>
    </main>
  );
};

export default SeniorPanel;
