
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Bot } from "lucide-react";

interface AgentCreationModalProps {
  isOpen: boolean;
  familyMember: string;
}

export const AgentCreationModal = ({ isOpen, familyMember }: AgentCreationModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" hideClose>
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="relative">
            <Bot className="w-12 h-12 text-primary animate-pulse" />
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Creating Your Neighbour</h2>
          <p className="text-center text-muted-foreground">
            Setting up a personal assistant for {familyMember || 'your family member'}. 
            This may take a moment...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
