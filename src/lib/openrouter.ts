import { supabase } from "./supabase";
import type { Question } from "../types";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4o";

function normalizeQuestions(rawQuestions: any[]): Question[] {
  return rawQuestions.map((question, index) => {
    const type = ["mcq", "tf", "fill"].includes(question.type) ? question.type : "mcq";
    const options = Array.isArray(question.options)
      ? question.options.map((option: unknown) => String(option))
      : type === "tf"
        ? ["True", "False"]
        : [];

    return {
      id: question.id || `ai-q-${Date.now()}-${index}`,
      type,
      question: String(question.question || `Generated question ${index + 1}`),
      options,
      correctAnswer: String(question.correctAnswer || options[0] || ""),
      marks: Number(question.marks || 5),
      negativeMarks: Number(question.negativeMarks ?? 1),
      explanation: question.explanation ? String(question.explanation) : undefined,
    };
  });
}

export async function generateOpenRouterQuestions(params: {
  topic: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
}): Promise<Question[]> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke("generate-quiz", {
      body: params,
    });

    if (!error && Array.isArray(data?.questions)) {
      return normalizeQuestions(data.questions);
    }

    if (!OPENROUTER_API_KEY) {
      throw new Error(
        error?.message ||
          "Supabase Edge Function failed. Set OPENROUTER_API_KEY as a Supabase secret or add VITE_OPENROUTER_API_KEY locally."
      );
    }
  }

  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing VITE_OPENROUTER_API_KEY");
  }

  const systemPrompt = `You are an expert quiz question writer. Create quiz questions in JSON array format only. Each item must have fields: type ('mcq'|'tf'|'fill'), question, options (array for mcq/tf, empty for fill), correctAnswer, marks (number), negativeMarks (number), explanation. For fill, options must be []. Topic: ${params.topic}. Category: ${params.category}. Difficulty: ${params.difficulty}. Count: ${params.count}.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
      "X-Title": "QuizVerse AI",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Return JSON only, no markdown." },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter error: ${response.status} ${text}`);
  }

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content as string;
  if (!content) throw new Error("Empty AI response");

  const cleaned = content
    .replace(/```(?:json)?/g, "")
    .replace(/^json\s*/i, "")
    .trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Invalid JSON from AI");
  }

  const rawQuestions = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.questions)
      ? parsed.questions
      : [];

  return normalizeQuestions(rawQuestions);
}
