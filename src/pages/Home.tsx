
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Home = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8 pt-16 max-w-6xl mx-auto">
        <div className="relative z-10 text-center space-y-6 opacity-0 animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
          <h1 className="text-4xl tracking-tight" style={{ fontFamily: 'Crimson Text, serif' }}>
            Welcome to <span className="bg-gradient-to-r from-[#F97316] to-[#FEC6A1] bg-clip-text text-transparent">neighbour</span>
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Create personalized voice assistants for your loved ones.
            <span className="block mt-2 font-medium">Get started in minutes.</span>
          </p>
        </div>
        
        <div className="min-h-[300px] relative flex items-center justify-center opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards]">
          <div className="absolute">
            <div className="relative w-[300px] h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/40 to-[#FEC6A1]/20 rounded-full blur-2xl animate-pulse scale-0 animate-[scaleIn_1s_ease-out_0.8s_forwards]" />
              <div className="absolute inset-8 bg-gradient-to-br from-[#F97316]/60 to-[#FEC6A1]/30 rounded-full blur-xl animate-pulse scale-0 animate-[scaleIn_1s_ease-out_1s_forwards] [animation-delay:1s]" />
              <div className="absolute inset-16 bg-gradient-to-br from-[#F97316]/80 to-[#FEC6A1]/40 rounded-full blur-lg animate-pulse scale-0 animate-[scaleIn_1s_ease-out_1.2s_forwards] [animation-delay:2s]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 animate-[fadeIn_0.6s_ease-out_1.4s_forwards]">
                <span className="text-white text-xl lowercase z-10" style={{ fontFamily: 'Crimson Text, serif' }}>hi, neighbour</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 opacity-0 animate-[fadeIn_0.6s_ease-out_1.6s_forwards]">
          <h2 className="text-2xl font-semibold text-gray-900">Quick Setup</h2>
          
          <Card className="border transform translate-y-4 opacity-0 animate-[slideUp_0.6s_ease-out_1.8s_forwards]">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-gray-900">Create Your First Neighbour</h3>
                  <p className="text-sm text-gray-600">Estimated 2-3 minutes</p>
                </div>
                <Button 
                  onClick={() => navigate('/bot-settings')}
                  className="group transition-all duration-300 hover:pr-8 bg-gray-900 hover:bg-gray-800"
                >
                  Add Neighbour
                  <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-2" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-gray-900">View Your Neighbours</h3>
                  <p className="text-sm text-gray-600">Check your existing assistants</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/neighbours')}
                  className="group transition-all duration-300 hover:pr-8 border border-gray-200 text-gray-900 hover:bg-gray-50"
                >
                  View All
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
