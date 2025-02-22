
-- Tworzenie tabeli panels (jeśli nie istnieje)
CREATE TABLE IF NOT EXISTS panels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  welcome_message TEXT NOT NULL,
  assistant_prompt TEXT,
  voice_type TEXT DEFAULT 'sarah',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tworzenie tabeli family_members (jeśli nie istnieje)
CREATE TABLE IF NOT EXISTS family_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  panel_id UUID REFERENCES panels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tworzenie tabeli drugs (jeśli nie istnieje)
CREATE TABLE IF NOT EXISTS drugs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  panel_id UUID REFERENCES panels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tworzenie tabeli events (jeśli nie istnieje)
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  panel_id UUID REFERENCES panels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Dodanie Row Level Security (RLS)
ALTER TABLE panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Polityki bezpieczeństwa dla panels
CREATE POLICY "Users can view their own panels" ON panels
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own panels" ON panels
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own panels" ON panels
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own panels" ON panels
  FOR DELETE USING (auth.uid() = user_id);

-- Polityki dla family_members (poprzez panel_id)
CREATE POLICY "Users can view family members of their panels" ON family_members
  FOR SELECT USING (EXISTS (SELECT 1 FROM panels WHERE panels.id = family_members.panel_id AND panels.user_id = auth.uid()));
  
CREATE POLICY "Users can insert family members to their panels" ON family_members
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM panels WHERE panels.id = panel_id AND panels.user_id = auth.uid()));
  
CREATE POLICY "Users can update family members of their panels" ON family_members
  FOR UPDATE USING (EXISTS (SELECT 1 FROM panels WHERE panels.id = family_members.panel_id AND panels.user_id = auth.uid()));
  
CREATE POLICY "Users can delete family members of their panels" ON family_members
  FOR DELETE USING (EXISTS (SELECT 1 FROM panels WHERE panels.id = family_members.panel_id AND panels.user_id = auth.uid()));

-- Polityki dla drugs (poprzez panel_id)
CREATE POLICY "Users can view drugs of their panels" ON drugs
  FOR SELECT USING (EXISTS (SELECT 1 FROM panels WHERE panels.id = drugs.panel_id AND panels.user_id = auth.uid()));
  
CREATE POLICY "Users can insert drugs to their panels" ON drugs
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM panels WHERE panels.id = panel_id AND panels.user_id = auth.uid()));
  
CREATE POLICY "Users can update drugs of their panels" ON drugs
  FOR UPDATE USING (EXISTS (SELECT 1 FROM panels WHERE panels.id = drugs.panel_id AND panels.user_id = auth.uid()));
  
CREATE POLICY "Users can delete drugs of their panels" ON drugs
  FOR DELETE USING (EXISTS (SELECT 1 FROM panels WHERE panels.id = drugs.panel_id AND panels.user_id = auth.uid()));

-- Polityki dla events (poprzez panel_id)
CREATE POLICY "Users can view events of their panels" ON events
  FOR SELECT USING (EXISTS (SELECT 1 FROM panels WHERE panels.id = events.panel_id AND panels.user_id = auth.uid()));
  
CREATE POLICY "Users can insert events to their panels" ON events
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM panels WHERE panels.id = panel_id AND panels.user_id = auth.uid()));
  
CREATE POLICY "Users can update events of their panels" ON events
  FOR UPDATE USING (EXISTS (SELECT 1 FROM panels WHERE panels.id = events.panel_id AND panels.user_id = auth.uid()));
  
CREATE POLICY "Users can delete events of their panels" ON events
  FOR DELETE USING (EXISTS (SELECT 1 FROM panels WHERE panels.id = events.panel_id AND panels.user_id = auth.uid()));
