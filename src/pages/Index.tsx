
import SeniorDashboard from "@/components/SeniorDashboard";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="senior-heading text-center text-primary">CareCompanion</h1>
        </div>
      </header>
      <SeniorDashboard />
    </main>
  );
};

export default Index;
