import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Upload, Plus, Check, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AgentCreationModal } from "@/components/AgentCreationModal";
import type { SetupData, FamilyMember, Medication, Event } from '@/types/setup';

const createWelcomeMessage = (familyMember: string) => ([
  `Hi ${familyMember}! I'm here to help you with your daily tasks.`,
  `Welcome ${familyMember}! How can I assist you today?`,
  `Hello ${familyMember}! I'm your personal assistant.`,
  `Good day ${familyMember}! I'm here to make your day easier.`,
  `Welcome back ${familyMember}! What can I do for you today?`
]);

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
  { id: '4', name: 'Metformin', defaultDosage: '500mg' },
  { id: '5', name: 'Amlodipine', defaultDosage: '5mg' },
  { id: '6', name: 'Omeprazole', defaultDosage: '20mg' },
  { id: '7', name: 'Levothyroxine', defaultDosage: '50mcg' },
  { id: '8', name: 'Ramipril', defaultDosage: '5mg' },
  { id: '9', name: 'Atorvastatin', defaultDosage: '20mg' },
  { id: '10', name: 'Bisoprolol', defaultDosage: '5mg' },
  { id: '11', name: 'Simvastatin', defaultDosage: '20mg' },
  { id: '12', name: 'Gabapentin', defaultDosage: '300mg' },
  { id: '13', name: 'Sertraline', defaultDosage: '50mg' },
  { id: '14', name: 'Amoxicillin', defaultDosage: '500mg' }
];

const BotSettings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const panelId = searchParams.get('panel');
  const [currentStep, setCurrentStep] = useState(0);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [welcomeMessages, setWelcomeMessages] = useState<string[]>([]);

  const [setupData, setSetupData] = useState<SetupData>({
    basic: {
      name: 'My Neighbour',
      welcomeMessage: '',
      familyMember: ''
    },
    familyMembers: [],
    drugs: [],
    events: []
  });

  useEffect(() => {
    const messages = createWelcomeMessage(setupData.basic.familyMember || 'there');
    setWelcomeMessages(messages);
    if (!setupData.basic.welcomeMessage || !messages.includes(setupData.basic.welcomeMessage)) {
      setSetupData(prev => ({
        ...prev,
        basic: {
          ...prev.basic,
          welcomeMessage: messages[0]
        }
      }));
    }
  }, [setupData.basic.familyMember]);

  const [newFamilyMember, setNewFamilyMember] = useState<FamilyMember>({ 
    name: '', 
    birthDate: '', 
    photoUrl: '' 
  });

  const [newEvent, setNewEvent] = useState<Event>({ 
    title: '', 
    date: '', 
    description: '' 
  });

  useEffect(() => {
    if (panelId) {
      if (state?.panelData) {
        const panel = state.panelData;
        setSetupData(prevData => ({
          ...prevData,
          basic: {
            name: panel.name,
            welcomeMessage: panel.welcome_message,
            familyMember: panel.family_member
          }
        }));
      }
      fetchPanelData(panelId);
    }
  }, [panelId, state]);

  const fetchPanelData = async (id: string) => {
    try {
      console.log('Fetching panel data...');
      
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

      console.log('Fetched data:', { panel, familyMembers, drugs, events });

      setSetupData({
        basic: {
          name: panel.name,
          welcomeMessage: panel.welcome_message,
          familyMember: panel.family_member || ''
        },
        familyMembers: familyMembers ? familyMembers.map(member => ({
          name: member.name,
          birthDate: member.birth_date,
          photoUrl: member.photo_url || ''
        })) : [],
        drugs: drugs ? drugs.map(drug => ({
          id: drug.id,
          name: drug.name,
          dosage: drug.dosage,
          schedule: {
            frequency: drug.frequency || 'daily',
            time: drug.time || '09:00'
          }
        })) : [],
        events: events ? events.map(event => ({
          title: event.title,
          date: event.date,
          description: event.description || ''
        })) : []
      });
    } catch (error) {
      console.error('Error fetching panel data:', error);
      toast.error('Failed to load panel data');
    }
  };

  const validateDate = (date: string): boolean => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const currentDate = new Date();
    return selectedDate instanceof Date && !isNaN(selectedDate.getTime());
  };

  const handleAddFamilyMember = () => {
    if (!newFamilyMember.name.trim()) {
      toast.error("Please enter family member's name");
      return;
    }
    if (!newFamilyMember.birthDate) {
      toast.error("Please select birth date");
      return;
    }
    if (!validateDate(newFamilyMember.birthDate)) {
      toast.error("Please enter a valid birth date");
      return;
    }

    console.log('Adding family member:', newFamilyMember);
    setSetupData(prevData => {
      const updatedMembers = [...prevData.familyMembers, { ...newFamilyMember }];
      console.log('Updated family members:', updatedMembers);
      return {
        ...prevData,
        familyMembers: updatedMembers
      };
    });
    setNewFamilyMember({ name: '', birthDate: '', photoUrl: '' });
    toast.success("Family member added successfully!");
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast.error("Please enter event title");
      return;
    }
    if (!newEvent.date) {
      toast.error("Please select event date");
      return;
    }
    if (!validateDate(newEvent.date)) {
      toast.error("Please enter a valid event date");
      return;
    }

    console.log('Adding event:', newEvent);
    setSetupData(prevData => {
      const updatedEvents = [...prevData.events, { ...newEvent }];
      console.log('Updated events:', updatedEvents);
      return {
        ...prevData,
        events: updatedEvents
      };
    });
    setNewEvent({ title: '', date: '', description: '' });
    toast.success("Event added successfully!");
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

      setSetupData(prevData => {
        const updatedMembers = [...prevData.familyMembers];
        updatedMembers[memberIndex] = {
          ...updatedMembers[memberIndex],
          photoUrl: publicUrl
        };
        return {
          ...prevData,
          familyMembers: updatedMembers
        };
      });
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload photo');
    }
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

  const handleAddMedication = (medication: { id: string; name: string; defaultDosage: string }) => {
    setSetupData(prevData => ({
      ...prevData,
      drugs: [
        ...prevData.drugs,
        {
          id: medication.id,
          name: medication.name,
          dosage: medication.defaultDosage,
          schedule: {
            frequency: 'daily',
            time: '09:00'
          }
        }
      ]
    }));
    toast.success(`${medication.name} added successfully!`);
  };

  const saveToSupabase = async () => {
    try {
      setIsCreatingAgent(true);
      console.log('Starting to save data to Supabase...', setupData);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        navigate('/');
        return;
      }

      let agentId = null;
      try {
        console.log('Creating ElevenLabs agent...');
        const { data: agentData, error: agentError } = await supabase.functions.invoke('create-elevenlabs-agent', {
          body: {
            familyMember: setupData.basic.familyMember,
            welcomeMessage: setupData.basic.welcomeMessage,
            familyData: setupData.familyMembers,
            medicationData: setupData.drugs,
            eventData: setupData.events,
          },
        });

        if (agentError) {
          console.error('Error creating ElevenLabs agent:', agentError);
          toast.error('Warning: Voice assistant setup failed, but panel will be saved');
        } else {
          agentId = agentData.agent_id;
        }
      } catch (error) {
        console.error('Failed to create ElevenLabs agent:', error);
        toast.error('Warning: Voice assistant setup failed, but panel will be saved');
      }

      const panelData = {
        user_id: user.id,
        name: setupData.basic.name,
        welcome_message: setupData.basic.welcomeMessage,
        family_member: setupData.basic.familyMember || '',
        assistant_prompt: `You are a helpful assistant for ${setupData.basic.familyMember || 'the family'}. You should be empathetic, patient, and supportive.`,
        voice_type: 'sarah',
        agent_id: agentId
      };

      console.log('Panel data to save:', panelData);

      let currentPanelId = panelId;

      if (panelId) {
        const { error: updateError } = await supabase
          .from('panels')
          .update(panelData)
          .eq('id', panelId);

        if (updateError) throw updateError;

        await Promise.all([
          supabase.from('family_members').delete().eq('panel_id', panelId),
          supabase.from('drugs').delete().eq('panel_id', panelId),
          supabase.from('events').delete().eq('panel_id', panelId)
        ]);
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
        console.log('Saving family members:', setupData.familyMembers);
        const familyMembersToInsert = setupData.familyMembers.map(member => ({
          panel_id: currentPanelId,
          name: member.name,
          birth_date: new Date(member.birthDate).toISOString().split('T')[0],
          photo_url: member.photoUrl
        }));

        const { error: familyError } = await supabase
          .from('family_members')
          .insert(familyMembersToInsert);

        if (familyError) {
          console.error('Error saving family members:', familyError);
          throw familyError;
        }
      }

      if (setupData.events.length > 0) {
        console.log('Saving events:', setupData.events);
        const eventsToInsert = setupData.events.map(event => ({
          panel_id: currentPanelId,
          title: event.title,
          date: new Date(event.date).toISOString(),
          description: event.description || ''
        }));

        const { error: eventsError } = await supabase
          .from('events')
          .insert(eventsToInsert);

        if (eventsError) {
          console.error('Error saving events:', eventsError);
          throw eventsError;
        }
      }

      if (setupData.drugs.length > 0) {
        console.log('Saving drugs:', setupData.drugs);
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

        if (drugsError) {
          console.error('Error saving drugs:', drugsError);
          throw drugsError;
        }
      }

      console.log('All data saved successfully!');
      toast.success('Panel saved successfully!');
      navigate('/neighbours');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save panel');
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const handleExit = useCallback(() => {
    setIsExitDialogOpen(true);
  }, []);

  const confirmExit = useCallback(() => {
    navigate('/neighbours');
  }, [navigate]);

  const steps = [
    {
      title: 'Name & Greeting',
      subtitle: 'Personalize your virtual neighbour',
      description: 'Choose how your assistant will be called and how they will greet your family member.',
      component: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium block">
              Neighbour Name <span className="text-red-500">*</span>
            </label>
            <Input 
              value={setupData.basic.name}
              onChange={(e) => setSetupData({
                ...setupData,
                basic: { ...setupData.basic, name: e.target.value }
              })}
              placeholder="My Neighbour"
              required
            />
            <p className="text-sm text-muted-foreground">This will be your neighbour's name that they'll use to introduce themselves</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">
              Family Member <span className="text-red-500">*</span>
            </label>
            <Input 
              value={setupData.basic.familyMember}
              onChange={(e) => setSetupData({
                ...setupData,
                basic: { ...setupData.basic, familyMember: e.target.value }
              })}
              placeholder="Primary family member"
              required
            />
            <p className="text-sm text-muted-foreground">The person who will be primarily using the assistant</p>
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
                {welcomeMessages.map((message, index) => (
                  <SelectItem key={index} value={message}>
                    {message}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">This message will be displayed when the assistant starts</p>
          </div>
        </div>
      )
    },
    {
      title: 'Family Members',
      subtitle: 'Add people to remember',
      description: 'Add family members that your assistant should know about. This helps create a more personalized experience with important dates and relationships.',
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
                    <p className="text-sm text-muted-foreground">Born: {new Date(member.birthDate).toLocaleDateString()}</p>
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
              <Input
                placeholder="Name"
                value={newFamilyMember.name}
                onChange={(e) => setNewFamilyMember({
                  ...newFamilyMember,
                  name: e.target.value
                })}
                required
              />
              <Input
                type="date"
                value={newFamilyMember.birthDate}
                onChange={(e) => setNewFamilyMember({
                  ...newFamilyMember,
                  birthDate: e.target.value
                })}
                required
                max={new Date().toISOString().split('T')[0]}
              />
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
      subtitle: 'Set up medication reminders',
      description: 'Add medications and their schedules to help your family member stay on track with their health routine. The assistant will provide timely reminders.',
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
                      <SelectTrigger className="bg-white">
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
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command className="bg-white rounded-lg border shadow-md">
                    <CommandInput placeholder="Search medications..." className="bg-transparent" />
                    <CommandList className="bg-white">
                      <CommandEmpty>No medication found.</CommandEmpty>
                      <CommandGroup className="bg-white">
                        {MEDICATIONS_DATABASE.map((med) => (
                          <CommandItem
                            key={med.id}
                            value={med.name}
                            onSelect={() => {
                              handleAddMedication(med);
                              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                            }}
                            className="bg-white hover:bg-gray-100"
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
      title: 'Important Events',
      subtitle: 'Never miss important dates',
      description: 'Add birthdays, appointments, or any other important events. Your assistant will help remember and remind about upcoming events.',
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
                  Date: {new Date(event.date).toLocaleDateString()}
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
                  required
                />
                <Input
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    date: e.target.value
                  })}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
                <Input
                  placeholder="Event description (optional)"
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
    },
    {
      title: 'Review & Complete',
      subtitle: 'Almost there!',
      description: 'Review all the information you\'ve provided. Make sure everything is correct before finishing the setup.',
      component: (
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-medium text-lg mb-4">Basic Settings</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Neighbour Name:</span>
                <span className="font-medium">{setupData.basic.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Family Member:</span>
                <span className="font-medium">{setupData.basic.familyMember || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Welcome Message:</span>
                <span className="font-medium">{setupData.basic.welcomeMessage}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Family Members ({setupData.familyMembers.length})</h3>
              {setupData.familyMembers.length === 0 && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">No family members added</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {setupData.familyMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-4 py-2 border-b last:border-0">
                  {member.photoUrl ? (
                    <img 
                      src={member.photoUrl} 
                      alt={member.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-medium">{member.name[0]}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Born: {new Date(member.birthDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Events ({setupData.events.length})</h3>
              {setupData.events.length === 0 && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">No events added</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {setupData.events.map((event, index) => (
                <div key={index} className="py-2 border-b last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{event.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleString()}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-center p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-5 h-5" />
              <span>Configuration ready to save</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F97316] to-[#FEC6A1]/20">
      <AgentCreationModal 
        isOpen={isCreatingAgent} 
        familyMember={setupData.basic.familyMember} 
      />
      
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white flex items-center gap-2 hover:text-white/80 hover:bg-white/10"
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
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Crimson Text, serif' }}>
              neighbour
            </h1>
            <div className="w-[72px]"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm font-medium text-gray-900">
              {currentStep + 1}
            </span>
            <span className="text-sm text-white/90">of {steps.length}</span>
          </div>
          <p className="text-2xl font-medium text-white/90 mb-1">
            {steps[currentStep].title}
          </p>
          <p className="text-white/80 max-w-xl mx-auto">
            {steps[currentStep].description}
          </p>
        </div>
        
        <Card className="p-6 shadow-lg border-primary/10 max-w-2xl mx-auto bg-white/95">
          {steps[currentStep].component}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
              className="border-white/20 text-gray-700 hover:bg-gray-50"
            >
              Previous Step
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={() => {
                  if (currentStep === 0 && (!setupData.basic.name.trim() || !setupData.basic.familyMember.trim())) {
                    toast.error("Please fill in all required fields");
                    return;
                  }
                  setCurrentStep(currentStep + 1);
                }}
                className="bg-gradient-to-r from-[#F97316] to-[#FEC6A1] hover:opacity-90"
              >
                Next Step
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={saveToSupabase}
                className="bg-gradient-to-r from-[#F97316] to-[#FEC6A1] hover:opacity-90"
              >
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
