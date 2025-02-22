import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Upload, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SetupData, FamilyMember, Medication, Event } from '@/types/setup';

const WELCOME_MESSAGES = [
  "Hi! I'm here to help you with your daily tasks.",
  "Welcome! How can I assist you today?",
  "Hello! I'm your personal assistant.",
  "Good day! I'm here to make your day easier.",
  "Welcome back! What can I do for you today?"
];

const MEDICATIONS_DATABASE = [
  { id: '1', name: 'Aspirin', defaultDosage: '100mg' },
  { id: '2', name: 'Ibuprofen', defaultDosage: '400mg' },
  { id: '3', name: 'Paracetamol', defaultDosage: '500mg' },
];

const BotSettings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const panelId = searchParams.get('panel');
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>({
    basic: {
      name: 'My Neighbour',
      welcomeMessage: WELCOME_MESSAGES[0],
      familyMember: ''
    },
    familyMembers: [],
    drugs: [],
    events: []
  });
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState({ name: '', birthDate: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });

  const handleExit = useCallback(() => {
    setIsExitDialogOpen(true);
  }, []);

  const confirmExit = useCallback(() => {
    navigate('/family');
  }, [navigate]);

  useEffect(() => {
    if (panelId) {
      fetchPanelData(panelId);
    }
  }, [panelId]);

  const fetchPanelData = async (id: string) => {
    try {
      const { data: panel, error: panelError } = await supabase
        .from('panels')
        .select('*')
        .eq('id', id)
        .single();

      if (panelError) throw panelError;

      const { data: familyMembers, error: familyError } = await supabase
        .from('family_members')
        .select('*')
        .eq('panel_id', id);

      if (familyError) throw familyError;

      const { data: drugs, error: drugsError } = await supabase
        .from('drugs')
        .select('*')
        .eq('panel_id', id);

      if (drugsError) throw drugsError;

      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('panel_id', id);

      if (eventsError) throw eventsError;

      setSetupData({
        basic: {
          name: panel.name,
          welcomeMessage: panel.welcome_message,
          familyMember: panel.family_member || ''
        },
        familyMembers: familyMembers || [],
        drugs: drugs || [],
        events: events || []
      });
    } catch (error) {
      console.error('Error fetching panel data:', error);
      toast.error('Failed to load panel data');
    }
  };

  const handleAddFamilyMember = () => {
    if (newFamilyMember.name && newFamilyMember.birthDate) {
      setSetupData({
        ...setupData,
        familyMembers: [...setupData.familyMembers, { ...newFamilyMember, photoUrl: '' }]
      });
      setNewFamilyMember({ name: '', birthDate: '' });
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      setSetupData({
        ...setupData,
        events: [...setupData.events, newEvent]
      });
      setNewEvent({ title: '', date: '', description: '' });
    }
  };

  const handleFileUpload = async (file: File, memberIndex: number) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `family-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      const newMembers = [...setupData.familyMembers];
      newMembers[memberIndex] = {
        ...newMembers[memberIndex],
        photoUrl: publicUrl
      };

      setSetupData({ ...setupData, familyMembers: newMembers });
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload photo');
    }
  };

  const handleAddMedication = (med: typeof MEDICATIONS_DATABASE[0]) => {
    const newMedication: Medication = {
      id: med.id,
      name: med.name,
      dosage: med.defaultDosage,
      schedule: {
        frequency: 'daily',
        time: '08:00'
      }
    };

    setSetupData(prevData => ({
      ...prevData,
      drugs: [...prevData.drugs, newMedication]
    }));
  };

  const updateMedicationSchedule = (index: number, frequency: 'daily' | 'weekly' | 'monthly', time: string) => {
    setSetupData(prevData => {
      const newDrugs = [...prevData.drugs];
      newDrugs[index] = {
        ...newDrugs[index],
        schedule: {
          frequency,
          time
        }
      };
      return {
        ...prevData,
        drugs: newDrugs
      };
    });
  };

  const steps = [
    {
      title: 'Basic Settings',
      component: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium block">Neighbour Name</label>
            <Input 
              value={setupData.basic.name}
              onChange={(e) => setSetupData({
                ...setupData,
                basic: { ...setupData.basic, name: e.target.value }
              })}
              placeholder="My Neighbour"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Family Member</label>
            <Input 
              value={setupData.basic.familyMember}
              onChange={(e) => setSetupData({
                ...setupData,
                basic: { ...setupData.basic, familyMember: e.target.value }
              })}
              placeholder="Primary family member"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Welcome Message</label>
            <Select 
              value={setupData.basic.welcomeMessage}
              onValueChange={(value) => setSetupData({
                ...setupData,
                basic: { ...setupData.basic, welcomeMessage: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select welcome message" />
              </SelectTrigger>
              <SelectContent>
                {WELCOME_MESSAGES.map((message, index) => (
                  <SelectItem key={index} value={message}>
                    {message}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Born: {member.birthDate}</p>
                    {member.photoUrl && (
                      <img 
                        src={member.photoUrl} 
                        alt={member.name} 
                        className="mt-2 w-24 h-24 object-cover rounded-full"
                      />
                    )}
                  </div>
                  <div className="flex items-center">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`photo-upload-${index}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, index);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById(`photo-upload-${index}`)?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Add New Family Member</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Name"
                  value={newFamilyMember.name}
                  onChange={(e) => setNewFamilyMember({
                    ...newFamilyMember,
                    name: e.target.value
                  })}
                />
                <Input
                  type="date"
                  value={newFamilyMember.birthDate}
                  onChange={(e) => setNewFamilyMember({
                    ...newFamilyMember,
                    birthDate: e.target.value
                  })}
                />
              </div>
              <Button 
                onClick={handleAddFamilyMember}
                disabled={!newFamilyMember.name || !newFamilyMember.birthDate}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Family Member
              </Button>
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
                <div className="grid gap-4">
                  <p className="text-sm text-muted-foreground">
                    Dosage: {drug.dosage}
                  </p>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Frequency</label>
                    <Select 
                      value={drug.schedule.frequency}
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly') => {
                        updateMedicationSchedule(index, value, drug.schedule.time);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input
                      type="time"
                      value={drug.schedule.time}
                      onChange={(e) => {
                        updateMedicationSchedule(index, drug.schedule.frequency, e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Add New Medication</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    {setupData.drugs.length === 0 ? "Select Medication" : "Add Another Medication"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Search medications..." />
                      <CommandEmpty>No medication found.</CommandEmpty>
                      <CommandGroup>
                        {MEDICATIONS_DATABASE.map((med) => (
                          <CommandItem
                            key={med.id}
                            onSelect={() => {
                              handleAddMedication(med);
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{med.name}</span>
                              <span className="text-sm text-muted-foreground">
                                Default dosage: {med.defaultDosage}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    title: e.target.value
                  })}
                />
                <Input
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    date: e.target.value
                  })}
                />
                <Input
                  placeholder="Event description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    description: e.target.value
                  })}
                />
                <Button 
                  onClick={handleAddEvent}
                  disabled={!newEvent.title || !newEvent.date}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
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

      const panelData = {
        user_id: user.id,
        name: setupData.basic.name,
        welcome_message: setupData.basic.welcomeMessage,
        assistant_prompt: `You are a helpful assistant for ${setupData.basic.familyMember || 'the family'}. You should be empathetic, patient, and supportive.`,
        voice_type: 'sarah'
      };

      let currentPanelId = panelId;

      if (panelId) {
        const { error: updateError } = await supabase
          .from('panels')
          .update(panelData)
          .eq('id', panelId);

        if (updateError) throw updateError;

        const deletePromises = [
          supabase.from('family_members').delete().eq('panel_id', panelId),
          supabase.from('drugs').delete().eq('panel_id', panelId),
          supabase.from('events').delete().eq('panel_id', panelId)
        ];

        await Promise.all(deletePromises);
      } else {
        const { data: newPanel, error: insertError } = await supabase
          .from('panels')
          .insert([panelData])
          .select()
          .single();

        if (insertError) throw insertError;
        if (!newPanel) throw new Error('No panel data returned');
        
        currentPanelId = newPanel.id;
      }

      if (setupData.familyMembers.length > 0) {
        const familyMembersToInsert = setupData.familyMembers.map(member => ({
          panel_id: currentPanelId,
          name: member.name,
          birth_date: member.birthDate,
          photo_url: member.photoUrl || null
        }));

        const { error: familyError } = await supabase
          .from('family_members')
          .insert(familyMembersToInsert);

        if (familyError) throw familyError;
      }

      if (setupData.drugs.length > 0) {
        const drugsToInsert = setupData.drugs.map(drug => ({
          panel_id: currentPanelId,
          name: drug.name,
          dosage: drug.dosage,
          frequency: drug.schedule.frequency,
          time: drug.schedule.time
        }));

        const { error: drugsError } = await supabase
          .from('drugs')
          .insert(drugsToInsert);

        if (drugsError) throw drugsError;
      }

      if (setupData.events.length > 0) {
        const eventsToInsert = setupData.events.map(event => ({
          panel_id: currentPanelId,
          title: event.title,
          date: event.date,
          description: event.description || ''
        }));

        const { error: eventsError } = await supabase
          .from('events')
          .insert(eventsToInsert);

        if (eventsError) throw eventsError;
      }

      toast.success(`Panel został pomyślnie ${panelId ? 'zaktualizowany' : 'utworzony'}!`);
      navigate('/family');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(`Nie udało się ${panelId ? 'zaktualizować' : 'utworzyć'} panelu. Błąd: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-primary flex items-center gap-2 hover:text-primary/80 hover:bg-primary/10"
                  onClick={handleExit}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All your changes will be lost and the new panel won't be created.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmExit}>Exit</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">
            {panelId ? 'Edit' : 'Setup'} Neighbour - Step {currentStep + 1} of {steps.length}
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
                {panelId ? 'Update' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
};

export default BotSettings;
