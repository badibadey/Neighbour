
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Calendar, Phone, Heart, AlertCircle, Activity, MessageSquare } from "lucide-react";

interface DashboardButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'urgent';
}

const DashboardButton = ({ icon, label, onClick, variant = 'default' }: DashboardButtonProps) => (
  <Button
    onClick={onClick}
    className={`senior-button w-full ${
      variant === 'urgent' ? 'bg-urgent text-urgent-foreground' : 'bg-accent text-accent-foreground'
    }`}
  >
    {icon}
    <span className="flex-1">{label}</span>
  </Button>
);

const SeniorDashboard = () => {
  const handleEmergency = () => {
    // TODO: Implement emergency functionality
    console.log("Emergency button pressed");
  };

  const handleMedication = () => {
    // TODO: Implement medication reminder functionality
    console.log("Medication reminder pressed");
  };

  const handleCall = () => {
    // TODO: Implement video call functionality
    console.log("Video call pressed");
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in">
      {/* Emergency Button */}
      <div className="mb-8">
        <DashboardButton
          icon={<AlertCircle className="h-8 w-8" />}
          label="Emergency Help"
          onClick={handleEmergency}
          variant="urgent"
        />
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="senior-card">
          <DashboardButton
            icon={<Bell className="h-6 w-6" />}
            label="Medication Reminders"
            onClick={handleMedication}
          />
        </Card>

        <Card className="senior-card">
          <DashboardButton
            icon={<Phone className="h-6 w-6" />}
            label="Call Family"
            onClick={handleCall}
          />
        </Card>

        <Card className="senior-card">
          <DashboardButton
            icon={<Calendar className="h-6 w-6" />}
            label="Appointments"
            onClick={() => console.log("Appointments pressed")}
          />
        </Card>

        <Card className="senior-card">
          <DashboardButton
            icon={<Heart className="h-6 w-6" />}
            label="Daily Check-in"
            onClick={() => console.log("Daily check-in pressed")}
          />
        </Card>
      </div>

      {/* Status Section */}
      <Card className="senior-card mt-8">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-accent" />
            <span className="senior-text">Activity Status: Active</span>
          </div>
          <MessageSquare className="h-6 w-6 text-muted-foreground" />
        </div>
      </Card>
    </div>
  );
};

export default SeniorDashboard;
