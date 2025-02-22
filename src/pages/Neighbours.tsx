
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Settings2, 
  Volume2, 
  ExternalLink, 
  Info,
  Trash2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import PanelSummaryDialog from '@/components/PanelSummaryDialog';
import DashboardLayout from '@/components/DashboardLayout';
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
  family_member: string;
  agent_id?: string | null;
}

interface PanelWithDetails extends Panel {
  events: any[];
  drugs: any[];
  family_members: any[];
}

const Neighbours = () => {
  const navigate = useNavigate();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelToDelete, setPanelToDelete] = useState<string | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<PanelWithDetails | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      setLoading(true);
      const { data: panels, error } = await supabase
        .from('panels')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPanels(panels || []);
    } catch (error) {
      console.error('Error fetching panels:', error);
      toast.error('Failed to load neighbours');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (panel: Panel) => {
    try {
      const [
        { data: events },
        { data: drugs },
        { data: family_members }
      ] = await Promise.all([
        supabase.from('events').select('*').eq('panel_id', panel.id),
        supabase.from('drugs').select('*').eq('panel_id', panel.id),
        supabase.from('family_members').select('*').eq('panel_id', panel.id)
      ]);

      setSelectedPanel({
        ...panel,
        events: events || [],
        drugs: drugs || [],
        family_members: family_members || []
      });
      setSummaryOpen(true);
    } catch (error) {
      console.error('Error fetching panel details:', error);
      toast.error('Failed to load neighbour details');
    }
  };

  const handleEditPanel = (panel: Panel) => {
    navigate(`/bot-settings?panel=${panel.id}`, { 
      state: { 
        panelData: panel 
      }
    });
  };

  const handleDeletePanel = async (panelId: string) => {
    try {
      const { error } = await supabase
        .from('panels')
        .delete()
        .eq('id', panelId);

      if (error) throw error;

      setPanels(panels.filter(panel => panel.id !== panelId));
      toast.success('Neighbour deleted successfully');
    } catch (error) {
      console.error('Error deleting panel:', error);
      toast.error('Failed to delete neighbour');
    } finally {
      setPanelToDelete(null);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Your Neighbours</h2>
          <Button onClick={() => navigate('/bot-settings')}>
            <Plus className="mr-2 h-4 w-4" /> Create New Neighbour
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {panels.map((panel) => (
            <Card key={panel.id} className="p-6 flex flex-col min-h-[200px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-medium">{panel.name}</h3>
                  <p className="text-sm text-muted-foreground">Neighbour for {panel.family_member}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDetails(panel)}
                  >
                    <Info className="h-5 w-5 text-muted-foreground hover:text-accent" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditPanel(panel)}
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
                        <AlertDialogTitle>Are you sure you want to delete this neighbour?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the neighbour
                          and all their associated data.
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
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Voice Assistant Active
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => navigate('/senior')}>
                  Open Interface
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleEditPanel(panel)}
                >
                  Settings
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <PanelSummaryDialog 
          open={summaryOpen}
          onOpenChange={setSummaryOpen}
          panelData={selectedPanel}
        />
      </div>
    </DashboardLayout>
  );
};

export default Neighbours;
