
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
import { Settings2, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TabConfig {
  id: string;
  label: string;
  content?: string;
}

const BotSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("podstawowe");
  const [tabs, setTabs] = useState<TabConfig[]>([
    { id: "rodzina", label: "Rodzina" },
    { id: "leki", label: "Leki" },
    { id: "wydarzenia", label: "Wydarzenia" }
  ]);
  const [newTabName, setNewTabName] = useState("");
  const [showAddTab, setShowAddTab] = useState(false);

  const handleAddTab = () => {
    if (newTabName.trim()) {
      const newTabId = newTabName.toLowerCase().replace(/\s+/g, '-');
      if (tabs.some(tab => tab.id === newTabId)) {
        toast.error("Zakładka o takiej nazwie już istnieje");
        return;
      }
      setTabs([...tabs, { id: newTabId, label: newTabName.trim() }]);
      setNewTabName("");
      setShowAddTab(false);
      toast.success("Dodano nową zakładkę");
    }
  };

  const handleDeleteTab = (tabId: string) => {
    setTabs(tabs.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      setActiveTab("podstawowe");
    }
    toast.success("Usunięto zakładkę");
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
              Powrót
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Settings2 className="w-8 h-8" />
            Ustawienia Asystenta
          </h1>
        </div>
        
        <Card className="p-6 shadow-lg border-primary/10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center gap-4 mb-4">
              <TabsList className="grid flex-1 grid-cols-4 gap-4 bg-secondary/20 p-1">
                <TabsTrigger value="podstawowe">Podstawowe</TabsTrigger>
                {tabs.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id} className="group relative">
                    {tab.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTab(tab.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAddTab(true)}
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {showAddTab && (
              <div className="flex items-center gap-2 mb-4">
                <Input
                  placeholder="Nazwa nowej zakładki"
                  value={newTabName}
                  onChange={(e) => setNewTabName(e.target.value)}
                />
                <Button onClick={handleAddTab}>Dodaj</Button>
                <Button variant="ghost" onClick={() => setShowAddTab(false)}>Anuluj</Button>
              </div>
            )}

            <TabsContent value="podstawowe" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">Nazwa asystenta</label>
                  <Input placeholder="Asystent Seniora" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">Wiadomość powitalna</label>
                  <Input placeholder="Cześć! Jak mogę ci dzisiaj pomóc?" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">Główny prompt asystenta</label>
                  <Textarea 
                    className="min-h-[200px]"
                    placeholder="Jesteś empatycznym i cierpliwym asystentem dla osób starszych. Twoim zadaniem jest:

1. Pomagać w codziennych czynnościach
2. Przypominać o lekach i wizytach lekarskich
3. Utrzymywać kontakt z rodziną
4. Odpowiadać na pytania dotyczące zdrowia
5. Oferować wsparcie emocjonalne
6. Pomagać w organizacji dnia

Zawsze mów prostym, zrozumiałym językiem. Unikaj skomplikowanych terminów.
Bądź cierpliwy i gotowy do powtórzenia informacji.
W sytuacjach nagłych lub niepokojących, sugeruj kontakt z rodziną lub odpowiednimi służbami."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">Głos asystenta</label>
                  <Select defaultValue="sarah">
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz głos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/family')}
                    className="hover:bg-primary/10"
                  >
                    Anuluj
                  </Button>
                  <Button 
                    onClick={() => {
                      toast.success("Zapisano zmiany");
                      navigate('/family');
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Zapisz zmiany
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {tabs.map(tab => (
              <TabsContent key={tab.id} value={tab.id}>
                <div className="min-h-[400px] space-y-4">
                  <div className="text-center text-muted-foreground">
                    Konfiguracja sekcji {tab.label.toLowerCase()}
                  </div>
                  {/* Tu będzie formularz konfiguracji dla danej zakładki */}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </main>
  );
};

export default BotSettings;
