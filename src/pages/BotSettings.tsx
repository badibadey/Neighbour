
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings2, Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FamilyMember {
  id: string;
  name: string;
  birthDate: string;
}

interface Drug {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

const BotSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  
  // Family Members Form
  const [newMember, setNewMember] = useState({ name: '', birthDate: '' });
  
  // Drugs Form
  const [newDrug, setNewDrug] = useState({ name: '', dosage: '', schedule: '' });
  
  // Events Form
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });

  const handleAddFamilyMember = () => {
    if (newMember.name && newMember.birthDate) {
      setFamilyMembers([...familyMembers, { ...newMember, id: Date.now().toString() }]);
      setNewMember({ name: '', birthDate: '' });
      toast.success("Family member added successfully");
    }
  };

  const handleAddDrug = () => {
    if (newDrug.name && newDrug.dosage && newDrug.schedule) {
      setDrugs([...drugs, { ...newDrug, id: Date.now().toString() }]);
      setNewDrug({ name: '', dosage: '', schedule: '' });
      toast.success("Drug added successfully");
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
      setNewEvent({ title: '', date: '', description: '' });
      toast.success("Event added successfully");
    }
  };

  const handleDelete = (id: string, type: 'family' | 'drug' | 'event') => {
    switch (type) {
      case 'family':
        setFamilyMembers(familyMembers.filter(m => m.id !== id));
        break;
      case 'drug':
        setDrugs(drugs.filter(d => d.id !== id));
        break;
      case 'event':
        setEvents(events.filter(e => e.id !== id));
        break;
    }
    toast.success("Item deleted successfully");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-primary flex items-center gap-2 hover:text-primary/80 hover:bg-primary/10"
              onClick={() => navigate('/family')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Settings2 className="w-8 h-8" />
            Setup Neighbour
          </h1>
        </div>
        
        <Card className="p-6 shadow-lg border-primary/10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-4 bg-secondary/20 p-1">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="family">Family Members</TabsTrigger>
              <TabsTrigger value="drugs">Drugs</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">Assistant Name</label>
                  <Input placeholder="Senior Assistant" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">Welcome Message</label>
                  <Input placeholder="Hi! How can I help you today?" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">Main Assistant Prompt</label>
                  <Textarea 
                    className="min-h-[200px]"
                    placeholder="You are an empathetic and patient assistant for seniors..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">Assistant Voice</label>
                  <Select defaultValue="sarah">
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="family" className="mt-6">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Add Family Member</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="Name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    />
                    <Input
                      type="date"
                      value={newMember.birthDate}
                      onChange={(e) => setNewMember({...newMember, birthDate: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddFamilyMember}>Add Family Member</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Family Members List</h3>
                  {familyMembers.map((member) => (
                    <Card key={member.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">Born: {member.birthDate}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(member.id, 'family')}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="drugs" className="mt-6">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Add Drug</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input
                      placeholder="Drug name"
                      value={newDrug.name}
                      onChange={(e) => setNewDrug({...newDrug, name: e.target.value})}
                    />
                    <Input
                      placeholder="Dosage"
                      value={newDrug.dosage}
                      onChange={(e) => setNewDrug({...newDrug, dosage: e.target.value})}
                    />
                    <Input
                      placeholder="Schedule"
                      value={newDrug.schedule}
                      onChange={(e) => setNewDrug({...newDrug, schedule: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddDrug}>Add Drug</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Drugs List</h3>
                  {drugs.map((drug) => (
                    <Card key={drug.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{drug.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Dosage: {drug.dosage} | Schedule: {drug.schedule}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(drug.id, 'drug')}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Add Event</h3>
                  <div className="grid gap-4">
                    <Input
                      placeholder="Event title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    />
                    <Input
                      type="datetime-local"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                    <Textarea
                      placeholder="Event description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Events List</h3>
                  {events.map((event) => (
                    <Card key={event.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Date: {event.date}
                        </p>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id, 'event')}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/family')}
              className="hover:bg-primary/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast.success("Changes saved successfully");
                navigate('/family');
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default BotSettings;
