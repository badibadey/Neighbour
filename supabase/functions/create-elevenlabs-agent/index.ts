
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

    console.log('Starting ElevenLabs API call...');
    console.log('API Key present:', !!Deno.env.get('ELEVENLABS_API_KEY'));

    try {
      // First, let's test the API connection by getting voices
      const testResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '',
        },
      });

      console.log('Test API call status:', testResponse.status);
      const testData = await testResponse.text();
      console.log('Test API response:', testData);

      if (!testResponse.ok) {
        throw new Error(`API test failed: ${testResponse.status} - ${testData}`);
      }
    } catch (error) {
      console.error('Test API call failed:', error);
      throw error;
    }

    // Now create an assistant using the voice generation endpoint
    const voiceResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '',
      },
      body: JSON.stringify({
        text: welcomeMessage,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        }
      }),
    });

    console.log('Voice generation status:', voiceResponse.status);
    
    if (!voiceResponse.ok) {
      const errorText = await voiceResponse.text();
      console.error('Voice generation error:', errorText);
      throw new Error(`Voice generation failed: ${voiceResponse.status} - ${errorText}`);
    }

    // If we got here, it means we can generate voice, so let's return success
    return new Response(
      JSON.stringify({ 
        agent_id: `assistant_${Date.now()}`,
        voice_id: "EXAVITQu4vr4xnSDxMaL"
      }),
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
