
import { useNavigate } from "react-router-dom";
import { Home, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-[#F97316] -tracking-wide" style={{ fontFamily: 'Crimson Text, serif' }}>
            neighbour
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/home')}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/neighbours')}
          >
            <Users className="mr-2 h-4 w-4" />
            Neighbours
          </Button>
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-around">
        <Button variant="ghost" onClick={() => navigate('/home')}>
          <Home className="h-5 w-5" />
        </Button>
        <Button variant="ghost" onClick={() => navigate('/neighbours')}>
          <Users className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
