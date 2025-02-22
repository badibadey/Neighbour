
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, CalendarDays, Pill, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BotSettings = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-primary flex items-center gap-2"
              onClick={() => navigate('/family')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Konfiguracja Asystenta</h1>
        
        <Card className="p-6">
          <Tabs defaultValue="podstawowe" className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-4 bg-muted/20 p-1">
              <TabsTrigger value="podstawowe" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Podstawowe
              </TabsTrigger>
              <TabsTrigger value="rodzina" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Rodzina
              </TabsTrigger>
              <TabsTrigger value="leki" className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Leki
              </TabsTrigger>
              <TabsTrigger value="wydarzenia" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Wydarzenia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="podstawowe" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nazwa asystenta</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 rounded-md border"
                    value="Asystent Seniora"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Wiadomość powitalna</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 rounded-md border"
                    value="Cześć! Jak mogę ci dzisiaj pomóc?"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Główny prompt asystenta</label>
                  <textarea
                    className="w-full mt-1 p-2 rounded-md border min-h-[200px]"
                    defaultValue={`Jesteś empatycznym i cierpliwym asystentem dla osób starszych. Twoim zadaniem jest:

1. Pomagać w codziennych czynnościach
2. Przypominać o lekach i wizytach lekarskich
3. Utrzymywać kontakt z rodziną
4. Odpowiadać na pytania dotyczące zdrowia
5. Oferować wsparcie emocjonalne
6. Pomagać w organizacji dnia

Zawsze mów prostym, zrozumiałym językiem. Unikaj skomplikowanych terminów.
Bądź cierpliwy i gotowy do powtórzenia informacji.
W sytuacjach nagłych lub niepokojących, sugeruj kontakt z rodziną lub odpowiednimi służbami.`}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rodzina">
              <div className="p-4 text-center text-muted-foreground">
                Ustawienia rodziny
              </div>
            </TabsContent>
            
            <TabsContent value="leki">
              <div className="p-4 text-center text-muted-foreground">
                Ustawienia leków
              </div>
            </TabsContent>
            
            <TabsContent value="wydarzenia">
              <div className="p-4 text-center text-muted-foreground">
                Ustawienia wydarzeń
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
};

export default BotSettings;
