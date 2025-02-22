
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import FamilyPanel from "./pages/FamilyPanel";
import SeniorPanel from "./pages/SeniorPanel";
import NotFound from "./pages/NotFound";
import BotSettings from "./pages/BotSettings";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      console.log("Auth state changed:", event, !!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show nothing while we check the initial auth state
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Index />
            } />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Login />
            } />
            <Route path="/signup" element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Signup />
            } />
            <Route path="/home" element={
              !isAuthenticated ? <Navigate to="/login" replace /> : <Home />
            } />
            <Route path="/family" element={
              !isAuthenticated ? <Navigate to="/login" replace /> : <FamilyPanel />
            } />
            <Route path="/senior" element={
              !isAuthenticated ? <Navigate to="/login" replace /> : <SeniorPanel />
            } />
            <Route path="/bot-settings" element={
              !isAuthenticated ? <Navigate to="/login" replace /> : <BotSettings />
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
