
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
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
  // ... więcej leków
];

const BotSettings = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>({
    basic: {
      name: 'My Neighbour',
      welcomeMessage: WELCOME_MESSAGES[0]
    },
    familyMembers: [],
    drugs: [],
    events: []
  });

  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleExit = () => {
    setIsExitDialogOpen(true);
  };

  const confirmExit = () => {
    navigate('/family');
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setSetupData({
                        ...setupData,
                        familyMembers: [
                          ...setupData.familyMembers,
                          { name: e.currentTarget.value, birthDate: '', photoUrl: '' }
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
                  Dosage: {drug.dosage}
                  <br />
                  Schedule: {drug.schedule.frequency} at {drug.schedule.time}
                </p>
              </div>
            </Card>
          ))}
          
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Add New Medication</h3>
              <div className="grid gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Select Medication</Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                      <CommandInput placeholder="Search medications..." />
                      <CommandEmpty>No medication found.</CommandEmpty>
                      <CommandGroup>
                        {MEDICATIONS_DATABASE.map((med) => (
                          <CommandItem
                            key={med.id}
                            onSelect={() => {
                              setSetupData({
                                ...setupData,
                                drugs: [
                                  ...setupData.drugs,
                                  {
                                    id: med.id,
                                    name: med.name,
                                    dosage: med.defaultDosage,
                                    schedule: { frequency: 'daily', time: '08:00' }
                                  }
                                ]
                              });
                            }}
                          >
                            {med.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {setupData.drugs.length > 0 && (
                  <>
                    <Select 
                      value={setupData.drugs[setupData.drugs.length - 1].schedule.frequency}
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly') => {
                        const newDrugs = [...setupData.drugs];
                        newDrugs[newDrugs.length - 1].schedule.frequency = value;
                        setSetupData({ ...setupData, drugs: newDrugs });
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

                    <Input
                      type="time"
                      onChange={(e) => {
                        const newDrugs = [...setupData.drugs];
                        newDrugs[newDrugs.length - 1].schedule.time = e.target.value;
                        setSetupData({ ...setupData, drugs: newDrugs });
                      }}
                    />
                  </>
                )}
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
                <Input
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
          welcome_message: setupData.basic.welcomeMessage
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
              birth_date: member.birthDate,
              photo_url: member.photoUrl
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
