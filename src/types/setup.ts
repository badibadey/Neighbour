
export interface FamilyMember {
  name: string;
  birthDate: string;
  photoUrl?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  };
}

export interface Event {
  title: string;
  date: string;
  description: string;
}

export interface SetupData {
  basic: {
    name: string;
    welcomeMessage: string;
  };
  familyMembers: FamilyMember[];
  drugs: Medication[];
  events: Event[];
}
