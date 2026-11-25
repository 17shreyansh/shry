import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { BlueprintSchema, localBlueprint, type Blueprint } from "@/lib/blueprint";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/blueprint  { idea: string }
 * Turns a visitor's project idea into a structured project blueprint.
 * Uses Claude when ANTHROPIC_API_KEY is set; otherwise (or on any failure) a local planner.
 */

// Public endpoint that can spend API credit: 6 blueprints per IP per 10 minutes.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

const SYSTEM = `You are the solutions architect at SHRY, a software studio in India that builds websites, web apps, mobile apps, SaaS products and AI automation for growing businesses.
A visitor describes a project idea. Produce a realistic, concise project blueprint for it.
- Write in plain English for a business owner, not an engineer. No marketing fluff.
- Durations must be honest for a small senior team; never promise unrealistic speed.
- Suggest AI only where it genuinely helps; leave the list empty otherwise.
- Do not quote prices.
- If the idea is not a software project, or asks for anything unlawful or harmful, return a blueprint for a simple business website and use the questions to ask what they actually need.`;

let client: Anthropic | null = null;

async function aiBlueprint(idea: string): Promise<Blueprint | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic({ timeout: 45_000, maxRetries: 1 });
  const response = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 8000,
    // Speed matters on a website: low effort keeps the response quick for this simple planning task.
    output_config: { effort: "low", format: betaZodOutputFormat(BlueprintSchema) },
    // Server-side fallback: if the request is declined by a safety classifier, retry on a suitable model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM,
    messages: [{ role: "user", content: `Project idea:\n${idea}` }],
  });
  if (response.stop_reason === "refusal") return null;
  return response.parsed_output ?? null;
}

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  const idea = typeof (body as { idea?: unknown })?.idea === "string" ? (body as { idea: string }).idea.trim().slice(0, 800) : "";
  if (idea.length < 8) return NextResponse.json({ error: "too_short", message: "Tell us a little more about the idea." }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited", message: "You've made a few blueprints already. Try again in a few minutes, or just send us the idea." }, { status: 429 });

  try {
    const ai = await aiBlueprint(idea);
    if (ai) return NextResponse.json({ blueprint: ai, source: "ai" });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) console.warn("[blueprint] AI rate limited, using local planner");
    else if (err instanceof Anthropic.APIError) console.error("[blueprint] AI error", err.status, err.message);
    else console.error("[blueprint] unexpected error", err);
  }
  return NextResponse.json({ blueprint: localBlueprint(idea), source: "local" });
}
