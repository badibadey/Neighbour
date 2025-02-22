
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { familyMember, welcomeMessage, familyData, medicationData, eventData } = await req.json()

    const prompt = `You are an empathetic and patient voice assistant designed specifically for ${familyMember || 'the user'}. Your role is to support and guide the user through their daily routine while providing a caring presence. Your responsibilities include:

• Daily Assistance:
• Helping with everyday tasks and day organization.

• Family Reminders:
${familyData.map((member: any) => `• Remember ${member.name}'s birthday on ${new Date(member.birthDate).toLocaleDateString()}`).join('\n')}

• Health and Appointment Reminders:
${medicationData.map((med: any) => `• Remind about ${med.name} (${med.dosage}) ${med.schedule.frequency} at ${med.schedule.time}`).join('\n')}

• Events and Appointments:
${eventData.map((event: any) => `• ${event.title} on ${new Date(event.date).toLocaleString()}`).join('\n')}

• Health Guidance:
• Answering general questions about health in a clear and accessible manner.

• Emotional Support:
• Offering compassionate support and encouragement throughout the day.

Always communicate using simple, clear, and straightforward language. Avoid technical jargon and complicated terms to ensure the user understands every instruction. Remain patient, and if the user needs information repeated, provide it without hesitation.

When greeting the user, use this message: "${welcomeMessage}"

In any urgent or concerning situation, promptly suggest that the user contact a family member or the appropriate emergency services.`

    console.log('ElevenLabs API Key:', Deno.env.get('ELEVENLABS_API_KEY') ? 'Present' : 'Missing');
    
    // First create a project
    const projectResponse = await fetch('https://api.elevenlabs.io/v1/projects', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '',
      },
      body: JSON.stringify({
        name: `Assistant for ${familyMember || 'Family'}`,
        description: `Personal assistant configured for ${familyMember || 'the family'}`,
        default_character_id: "EXAVITQu4vr4xnSDxMaL", // Sarah voice
        from_url: null,
        from_document: null,
        model_id: "eleven_multilingual_v2",
      }),
    });

    console.log('Project Response Status:', projectResponse.status);
    const projectData = await projectResponse.text();
    console.log('Project Response Body:', projectData);

    if (!projectResponse.ok) {
      let errorDetail;
      try {
        errorDetail = JSON.parse(projectData).detail;
      } catch {
        errorDetail = projectData;
      }
      throw new Error(`ElevenLabs API error: ${projectResponse.status} - ${errorDetail}`);
    }

    const project = JSON.parse(projectData);
    
    // Now add the character to the project
    const characterResponse = await fetch(`https://api.elevenlabs.io/v1/projects/${project.project_id}/chapters`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '',
      },
      body: JSON.stringify({
        name: "Assistant Configuration",
        character_id: "EXAVITQu4vr4xnSDxMaL", // Sarah voice
        content: prompt
      }),
    });

    console.log('Character Response Status:', characterResponse.status);
    const characterData = await characterResponse.text();
    console.log('Character Response Body:', characterData);

    if (!characterResponse.ok) {
      let errorDetail;
      try {
        errorDetail = JSON.parse(characterData).detail;
      } catch {
        errorDetail = characterData;
      }
      throw new Error(`ElevenLabs API error: ${characterResponse.status} - ${errorDetail}`);
    }

    return new Response(
      JSON.stringify({ agent_id: project.project_id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: 'ElevenLabsError'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
