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
    const { topic, language } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langInstruction = {
      hindi: "Respond entirely in Hindi (Devanagari script). Use simple language for school students.",
      hinglish: "Respond in Hinglish (Hindi in Roman script mixed with English). Keep it casual and student-friendly.",
      english: "Respond in simple English suitable for school students.",
    }[language] || "Respond in simple English suitable for school students.";

    const systemPrompt = `You are an expert teacher for Indian school students (classes 5-10). ${langInstruction}

Teach the topic "${topic}" in a comprehensive yet easy-to-understand way.

Your response MUST be valid JSON with this exact structure:
{
  "definition": "A clear 3-4 sentence definition/explanation of the topic with real-life context",
  "steps": ["Step 1 to learn this", "Step 2", "Step 3", "Step 4"],
  "mistakes": ["Common mistake 1", "Common mistake 2", "Common mistake 3"],
  "practice": [
    {"q": "A thought-provoking question about the topic", "a": "A clear, concise answer"},
    {"q": "Another question", "a": "Another answer"},
    {"q": "Third question", "a": "Third answer"}
  ]
}

Rules:
- Definition should use real-life Indian examples (cricket, chai, bazaar, etc.)
- Steps should be actionable learning steps
- Mistakes should be specific to this topic, not generic
- Practice questions should test understanding, not memorization
- Use emojis sparingly for friendliness
- ONLY return valid JSON, no markdown, no extra text`;

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
            { role: "user", content: `Teach me about: ${topic}` },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1].trim());
    } catch {
      parsed = {
        definition: content,
        steps: ["Read the explanation above"],
        mistakes: ["Don't skip practicing"],
        practice: [{ q: "What did you learn?", a: "Review the explanation above!" }],
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("learn-topic error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
