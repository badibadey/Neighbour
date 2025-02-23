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
    console.log('Received request data:', {
      familyMember,
      welcomeMessage,
      familyDataCount: familyData?.length,
      medicationDataCount: medicationData?.length,
      eventDataCount: eventData?.length
    });

    if (!welcomeMessage) {
      throw new Error('Welcome message is required');
    }

    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not set');
    }

    // Fetch available tools
    console.log('Fetching available tools...');
    const toolsResponse = await fetch('https://api.elevenlabs.io/v1/convai/tools', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
    });

    if (!toolsResponse.ok) {
      const errorText = await toolsResponse.text();
      console.error('Tools fetch error:', errorText);
      throw new Error(`Failed to fetch tools: ${toolsResponse.status}`);
    }

    const toolsData = await toolsResponse.json();
    console.log('Available tools (full response):', JSON.stringify(toolsData, null, 2));

    // Make sure we're using the exact IDs from the response
    const toolIds = toolsData.tools ? toolsData.tools.map((tool: any) => tool.id) : [];
    console.log('Exact Tool IDs being used:', JSON.stringify(toolIds, null, 2));
    console.log('Raw tools response:', await toolsResponse.text());

    const prompt = `You are an empathetic and patient voice assistant designed specifically for ${familyMember || 'the user'}. Your role is to support and guide the user through their daily routine with dynamic, personalized information, while always maintaining a caring and supportive tone.

Greeting:
When greeting the user, use this message: "${welcomeMessage}"

Dynamic Data:

Family Members:
You have access to current data about family members:
${familyData.map((member: any) => `- ${member.name} (birthday: ${new Date(member.birthDate).toLocaleDateString()})`).join('\n')}
Use this information to remind the user about birthdays or any special occasions involving family members.

Medications:
You also have access to the latest medication schedules:
${medicationData.map((med: any) => `- ${med.name} (${med.dosage}) ${med.schedule.frequency} at ${med.schedule.time}`).join('\n')}
Utilize this data to alert the user about their medication intake and doctor appointments.

Important Events:
You are updated with key upcoming events:
${eventData.map((event: any) => `- ${event.title} on ${new Date(event.date).toLocaleString()}`).join('\n')}
Notify the user about these events when necessary.

Responsibilities:
- Assist with daily tasks and help organize the day.
- Answer health-related questions in a clear, simple manner.
- Offer compassionate emotional support, and be ready to repeat or clarify information as needed.
- In any emergency or when the user expresses distress, immediately suggest contacting a family member or the appropriate emergency services.

Always use the dynamic data provided to tailor your responses accurately and ensure the user feels supported and well-informed.`

    console.log('Generated prompt:', prompt);

    const payload = {
      conversation_config: {
        agent: {
          prompt: {
            llm: "gpt-3.5-turbo",
            prompt: prompt
          },
          first_message: welcomeMessage,
          tool_ids: toolIds
        },
        language: "pl"
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

    console.log('Sending payload to ElevenLabs...');

    const agentResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents/create?use_tool_ids=true', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
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
    console.log('Successfully created agent:', agent);

    return new Response(
      JSON.stringify({ 
        agent_id: agent.agent_id,
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
