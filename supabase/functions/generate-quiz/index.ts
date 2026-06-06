import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function extractJson(content: string) {
  const cleaned = content
    .replace(/```(?:json)?/g, "")
    .replace(/^json\s*/i, "")
    .trim();
  return JSON.parse(cleaned);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENROUTER_API_KEY secret" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const topic = String(body.topic || "General Knowledge");
    const category = String(body.category || "General Knowledge");
    const difficulty = String(body.difficulty || "Medium");
    const count = Math.min(Math.max(Number(body.count || 5), 1), 20);
    const model = Deno.env.get("OPENROUTER_MODEL") || "meta-llama/llama-3.3-70b-instruct:free";

    const systemPrompt = `You are an expert exam quiz writer. Generate exactly ${count} ${difficulty} questions for category "${category}" and topic "${topic}". Return JSON only. The JSON must be an array. Each object must include: type ('mcq', 'tf', or 'fill'), question, options, correctAnswer, marks, negativeMarks, explanation. For mcq, options must contain exactly 4 strings. For tf, options must be ['True','False']. For fill, options must be []. Use clear, student-friendly explanations.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": req.headers.get("origin") || "https://quizverse.local",
        "X-Title": "QuizVerse AI",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Return the JSON array now. Do not include markdown." },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return new Response(JSON.stringify({ error: `OpenRouter failed: ${detail}` }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;
    const parsed = extractJson(content || "[]");
    const questions = Array.isArray(parsed) ? parsed : parsed.questions || [];

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});