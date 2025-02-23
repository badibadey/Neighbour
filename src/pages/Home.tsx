
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, ShieldCheck, Clock, Heart } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Home = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-32 p-8 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Get Started
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Follow these steps to create your personalized voice assistant
            </p>
          </div>

          {/* Gradient orb animation replacing the 4 cards */}
          <div className="mt-8 min-h-[400px] relative flex items-center justify-center">
            <div className="absolute">
              <div className="relative w-[400px] h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/40 to-[#FEC6A1]/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute inset-8 bg-gradient-to-br from-[#F97316]/60 to-[#FEC6A1]/30 rounded-full blur-xl animate-pulse [animation-delay:1s]" />
                <div className="absolute inset-16 bg-gradient-to-br from-[#F97316]/80 to-[#FEC6A1]/40 rounded-full blur-lg animate-pulse [animation-delay:2s]" />
              </div>
            </div>
            <div className="relative z-10 text-center">
              <Button 
                onClick={() => navigate('/bot-settings')}
                className="group transition-all duration-300 hover:pr-8 bg-gray-900 hover:bg-gray-800"
              >
                Create Your First Neighbour
                <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-2" />
              </Button>
            </div>
          </div>
        </div>

        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-primary/5" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ready to Transform Your Family Care?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of families experiencing the future of intelligent care assistance.
              </p>
              <Button 
                onClick={() => navigate('/bot-settings')}
                className="bg-primary text-white hover:bg-primary/90 h-14 px-10 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Home;
