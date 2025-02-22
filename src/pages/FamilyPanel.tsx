
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Settings2, 
  Volume2, 
  ExternalLink, 
  LogOut,
  Home,
  Menu,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Panel {
  id: string;
  name: string;
  welcome_message: string;
  assistant_prompt: string;
  voice_type: string;
}

const FamilyPanel = () => {
  const navigate = useNavigate();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelToDelete, setPanelToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('User error:', userError);
        throw userError;
      }

      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/');
        return;
      }

      console.log('Fetching panels for user:', user.id);
      const { data: panels, error } = await supabase
        .from('panels')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Fetch panels error:', error);
        throw error;
      }
      
      console.log('Fetched panels:', panels);
      setPanels(panels || []);
    } catch (error) {
      console.error('Error fetching panels:', error);
      toast.error('Failed to load panels');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePanel = async (panelId: string) => {
    try {
      const { error } = await supabase
        .from('panels')
        .delete()
        .eq('id', panelId);

      if (error) throw error;

      setPanels(panels.filter(panel => panel.id !== panelId));
      toast.success('Panel deleted successfully');
    } catch (error) {
      console.error('Error deleting panel:', error);
      toast.error('Failed to delete panel');
    } finally {
      setPanelToDelete(null);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Neighbour</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/family')}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-primary"
            onClick={() => navigate('/bot-settings')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Panel
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

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden absolute top-4 left-4"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-6">
            <SheetTitle>Neighbour</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 px-4 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate('/family')}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-primary"
              onClick={() => navigate('/bot-settings')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Panel
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
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="container mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Senior Panels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card 
                className="p-6 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-accent"
                onClick={() => navigate('/bot-settings')}
              >
                <Plus className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-medium">Create New Senior Panel</h3>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Create a new senior-friendly interface
                </p>
              </Card>

              {panels.map((panel) => (
                <Card key={panel.id} className="p-6 flex flex-col min-h-[200px]">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-medium">{panel.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/bot-settings?panel=${panel.id}`)}
                      >
                        <Settings2 className="h-5 w-5 text-muted-foreground hover:text-accent" />
                      </Button>
                      <AlertDialog open={panelToDelete === panel.id} onOpenChange={(open) => !open && setPanelToDelete(null)}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPanelToDelete(panel.id)}
                          >
                            <Trash2 className="h-5 w-5 text-destructive hover:text-destructive/80" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this panel?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the panel
                              and all its associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeletePanel(panel.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4">
                      Simple voice interface for daily use
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Voice Assistant Active
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => navigate('/senior')}>
                      Open Panel
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/bot-settings?panel=${panel.id}`)}
                    >
                      Settings
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FamilyPanel;
