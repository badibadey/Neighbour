
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, ShieldCheck, Clock, Heart, Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/family');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <main className="min-h-screen bg-white">
      <div className="relative min-h-screen bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#9A3412] overflow-hidden">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between pt-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-semibold text-white -tracking-wide" style={{ fontFamily: 'Crimson Text, serif' }}>
                neighbour
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-white hover:text-white/80 hover:bg-white/10 animate-fade-in rounded-full"
              >
                Log in
              </Button>
            </div>
          </nav>
        </div>

        <div className="container mx-auto px-4 min-h-screen">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-screen">
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Intelligent Care <br />for Your Family
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-lg">
                Personalized AI companion that brings comfort and connection to your loved ones
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                >
                  Try Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/demo')}
                  className="h-14 px-8 text-lg bg-primary text-white hover:bg-primary/90 rounded-full"
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            <div className={`relative h-[600px] transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-[400px] h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute inset-8 bg-gradient-to-br from-white/60 to-white/30 rounded-full blur-xl animate-pulse [animation-delay:1s]" />
                  <div className="absolute inset-16 bg-gradient-to-br from-white/80 to-white/40 rounded-full blur-lg animate-pulse [animation-delay:2s]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-2xl font-medium text-[#F97316]" style={{ fontFamily: 'Crimson Text, serif' }}>
                      Hi, neighbour
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                title: "Secure & Private",
                description: "Enterprise-grade security protecting your family's data"
              },
              {
                icon: <Clock className="h-8 w-8 text-primary" />,
                title: "24/7 Assistance",
                description: "Round-the-clock AI support for your family's needs"
              },
              {
                icon: <Heart className="h-8 w-8 text-primary" />,
                title: "Family-First",
                description: "Personalized care designed around your family"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-500 group hover:transform hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${600 + index * 200}ms` }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              onClick={() => navigate('/signup')}
              className="bg-primary text-white hover:bg-primary/90 h-14 px-10 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
