
import React from 'react';
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
import { Settings2, Calendar, LineChart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BotSettings = () => {
  const navigate = useNavigate();

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
        <div className="mb-8 flex justify-center">
          <Tabs defaultValue="bot" className="w-full max-w-xl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bot" className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Bot Builder
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Harmonogram
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center gap-2">
                <LineChart className="w-4 h-4" />
                Monitoring
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">
          Konfiguracja Asystenta
        </h1>
        
        <Card className="p-6 shadow-lg border-primary/10">
          <Tabs defaultValue="podstawowe" className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-4 bg-secondary/20 p-1">
              <TabsTrigger value="podstawowe">Podstawowe</TabsTrigger>
              <TabsTrigger value="rodzina">Rodzina</TabsTrigger>
              <TabsTrigger value="leki">Leki</TabsTrigger>
              <TabsTrigger value="wydarzenia">Wydarzenia</TabsTrigger>
            </TabsList>

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
                      navigate('/family');
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Zapisz zmiany
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rodzina">
              <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                Ustawienia rodziny pojawią się wkrótce...
              </div>
            </TabsContent>
            
            <TabsContent value="leki">
              <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                Ustawienia leków pojawią się wkrótce...
              </div>
            </TabsContent>
            
            <TabsContent value="wydarzenia">
              <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                Ustawienia wydarzeń pojawią się wkrótce...
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
};

export default BotSettings;
