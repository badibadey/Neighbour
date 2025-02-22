
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Users, Pill } from "lucide-react";

interface Event {
  title: string;
  date: string;
  description?: string;
}

interface Drug {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
}

interface FamilyMember {
  name: string;
  birth_date: string;
}

interface PanelData {
  name: string;
  welcome_message: string;
  family_member: string;
  events: Event[];
  drugs: Drug[];
  family_members: FamilyMember[];
}

interface PanelSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panelData: PanelData | null;
}

const PanelSummaryDialog = ({ open, onOpenChange, panelData }: PanelSummaryDialogProps) => {
  if (!panelData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Panel Summary: {panelData.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Panel Name:</span> {panelData.name}</p>
                <p><span className="font-medium">Family Member:</span> {panelData.family_member}</p>
                <p><span className="font-medium">Welcome Message:</span> {panelData.welcome_message}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Family Members
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {panelData.family_members.map((member, index) => (
                  <div key={index} className="border p-3 rounded-lg">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Birth Date: {new Date(member.birth_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Events
              </h3>
              <div className="space-y-3">
                {panelData.events.map((event, index) => (
                  <div key={index} className="border p-3 rounded-lg">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </p>
                    {event.description && (
                      <p className="text-sm mt-1">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Medications
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {panelData.drugs.map((drug, index) => (
                  <div key={index} className="border p-3 rounded-lg">
                    <p className="font-medium">{drug.name}</p>
                    <p className="text-sm">Dosage: {drug.dosage}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4" />
                      {drug.time} - {drug.frequency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PanelSummaryDialog;
