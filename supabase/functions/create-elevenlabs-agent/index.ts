
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

    console.log('Starting ElevenLabs agent creation...');
    console.log('API Key present:', !!Deno.env.get('ELEVENLABS_API_KEY'));

    // Create the agent using the convai API
    const agentResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '',
      },
      body: JSON.stringify({
        name: `Assistant for ${familyMember || 'Family'}`,
        description: `Personal assistant configured for ${familyMember || 'the family'}`,
        system_prompt: prompt,
        conversation_config: {
          model: {
            provider: "openai",
            model_id: "gpt-4",
            temperature: 0.7,
            max_tokens: 200
          },
          voice: {
            voice_id: "EXAVITQu4vr4xnSDxMaL", // Sarah voice
            settings: {
              stability: 0.5,
              similarity_boost: 0.5,
              style: 0.0,
              use_speaker_boost: true
            }
          }
        }
      }),
    });

    console.log('Agent creation status:', agentResponse.status);
    const responseData = await agentResponse.text();
    console.log('Agent creation response:', responseData);

    if (!agentResponse.ok) {
      throw new Error(`Failed to create agent: ${agentResponse.status} - ${responseData}`);
    }

    const agent = JSON.parse(responseData);

    return new Response(
      JSON.stringify({ 
        agent_id: agent.agent_id,
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
