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
    <main className="min-h-screen bg-white overflow-hidden">
      <div className="relative">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-secondary/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-primary/10 to-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-0 left-1/2 w-[800px] h-[800px] bg-gradient-to-t from-primary/5 to-secondary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 pt-24 pb-32 relative">
          <nav className="absolute top-8 left-4 right-4 flex justify-between items-center z-10">
            <h2 className="text-3xl font-semibold text-[#F97316] -tracking-wide" style={{ fontFamily: 'Crimson Text, serif' }}>
              neighbour
            </h2>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-primary hover:text-primary/80 hover:bg-primary/10 animate-fade-in"
              >
                Log in
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-primary text-white hover:bg-primary/90 animate-fade-in [animation-delay:200ms] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </nav>

          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-foreground tracking-tight leading-tight mb-6">
                Welcome to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary block">Neighbour</span>
              </h1>
            </div>
            
            <p className={`text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Experience the future of family care with our intelligent AI companion
            </p>

            <div className={`relative mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex items-center justify-center mb-12">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                  <Button 
                    className="relative px-8 py-6 bg-white rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
                    variant="outline"
                  >
                    <Bot className="w-6 h-6 mr-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-lg">Hey! How can I help your family today?</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className={`flex justify-center gap-6 pt-8 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-primary text-white hover:bg-primary/90 h-14 px-8 text-lg group shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/demo')}
                className="h-14 px-8 text-lg border-primary/20 hover:border-primary/40 group"
              >
                Watch Demo
                <MessageCircle className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="py-32 bg-gradient-to-b from-white to-secondary/20">
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
