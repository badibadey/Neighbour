
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="senior-heading text-center text-primary">CareCompanion</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Button 
            onClick={() => navigate('/family')}
            className="senior-button bg-accent text-accent-foreground h-32"
          >
            Family Panel
            <span className="text-sm block opacity-75">
              Create and manage care assistants
            </span>
          </Button>
          <Button
            onClick={() => navigate('/senior')}
            className="senior-button bg-primary text-primary-foreground h-32"
          >
            Senior Panel
            <span className="text-sm block opacity-75">
              Connect with your care assistant
            </span>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Index;
