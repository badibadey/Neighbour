
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Clock, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 pt-24 pb-16 relative">
          <nav className="absolute top-8 right-4 flex gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary/80 hover:bg-primary/10 animate-fade-in"
            >
              Log in
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-primary text-white hover:bg-primary/90 animate-fade-in [animation-delay:200ms]"
            >
              Get Started
            </Button>
          </nav>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground tracking-tight leading-tight animate-slide-up opacity-0">
              Family Care, 
              <span className="text-primary block">Simplified</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:200ms] opacity-0">
              Connect, coordinate, and care for your loved ones with our intelligent family assistance platform.
            </p>

            <div className="flex justify-center gap-4 pt-8 animate-slide-up [animation-delay:400ms] opacity-0">
              <Button 
                onClick={() => navigate('/family')}
                className="bg-primary text-white hover:bg-primary/90 h-12 px-8 text-lg group"
              >
                Start Your Care Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                title: "Secure & Private",
                description: "Your family's data is protected with enterprise-grade security"
              },
              {
                icon: <Clock className="h-8 w-8 text-primary" />,
                title: "24/7 Assistance",
                description: "Round-the-clock support for your family's needs"
              },
              {
                icon: <Heart className="h-8 w-8 text-primary" />,
                title: "Family-First",
                description: "Designed with your family's comfort in mind"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300 animate-slide-up opacity-0"
                style={{ animationDelay: `${600 + index * 200}ms` }}
              >
                <div className="bg-primary/10 rounded-xl p-3 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold animate-slide-up opacity-0">
              Ready to Transform Family Care?
            </h2>
            <p className="text-lg text-muted-foreground animate-slide-up [animation-delay:200ms] opacity-0">
              Join thousands of families who are already experiencing the future of care coordination.
            </p>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-primary text-white hover:bg-primary/90 h-12 px-8 text-lg animate-slide-up [animation-delay:400ms] opacity-0"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
