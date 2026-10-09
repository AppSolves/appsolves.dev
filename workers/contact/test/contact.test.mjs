import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";

let runtime;
let verification;
let provider;
let sent;
let usedTokens;
const valid = () => ({
  name: "Visitor",
  email: "visitor@example.org",
  subject: "A question",
  message: "Hello Kaan, I have a project question.",
  token: crypto.randomUUID(),
});
const receipt = () => ({
  Messages: [
    {
      Status: "success",
      To: [
        {
          Email: "contact@appsolves.dev",
          MessageID: 123,
          MessageUUID: "test-receipt",
        },
      ],
    },
  ],
});

async function start({ burst = 3, secrets = true } = {}) {
  return new Miniflare(
    convertV4MiniflareOptions({
      name: "appsolves-contact",
      modules: true,
      script: await readFile(".cache/contact-worker/index.js", "utf8"),
      compatibilityDate: "2026-10-09",
      bindings: {
        ALLOWED_ORIGIN: "https://appsolves.dev",
        ...(secrets
          ? {
              MAILJET_API_KEY: "test-api-key",
              MAILJET_SECRET_KEY: "test-secret-key",
              TURNSTILE_SECRET_KEY: "test-turnstile-secret",
              RATE_LIMIT_SECRET: "test-rate-secret-not-a-production-key",
            }
          : {}),
      },
      durableObjects: {
        CONTACT_BUDGET: { className: "ContactBudget", useSQLite: true },
      },
      ratelimits: {
        BURST_LIMIT: {
          namespace_id: "1001",
          simple: { limit: burst, period: 60 },
        },
      },
      outboundService: async (request) => {
        if (
          request.url ===
          "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        ) {
          const body = new URLSearchParams(await request.text());
          assert.equal(body.get("secret"), "test-turnstile-secret");
          const token = body.get("response");
          const replay = usedTokens.has(token);
          usedTokens.add(token);
          return Response.json(
            replay
              ? { success: false, "error-codes": ["timeout-or-duplicate"] }
              : verification,
          );
        }
        assert.equal(request.url, "https://api.mailjet.com/v3.1/send");
        assert.equal(
          request.headers.get("Authorization"),
          `Basic ${btoa("test-api-key:test-secret-key")}`,
        );
        sent.push(await request.json());
        if (provider === "timeout") {
          await new Promise((resolve) => setTimeout(resolve, 8500));
          return Response.json(receipt());
        }
        return provider();
      },
    }),
  );
}
beforeEach(async () => {
  verification = {
    success: true,
    action: "contact",
    hostname: "appsolves.dev",
    challenge_ts: new Date().toISOString(),
  };
  provider = () => Response.json(receipt());
  sent = [];
  usedTokens = new Set();
  runtime = await start();
});
afterEach(async () => {
  await runtime.dispose();
});

function submit(body = valid(), overrides = {}) {
  return runtime.dispatchFetch("https://api.appsolves.dev/contact/submit", {
    method: "POST",
    headers: {
      Origin: "https://appsolves.dev",
      "Content-Type": "application/json",
      "CF-Connecting-IP": "192.0.2.1",
      ...overrides.headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
    ...Object.fromEntries(
      Object.entries(overrides).filter(([key]) => key !== "headers"),
    ),
  });
}
test("Mailjet-confirmed acceptance fixes sender/recipient and uses visitor only as ReplyTo", async () => {
  const response = await submit();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { code: "ACCEPTED" });
  assert.equal(
    response.headers.get("Access-Control-Allow-Origin"),
    "https://appsolves.dev",
  );
  assert.equal(response.headers.get("Vary"), "Origin");
  const [message] = sent[0].Messages;
  assert.deepEqual(message.From, {
    Email: "contact@appsolves.dev",
    Name: "AppSolves",
  });
  assert.deepEqual(message.To, [{ Email: "contact@appsolves.dev" }]);
  assert.deepEqual(message.ReplyTo, {
    Email: "visitor@example.org",
    Name: "Visitor",
  });
  assert.equal(message.Subject, "[AppSolves Contact] A question");
  assert.equal(message.HTMLPart, undefined);
  assert.match(message.TextPart, /Hello Kaan/);
});
test("verified www site accepts its own challenge and echoes its exact origin", async () => {
  verification.hostname = "www.appsolves.dev";
  const response = await submit(valid(), {
    headers: { Origin: "https://www.appsolves.dev" },
  });
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("Access-Control-Allow-Origin"),
    "https://www.appsolves.dev",
  );
  assert.equal(sent.length, 1);
});
test("a challenge from the apex cannot authenticate a www submission", async () => {
  const response = await submit(valid(), {
    headers: { Origin: "https://www.appsolves.dev" },
  });
  assert.equal(response.status, 400);
  assert.equal(sent.length, 0);
});
for (const [name, changes] of [
  ["missing email", { email: "" }],
  ["missing message", { message: " " }],
  ["invalid email", { email: "bad@example" }],
  ["missing token", { token: "" }],
  ["header injection", { subject: "Hello\r\nBcc: spam@example.org" }],
  ["unknown recipient", { to: "attacker@example.org" }],
  ["oversized name", { name: "a".repeat(101) }],
  ["oversized message", { message: "a".repeat(5001) }],
  ["control character", { name: "a\0b" }],
])
  test(`rejects ${name} before provider calls`, async () => {
    assert.equal((await submit({ ...valid(), ...changes })).status, 400);
    assert.equal(sent.length, 0);
    assert.equal(usedTokens.size, 0);
  });
test("rejects invalid content types, JSON shapes and oversized streamed requests", async () => {
  assert.equal(
    (await submit(valid(), { headers: { "Content-Type": "text/plain" } }))
      .status,
    415,
  );
  assert.equal((await submit("null")).status, 400);
  assert.equal(
    (
      await submit("x".repeat(16385), {
        headers: { "CF-Connecting-IP": "192.0.2.2" },
      })
    ).status,
    413,
  );
  assert.equal(sent.length, 0);
});
test("exact path, methods, origin and preflight isolation", async () => {
  assert.equal(
    (await submit(valid(), { headers: { Origin: "https://evil.example" } }))
      .status,
    403,
  );
  const denied = await submit(valid(), { headers: { Origin: "null" } });
  assert.equal(denied.headers.get("Access-Control-Allow-Origin"), null);
  assert.equal(
    (
      await runtime.dispatchFetch("https://api.appsolves.dev/contact/other", {
        headers: { Origin: "https://appsolves.dev" },
      })
    ).status,
    404,
  );
  assert.equal(
    (
      await runtime.dispatchFetch("https://api.appsolves.dev/contact/submit", {
        headers: { Origin: "https://appsolves.dev" },
      })
    ).status,
    405,
  );
  const preflight = await runtime.dispatchFetch(
    "https://api.appsolves.dev/contact/submit",
    {
      method: "OPTIONS",
      headers: {
        Origin: "https://appsolves.dev",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    },
  );
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("Access-Control-Allow-Methods"), "POST");
  assert.equal(sent.length, 0);
});
for (const [name, changes] of [
  ["invalid challenge", { success: false }],
  ["wrong hostname", { hostname: "evil.example" }],
  ["wrong action", { action: "login" }],
  [
    "expired token",
    { challenge_ts: new Date(Date.now() - 301000).toISOString() },
  ],
  ["missing timestamp", { challenge_ts: undefined }],
  [
    "future token",
    { challenge_ts: new Date(Date.now() + 60000).toISOString() },
  ],
])
  test(`Turnstile rejects ${name}`, async () => {
    verification = { ...verification, ...changes };
    const response = await submit();
    assert.equal(response.status, 400);
    assert.equal((await response.json()).code, "VERIFICATION_FAILED");
    assert.equal(sent.length, 0);
  });
test("Siteverify rejects reuse and never invokes Mailjet twice", async () => {
  const input = valid();
  assert.equal((await submit(input)).status, 200);
  assert.equal((await submit(input)).status, 400);
  assert.equal(sent.length, 1);
});
test("native Cloudflare burst limiter rejects the fourth attempt", async () => {
  verification.success = false;
  for (let i = 0; i < 3; i++) assert.equal((await submit()).status, 400);
  assert.equal((await submit()).status, 429);
  assert.equal(sent.length, 0);
});
test("coordinated longer client limit works independently of the burst limiter", async () => {
  await runtime.dispose();
  runtime = await start({ burst: 1000 });
  for (let i = 0; i < 3; i++) assert.equal((await submit()).status, 200);
  assert.equal((await submit()).status, 429);
  assert.equal(sent.length, 3);
});
test("concurrent distinct clients cannot exceed the coordinated 20-per-hour global cap", async () => {
  const responses = await Promise.all(
    Array.from({ length: 30 }, (_, index) =>
      submit(valid(), {
        headers: { "CF-Connecting-IP": `192.0.2.${index + 1}` },
      }),
    ),
  );
  assert.equal(
    responses.filter((response) => response.status === 200).length,
    20,
  );
  assert.equal(
    responses.filter((response) => response.status === 429).length,
    10,
  );
  assert.equal(sent.length, 20);
});
for (const [name, response] of [
  [
    "HTTP rejection",
    () =>
      Response.json(
        { ErrorMessage: "private provider detail" },
        { status: 401 },
      ),
  ],
  [
    "per-message rejection",
    () => Response.json({ Messages: [{ Status: "error" }] }),
  ],
  [
    "malformed acceptance",
    () => Response.json({ Messages: [{ Status: "success" }] }),
  ],
  [
    "wrong recipient",
    () => {
      const result = receipt();
      result.Messages[0].To[0].Email = "attacker@example.org";
      return Response.json(result);
    },
  ],
])
  test(`Mailjet ${name} never reports success or leaks provider details`, async () => {
    provider = response;
    const result = await submit();
    assert.equal(result.status, 502);
    const body = await result.text();
    assert.equal(body.includes("private"), false);
    assert.equal(body.includes("test-secret"), false);
  });
test(
  "Mailjet timeout is bounded and ambiguous sends are not retried",
  { timeout: 15000 },
  async () => {
    provider = "timeout";
    const result = await submit();
    assert.equal(result.status, 502);
    assert.equal((await result.json()).code, "SEND_UNCONFIRMED");
    assert.equal(sent.length, 1);
  },
);
test("missing essential secrets fails closed before providers", async () => {
  await runtime.dispose();
  runtime = await start({ secrets: false });
  assert.equal((await submit()).status, 503);
  assert.equal(sent.length, 0);
});

test("essential protection failures stay closed without logging private inputs or errors", async () => {
  const bundle = await readFile(".cache/contact-worker/index.js", "utf8");
  // Test-only entry captures console arguments and injects failures, never deployed.
  const harness = `import worker from './index.js';
    export {ContactBudget} from './index.js';
    export default {async fetch(request,env){
      const entries=[];
      const originalLog=console.error;
      const originalImport=crypto.subtle.importKey;
      console.error=(...args)=>entries.push(args);
      const bindings={...env};
      const fault=request.headers.get('X-Test-Fault');
      if(fault==='ip'){const headers=new Headers(request.headers);headers.delete('CF-Connecting-IP');request=new Request(request,{headers});}
      if(fault==='binding')delete bindings.MAILJET_API_KEY;
      if(fault==='short_secret')bindings.RATE_LIMIT_SECRET='private-sentinel';
      if(fault==='hmac')crypto.subtle.importKey=async()=>{throw new TypeError('private-sentinel');};
      if(fault==='burst')bindings.BURST_LIMIT={limit:async()=>{const error=new Error('private-sentinel');error.name='private-sentinel';throw error;}};
      try{
        const response=await worker.fetch(request,bindings);
        return Response.json({status:response.status,body:await response.json(),entries});
      }finally{console.error=originalLog;crypto.subtle.importKey=originalImport;}
    }};`;
  const probe = new Miniflare(
    convertV4MiniflareOptions({
      name: "contact-protection-test",
      compatibilityDate: "2026-10-09",
      modules: [
        { type: "ESModule", path: "probe.js", contents: harness },
        { type: "ESModule", path: "index.js", contents: bundle },
      ],
      bindings: {
        ALLOWED_ORIGIN: "https://appsolves.dev",
        MAILJET_API_KEY: "private-sentinel",
        MAILJET_SECRET_KEY: "private-sentinel",
        TURNSTILE_SECRET_KEY: "private-sentinel",
        RATE_LIMIT_SECRET:
          "private-sentinel-long-enough-for-the-existing-policy",
      },
      durableObjects: {
        CONTACT_BUDGET: { className: "ContactBudget", useSQLite: true },
      },
      ratelimits: {
        BURST_LIMIT: { namespace_id: "1001", simple: { limit: 3, period: 60 } },
      },
      outboundService: () => {
        throw new Error("Protection failures must not call providers");
      },
    }),
  );
  try {
    for (const fault of ["binding", "short_secret", "ip", "hmac", "burst"]) {
      const response = await probe.dispatchFetch(
        "https://api.appsolves.dev/contact/submit",
        {
          method: "POST",
          headers: {
            Origin: "https://appsolves.dev",
            "Content-Type": "application/json",
            "X-Test-Fault": fault,
            ...(fault === "ip" ? {} : { "CF-Connecting-IP": "192.0.2.99" }),
          },
          body: JSON.stringify({
            ...valid(),
            token: "private-sentinel",
            message: "private-sentinel",
          }),
        },
      );
      const result = await response.json();
      assert.equal(result.status, 503);
      assert.deepEqual(result.body, { code: "UNAVAILABLE" }, fault);
      assert.deepEqual(result.entries, [], fault);
    }
  } finally {
    await probe.dispose();
  }
});

test("real Durable Object enforces daily budgets across hours and resets at the UTC boundary", async () => {
  const bundle = await readFile(".cache/contact-worker/index.js", "utf8");
  // Test-only RPC harness controls the clock inside the actual budget class.
  // It is never included in Wrangler's production entry point or browser assets.
  const harness = `import {ContactBudget} from './index.js';
    export class ClockBudget extends ContactBudget {
      async reserveAt(key,time){const original=Date.now;Date.now=()=>time;try{return await super.reserve(key);}finally{Date.now=original;}}
    }
    export default {async fetch(req,env){const {key,time}=await req.json();return Response.json(await env.BUDGET.getByName('test-budget').reserveAt(key,time));}};`;
  const clock = new Miniflare(
    convertV4MiniflareOptions({
      name: "budget-clock",
      compatibilityDate: "2026-10-09",
      modules: [
        { type: "ESModule", path: "clock.js", contents: harness },
        { type: "ESModule", path: "index.js", contents: bundle },
      ],
      durableObjects: { BUDGET: { className: "ClockBudget", useSQLite: true } },
    }),
  );
  const day = Math.floor(Date.now() / 86400000) * 86400000;
  const reserve = async (index, time) =>
    (
      await clock.dispatchFetch("https://test.example/", {
        method: "POST",
        body: JSON.stringify({
          key: index.toString(16).padStart(64, "0"),
          time,
        }),
      })
    ).json();
  try {
    for (let hour = 0; hour < 5; hour++) {
      for (let i = 0; i < 20; i++)
        assert.equal(await reserve(hour * 20 + i, day + hour * 3600000), true);
    }
    assert.equal(await reserve(101, day + 6 * 3600000), false);
    assert.equal(await reserve(101, day + 86400000), true);
    // That client may consume only ten attempts throughout the next UTC day.
    for (let i = 1; i < 10; i++)
      assert.equal(
        await reserve(101, day + 86400000 + Math.floor(i / 3) * 3600000),
        true,
      );
    assert.equal(await reserve(101, day + 86400000 + 4 * 3600000), false);
  } finally {
    await clock.dispose();
  }
});
