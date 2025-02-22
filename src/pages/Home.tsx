
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Video, 
  UserRound, 
  MessageCircle, 
  MicOff,
  ArrowRight 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Home = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8 pt-6 max-w-6xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight animate-fade-in">Welcome to Neighbour</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in">
            Create personalized voice assistants for your loved ones. Get started in minutes.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Voice Control</h3>
            <p className="text-muted-foreground">
              Create intuitive voice interfaces that make daily tasks easier for seniors
            </p>
          </Card>
          
          <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserRound className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Personalized Assistant</h3>
            <p className="text-muted-foreground">
              Customize the assistant's personality and responses to match your loved one's needs
            </p>
          </Card>
          
          <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Natural Conversations</h3>
            <p className="text-muted-foreground">
              Enable natural, context-aware conversations that feel friendly and familiar
            </p>
          </Card>
          
          <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MicOff className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Offline Mode</h3>
            <p className="text-muted-foreground">
              Works without internet connection for reliable assistance anytime
            </p>
          </Card>
        </div>

        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-semibold">Quick Setup</h2>
          
          <Card>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Create Your First Neighbour</h3>
                  <p className="text-sm text-muted-foreground">Estimated 2-3 minutes</p>
                </div>
                <Button 
                  onClick={() => navigate('/bot-settings')}
                  className="group transition-all duration-300 hover:pr-8"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-2" />
                </Button>
              </div>

              <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Configure Voice Settings</h3>
                  <p className="text-sm text-muted-foreground">Estimated 1 minute</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/bot-settings')}
                  className="group transition-all duration-300 hover:pr-8"
                >
                  Configure
                  <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-2" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Add Family Members</h3>
                  <p className="text-sm text-muted-foreground">Estimated 2 minutes</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/bot-settings')}
                  className="group transition-all duration-300 hover:pr-8"
                >
                  Add Members
                  <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
