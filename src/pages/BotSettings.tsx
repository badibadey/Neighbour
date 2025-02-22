
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

interface SetupData {
  basic: {
    name: string;
    welcomeMessage: string;
    assistantPrompt: string;
    voiceType: string;
  };
  familyMembers: {
    name: string;
    birthDate: string;
  }[];
  drugs: {
    name: string;
    dosage: string;
    schedule: string;
  }[];
  events: {
    title: string;
    date: string;
    description: string;
  }[];
}

const BotSettings = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>({
    basic: {
      name: 'New Senior Panel',
      welcomeMessage: 'Hi! How can I help you today?',
      assistantPrompt: 'You are an empathetic and patient assistant for seniors...',
      voiceType: 'sarah'
    },
    familyMembers: [],
    drugs: [],
    events: []
  });

  const steps = [
    {
      title: 'Basic Settings',
      component: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium block">Assistant Name</label>
            <Input 
              value={setupData.basic.name}
              onChange={(e) => setSetupData({
                ...setupData,
                basic: { ...setupData.basic, name: e.target.value }
              })}
              placeholder="Senior Assistant"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Welcome Message</label>
            <Input 
              value={setupData.basic.welcomeMessage}
              onChange={(e) => setSetupData({
                ...setupData,
                basic: { ...setupData.basic, welcomeMessage: e.target.value }
              })}
              placeholder="Hi! How can I help you today?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Assistant Voice</label>
            <Select 
              value={setupData.basic.voiceType}
              onValueChange={(value) => setSetupData({
                ...setupData,
                basic: { ...setupData.basic, voiceType: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarah">Sarah</SelectItem>
                <SelectItem value="mike">Mike</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Assistant Prompt</label>
            <Textarea 
              value={setupData.basic.assistantPrompt}
              onChange={(e) => setSetupData({
                ...setupData,
                basic: { ...setupData.basic, assistantPrompt: e.target.value }
              })}
              placeholder="You are an empathetic and patient assistant for seniors..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Family Members',
      component: (
        <div className="space-y-6">
          {setupData.familyMembers.map((member, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{member.name}</h3>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const newMembers = setupData.familyMembers.filter((_, i) => i !== index);
                      setSetupData({ ...setupData, familyMembers: newMembers });
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Born: {member.birthDate}</p>
              </div>
            </Card>
          ))}
          
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Add New Family Member</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setSetupData({
                        ...setupData,
                        familyMembers: [
                          ...setupData.familyMembers,
                          { name: e.currentTarget.value, birthDate: '' }
                        ]
                      });
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Input
                  type="date"
                  onChange={(e) => {
                    if (setupData.familyMembers.length > 0) {
                      const newMembers = [...setupData.familyMembers];
                      newMembers[newMembers.length - 1].birthDate = e.target.value;
                      setSetupData({ ...setupData, familyMembers: newMembers });
                    }
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: 'Medications',
      component: (
        <div className="space-y-6">
          {setupData.drugs.map((drug, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{drug.name}</h3>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const newDrugs = setupData.drugs.filter((_, i) => i !== index);
                      setSetupData({ ...setupData, drugs: newDrugs });
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dosage: {drug.dosage} | Schedule: {drug.schedule}
                </p>
              </div>
            </Card>
          ))}
          
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Add New Medication</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder="Medication name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setSetupData({
                        ...setupData,
                        drugs: [
                          ...setupData.drugs,
                          { name: e.currentTarget.value, dosage: '', schedule: '' }
                        ]
                      });
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Input
                  placeholder="Dosage"
                  onChange={(e) => {
                    if (setupData.drugs.length > 0) {
                      const newDrugs = [...setupData.drugs];
                      newDrugs[newDrugs.length - 1].dosage = e.target.value;
                      setSetupData({ ...setupData, drugs: newDrugs });
                    }
                  }}
                />
                <Input
                  placeholder="Schedule"
                  onChange={(e) => {
                    if (setupData.drugs.length > 0) {
                      const newDrugs = [...setupData.drugs];
                      newDrugs[newDrugs.length - 1].schedule = e.target.value;
                      setSetupData({ ...setupData, drugs: newDrugs });
                    }
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: 'Events',
      component: (
        <div className="space-y-6">
          {setupData.events.map((event, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{event.title}</h3>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const newEvents = setupData.events.filter((_, i) => i !== index);
                      setSetupData({ ...setupData, events: newEvents });
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Date: {event.date}
                  {event.description && <br />}
                  {event.description}
                </p>
              </div>
            </Card>
          ))}
          
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Add New Event</h3>
              <div className="grid gap-4">
                <Input
                  placeholder="Event title"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setSetupData({
                        ...setupData,
                        events: [
                          ...setupData.events,
                          { title: e.currentTarget.value, date: '', description: '' }
                        ]
                      });
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Input
                  type="datetime-local"
                  onChange={(e) => {
                    if (setupData.events.length > 0) {
                      const newEvents = [...setupData.events];
                      newEvents[newEvents.length - 1].date = e.target.value;
                      setSetupData({ ...setupData, events: newEvents });
                    }
                  }}
                />
                <Textarea
                  placeholder="Event description"
                  onChange={(e) => {
                    if (setupData.events.length > 0) {
                      const newEvents = [...setupData.events];
                      newEvents[newEvents.length - 1].description = e.target.value;
                      setSetupData({ ...setupData, events: newEvents });
                    }
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ];

  const saveToSupabase = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        navigate('/');
        return;
      }

      // Create panel first
      const { data: panel, error: panelError } = await supabase
        .from('panels')
        .insert([{
          user_id: user.id,
          name: setupData.basic.name,
          welcome_message: setupData.basic.welcomeMessage,
          assistant_prompt: setupData.basic.assistantPrompt,
          voice_type: setupData.basic.voiceType
        }])
        .select()
        .single();

      if (panelError) throw panelError;

      // Add family members
      if (setupData.familyMembers.length > 0) {
        const { error: familyError } = await supabase
          .from('family_members')
          .insert(
            setupData.familyMembers.map(member => ({
              panel_id: panel.id,
              name: member.name,
              birth_date: member.birthDate
            }))
          );
        if (familyError) throw familyError;
      }

      // Add drugs
      if (setupData.drugs.length > 0) {
        const { error: drugsError } = await supabase
          .from('drugs')
          .insert(
            setupData.drugs.map(drug => ({
              panel_id: panel.id,
              name: drug.name,
              dosage: drug.dosage,
              schedule: drug.schedule
            }))
          );
        if (drugsError) throw drugsError;
      }

      // Add events
      if (setupData.events.length > 0) {
        const { error: eventsError } = await supabase
          .from('events')
          .insert(
            setupData.events.map(event => ({
              panel_id: panel.id,
              title: event.title,
              date: event.date,
              description: event.description
            }))
          );
        if (eventsError) throw eventsError;
      }

      toast.success('Setup completed successfully!');
      navigate('/family');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save settings');
    }
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
          <h1 className="text-3xl font-bold text-center">
            Setup Neighbour - Step {currentStep + 1} of {steps.length}
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            {steps[currentStep].title}
          </p>
        </div>
        
        <Card className="p-6 shadow-lg border-primary/10 max-w-2xl mx-auto">
          {steps[currentStep].component}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next Step
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={saveToSupabase}>
                Complete Setup
              </Button>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
};

export default BotSettings;
