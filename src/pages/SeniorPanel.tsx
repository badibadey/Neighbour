
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SeniorPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const panelData = location.state?.panelData;

  return (
    <div>
      <Button 
        variant="ghost" 
        className="text-primary flex items-center gap-2 m-4"
        onClick={() => navigate('/family')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Family Panel
      </Button>
      <elevenlabs-convai agent-id="xUPvftKCr58LTe0Ffz5m"></elevenlabs-convai>
      <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
    </div>
  );
};

export default SeniorPanel;
