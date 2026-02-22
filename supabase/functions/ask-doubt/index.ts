import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, language, imageDescription } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langInstruction = {
      hindi: "Answer entirely in Hindi (Devanagari script). Use simple language suitable for school students.",
      hinglish: "Answer in Hinglish (Hindi written in English/Roman script mixed with English). Keep it casual and student-friendly.",
      english: "Answer in simple English suitable for school students.",
    }[language] || "Answer in simple English suitable for school students.";

    const systemPrompt = `You are a friendly, encouraging AI tutor for Indian school students (classes 5-10). ${langInstruction}

Your response MUST be valid JSON with this exact structure:
{
  "explanation": "A clear 2-3 sentence explanation of the concept",
  "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "example": "A fun real-life example with an emoji",
  "tip": "A helpful tip starting with 💡"
}

Rules:
- Keep explanations very simple, use real-life analogies
- Steps should be clear and numbered (provide 3-5 steps)
- Examples should use emojis and be relatable to Indian students
- Tips should be memorable and practical
- ONLY return valid JSON, no markdown, no extra text`;

    const userMessage = imageDescription
      ? `The student uploaded an image described as: "${imageDescription}". Their question: ${question || "Please explain this."}`
      : question;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse JSON from the AI response
    let parsed;
    try {
      // Try to extract JSON from possible markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1].trim());
    } catch {
      // Fallback structure if parsing fails
      parsed = {
        explanation: content,
        steps: ["Read the explanation above carefully"],
        example: "🌟 Try to relate this to your daily life!",
        tip: "💡 Ask again if you need more clarity!",
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ask-doubt error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
