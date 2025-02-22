
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Calendar, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalNeighbours: 0,
    totalEvents: 0,
    totalNotifications: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: panelsCount },
          { count: eventsCount }
        ] = await Promise.all([
          supabase.from('panels').select('*', { count: 'exact' }),
          supabase.from('events').select('*', { count: 'exact' })
        ]);

        setStats({
          totalNeighbours: panelsCount || 0,
          totalEvents: eventsCount || 0,
          totalNotifications: 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to Neighbour</h2>
          <Button onClick={() => navigate('/bot-settings')}>
            <Plus className="mr-2 h-4 w-4" /> Create New Neighbour
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium">Total Neighbours</h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalNeighbours}</p>
          </Card>
          
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium">Active Events</h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalEvents}</p>
          </Card>
          
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium">Notifications</h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalNotifications}</p>
          </Card>
        </div>

        {stats.totalNeighbours === 0 && (
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-6">
              <div className="rounded-full bg-primary/10 p-4">
                <Plus className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Create Your First Neighbour</h3>
              <p className="text-center text-muted-foreground max-w-sm">
                Get started by creating a new Neighbour interface for your loved ones. It only takes a few minutes.
              </p>
              <Button size="lg" onClick={() => navigate('/bot-settings')}>
                <Plus className="mr-2 h-4 w-4" /> Create New Neighbour
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
