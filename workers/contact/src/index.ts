import { DurableObject } from "cloudflare:workers";

interface Env extends ContactWorkerBindings {
  MAILJET_API_KEY: string;
  MAILJET_SECRET_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  RATE_LIMIT_SECRET: string;
}

const INBOX = "contact@appsolves.dev";
const MAX_BYTES = 16_384;
const PROVIDER_TIMEOUT_MS = 8_000;
const REQUEST_TIMEOUT_MS = 10_000;
const HOUR_MS = 3_600_000;
const DAY_MS = HOUR_MS * 24;
// Count attempts, including ambiguous timeouts. Never refund or retry a send.
const GLOBAL_HOURLY_LIMIT = 20;
const GLOBAL_DAILY_LIMIT = 100;
const CLIENT_HOURLY_LIMIT = 3;
const CLIENT_DAILY_LIMIT = 10;

type Counter = { hour: number; hourly: number; daily: number };
type Budget = Counter & { day: number; clients: Record<string, Counter> };

export class ContactBudget extends DurableObject<Env> {
  async reserve(client: string): Promise<boolean> {
    if (!/^[a-f0-9]{64}$/.test(client)) return false;
    const now = Date.now();
    const day = Math.floor(now / DAY_MS);
    const hour = Math.floor(now / HOUR_MS);
    return this.ctx.storage.transaction(async (storage) => {
      let budget = await storage.get<Budget>("budget");
      if (!budget || budget.day !== day) {
        budget = { day, hour, hourly: 0, daily: 0, clients: {} };
      }
      if (budget.hour !== hour) {
        budget.hour = hour;
        budget.hourly = 0;
      }
      const count = budget.clients[client] ?? { hour, hourly: 0, daily: 0 };
      if (count.hour !== hour) {
        count.hour = hour;
        count.hourly = 0;
      }
      if (
        budget.hourly >= GLOBAL_HOURLY_LIMIT ||
        budget.daily >= GLOBAL_DAILY_LIMIT ||
        count.hourly >= CLIENT_HOURLY_LIMIT ||
        count.daily >= CLIENT_DAILY_LIMIT
      )
        return false;
      budget.hourly++;
      budget.daily++;
      count.hourly++;
      count.daily++;
      budget.clients[client] = count;
      await storage.put("budget", budget);
      await storage.setAlarm((day + 1) * DAY_MS);
      return true;
    });
  }

  async alarm() {
    // A delayed alarm must not delete reservations made in the new day.
    await this.ctx.storage.transaction(async (storage) => {
      const budget = await storage.get<Budget>("budget");
      if (budget && budget.day < Math.floor(Date.now() / DAY_MS))
        await storage.delete("budget");
    });
  }
}

class RequestError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

async function readSubmission(request: Request) {
  if (
    !/^application\/json(?:\s*;|$)/i.test(
      request.headers.get("Content-Type") ?? "",
    )
  ) {
    throw new RequestError(415, "INVALID_CONTENT_TYPE");
  }
  const length = request.headers.get("Content-Length");
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) {
    throw new RequestError(413, "REQUEST_TOO_LARGE");
  }
  if (!request.body) throw new RequestError(400, "INVALID_INPUT");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let expired = false;
  const deadline = setTimeout(() => {
    expired = true;
    void reader.cancel();
  }, REQUEST_TIMEOUT_MS);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (expired) throw new RequestError(408, "REQUEST_TIMEOUT");
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        throw new RequestError(413, "REQUEST_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    clearTimeout(deadline);
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(
      new TextDecoder("utf-8", { fatal: true, ignoreBOM: false }).decode(bytes),
    );
  } catch {
    throw new RequestError(400, "INVALID_INPUT");
  }
  if (
    !input ||
    Array.isArray(input) ||
    typeof input !== "object" ||
    Object.keys(input).some(
      (key) => !["name", "email", "subject", "message", "token"].includes(key),
    )
  ) {
    throw new RequestError(400, "INVALID_INPUT");
  }
  const field = (name: string, max: number, required = false) => {
    const value = input[name] ?? "";
    if (
      typeof value !== "string" ||
      value.length > max ||
      (required && !value.trim()) ||
      [...value].some((character) => {
        const code = character.charCodeAt(0);
        return (
          (code < 32 && (name !== "message" || ![9, 10, 13].includes(code))) ||
          code === 127
        );
      }) ||
      (name !== "message" && /[\r\n]/.test(value))
    ) {
      throw new RequestError(400, "INVALID_INPUT");
    }
    return value.trim();
  };
  const email = field("email", 254, true);
  if (
    !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}$/.test(
      email,
    ) ||
    email.includes("..")
  )
    throw new RequestError(400, "INVALID_INPUT");
  return {
    name: field("name", 100),
    email,
    subject: field("subject", 160),
    message: field("message", 5_000, true),
    token: field("token", 2_048, true),
  };
}

async function clientKey(ip: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(
      `contact:${Math.floor(Date.now() / DAY_MS)}:${ip}`,
    ),
  );
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    // ALLOWED_ORIGIN is deployment configuration, never a caller-supplied value.
    const allowed =
      env.ALLOWED_ORIGIN === "https://appsolves.dev" &&
      (origin === env.ALLOWED_ORIGIN || origin === "https://www.appsolves.dev");
    const headers = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Vary: "Origin",
      "X-Content-Type-Options": "nosniff",
    });
    if (allowed) headers.set("Access-Control-Allow-Origin", origin!);
    const reply = (status: number, code: string) =>
      new Response(JSON.stringify({ code }), { status, headers });
    if (new URL(request.url).pathname !== "/contact/submit")
      return reply(404, "NOT_FOUND");
    if (!allowed) return reply(403, "INVALID_ORIGIN");
    if (request.method === "OPTIONS") {
      if (
        request.headers.get("Access-Control-Request-Method") !== "POST" ||
        (request.headers.get("Access-Control-Request-Headers") ?? "")
          .split(",")
          .some(
            (value) =>
              value.trim() && value.trim().toLowerCase() !== "content-type",
          )
      ) {
        return reply(403, "INVALID_PREFLIGHT");
      }
      headers.set("Access-Control-Allow-Methods", "POST");
      headers.set("Access-Control-Allow-Headers", "Content-Type");
      headers.set("Access-Control-Max-Age", "600");
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") {
      headers.set("Allow", "POST, OPTIONS");
      return reply(405, "METHOD_NOT_ALLOWED");
    }
    try {
      if (
        !env.MAILJET_API_KEY ||
        !env.MAILJET_SECRET_KEY ||
        !env.TURNSTILE_SECRET_KEY ||
        !env.RATE_LIMIT_SECRET ||
        env.RATE_LIMIT_SECRET.length < 32 ||
        !env.BURST_LIMIT ||
        !env.CONTACT_BUDGET
      ) {
        return reply(503, "UNAVAILABLE");
      }
      const ip = request.headers.get("CF-Connecting-IP");
      // Cloudflare supplies/overwrites this header at its public edge.
      if (!ip) return reply(503, "UNAVAILABLE");
      const key = await clientKey(ip, env.RATE_LIMIT_SECRET);
      if (!(await env.BURST_LIMIT.limit({ key })).success)
        return reply(429, "RATE_LIMITED");
      const submission = await readSubmission(request);
      const verification = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
          body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET_KEY,
            response: submission.token,
          }),
        },
      );
      if (!verification.ok) return reply(503, "VERIFICATION_UNAVAILABLE");
      const result = (await verification.json()) as {
        success?: boolean;
        hostname?: string;
        action?: string;
        challenge_ts?: string;
      };
      const age = Date.now() - Date.parse(result.challenge_ts ?? "");
      if (
        result.success !== true ||
        result.hostname !== new URL(origin!).hostname ||
        result.action !== "contact" ||
        !Number.isFinite(age) ||
        age < -10_000 ||
        age > 300_000
      ) {
        return reply(400, "VERIFICATION_FAILED");
      }
      if (
        !(await env.CONTACT_BUDGET.getByName("contact-budget-v1").reserve(key))
      )
        return reply(429, "RATE_LIMITED");
      let sent: Response;
      try {
        sent = await fetch("https://api.mailjet.com/v3.1/send", {
          method: "POST",
          signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${env.MAILJET_API_KEY}:${env.MAILJET_SECRET_KEY}`)}`,
          },
          body: JSON.stringify({
            Messages: [
              {
                From: { Email: INBOX, Name: "AppSolves" },
                To: [{ Email: INBOX }],
                ReplyTo: {
                  Email: submission.email,
                  ...(submission.name ? { Name: submission.name } : {}),
                },
                Subject: `[AppSolves Contact] ${submission.subject || "Website inquiry"}`,
                TextPart: `Name: ${submission.name || "Not provided"}\nEmail: ${submission.email}\n\n${submission.message}`,
              },
            ],
          }),
        });
      } catch {
        return reply(502, "SEND_UNCONFIRMED");
      }
      if (!sent.ok) return reply(502, "SEND_FAILED");
      let receipt: {
        Messages?: {
          Status?: string;
          To?: { Email?: string; MessageID?: number; MessageUUID?: string }[];
        }[];
      };
      try {
        receipt = await sent.json();
      } catch {
        return reply(502, "SEND_UNCONFIRMED");
      }
      const message = receipt.Messages?.[0];
      if (
        receipt.Messages?.length !== 1 ||
        message?.Status !== "success" ||
        message.To?.length !== 1 ||
        message.To[0].Email !== INBOX ||
        !message.To[0].MessageID ||
        !message.To[0].MessageUUID
      ) {
        return reply(502, "SEND_FAILED");
      }
      return reply(200, "ACCEPTED");
    } catch (error) {
      if (error instanceof RequestError) return reply(error.status, error.code);
      // No submission contents, credentials, IPs or provider errors go into logs/responses.
      return reply(503, "UNAVAILABLE");
    }
  },
} satisfies ExportedHandler<Env>;
