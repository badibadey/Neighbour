
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

    const response = await fetch('https://api.elevenlabs.io/v1/assistants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '',
      },
      body: JSON.stringify({
        name: `Assistant for ${familyMember || 'Family'}`,
        description: `Personal assistant configured for ${familyMember || 'the family'}`,
        prompt,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to create ElevenLabs agent')
    }

    const data = await response.json()
    
    return new Response(
      JSON.stringify({ agent_id: data.assistant_id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
