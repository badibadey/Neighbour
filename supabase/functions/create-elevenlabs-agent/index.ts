
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
    console.log('Request data:', { familyMember, welcomeMessage });

    const prompt = `You are an empathetic and patient voice assistant designed specifically for ${familyMember || 'the user'}. Your role is to support and guide the user through their daily routine while providing a caring presence.

When greeting the user, use this message: "${welcomeMessage}"

You know about these family members:
${familyData.map((member: any) => `- ${member.name} (birthday: ${new Date(member.birthDate).toLocaleDateString()})`).join('\n')}

Medications to remember:
${medicationData.map((med: any) => `- ${med.name} (${med.dosage}) ${med.schedule.frequency} at ${med.schedule.time}`).join('\n')}

Important events:
${eventData.map((event: any) => `- ${event.title} on ${new Date(event.date).toLocaleString()}`).join('\n')}

Always be supportive and patient. If there's any emergency, suggest contacting family or emergency services.`

    console.log('Creating agent with prompt:', prompt);

    const payload = {
      conversation_config: {
        agent: {
          prompt: {
            llm: "gpt-4o",
            prompt: prompt
          },
          first_message: welcomeMessage,
          language: "pl"
        }
      },
      platform_settings: {
        widget: {
          variant: "expandable",
          bg_color: "#F97316",
          text_color: "#ffffff",
          btn_text_color: "#ffffff",
          start_call_text: "Start conversation",
          action_text: "Chat with neighbour",
          end_call_text: "End conversation",
          speaking_text: "I'm listening...",
          listening_text: "Speaking...",
          language_selector: true,
          custom_avatar_path: "https://media.istockphoto.com/id/1180453857/photo/blur-orange-texture-background.jpg?s=612x612&w=0&k=20&c=bpaBJRK2hep0m7JTCCs29MIHeo4jOFDgp9QH30cnRDk=",
          avatar: {
            type: "orb",
            color_1: "#F97316",
            color_2: "#FEC6A1"
          }
        }
      },
      name: `Assistant for ${familyMember || 'Family'}`,
      description: `Personal assistant configured for ${familyMember || 'the family'}`
    };

    console.log('Sending payload to ElevenLabs:', JSON.stringify(payload, null, 2));

    const agentResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '',
      },
      body: JSON.stringify(payload),
    });

    console.log('Agent creation status:', agentResponse.status);
    const responseText = await agentResponse.text();
    console.log('Agent creation raw response:', responseText);

    if (!agentResponse.ok) {
      throw new Error(`Failed to create agent: ${agentResponse.status} - ${responseText}`);
    }

    const agent = JSON.parse(responseText);
    console.log('Parsed agent response:', agent);

    return new Response(
      JSON.stringify({ 
        agent_id: agent.agent_id || 'test_agent',
        status: 'success'
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
