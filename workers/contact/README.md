# AppSolves contact API: operator setup

This code is implemented and tested locally. It has **not** been deployed, the account/domain configuration has not been verified, and real mailbox receipt has **not** been confirmed. Do not activate the frontend until the steps below are complete. No credentials belong in Git or chat.

## Architecture and limits

GitHub Pages serves the React frontend. The independently deployed `appsolves-contact` Worker handles only `POST https://api.appsolves.dev/contact/submit` and legitimate OPTIONS preflights. Its route is `api.appsolves.dev/contact/*`, in zone `appsolves.dev`. Other paths may belong to independent Workers; there is no central dispatcher and no contact catch-all or hostname Custom Domain.

The browser carries only a public Turnstile site key and API URL. The Worker validates inputs and Siteverify success, a hostname matching the allowed requesting origin, action `contact`, and a challenge timestamp within five minutes. Siteverify enforces single use. It then reserves an outbound attempt in one coordinated Durable Object before calling Mailjet. No automatic provider retry or budget refund occurs, including after ambiguous timeouts.

- Native Cloudflare burst binding: 3 requests per 60 seconds per keyed client identifier. This facility is approximate and local to Cloudflare locations; it is not the global guarantee.
- Coordinated per-client cap: 3 attempts per UTC hour, 10 per UTC day.
- Coordinated global cap: 20 attempts per UTC hour, 100 per UTC day. Failed sends consume these allowances too. Keep the fixed object name `contact-budget-v1` and one production Worker binding; renaming or resetting storage resets the budget.
- Daily HMAC-derived identifiers and counters expire at the UTC day boundary. Raw IPs and messages are not stored. Provider infrastructure can process technical metadata separately.
- Fixed sender and sole recipient: `contact@appsolves.dev`. Visitor email appears only in ReplyTo. Plain-text email, no HTML or user-controlled headers.
- JSON body limit 16,384 bytes, read deadline 10 seconds; name 100, email 254, subject 160, message 5,000, token 2,048 characters. Provider request timeout 8 seconds.
- Only origins `https://appsolves.dev` and `https://www.appsolves.dev` are accepted. The existing CNAME, public DNS and apex redirect confirm the `www` site. CORS is browser isolation, not authentication; a forged Origin still must pass Turnstile and quotas. Preview domains are not allowed.
- Missing secrets/bindings or failed essential protection causes a closed failure. Responses contain general codes, not credentials, submitted text or provider diagnostics. No request-body logging or message database.

## 1. Review existing Cloudflare resources first

Run `npx wrangler login` interactively, then `npx wrangler whoami`. Confirm the correct account and ownership of zone `appsolves.dev`. Account authentication was expired during implementation; public DNS returned no API A/AAAA record, but dashboard configuration remains unverified.

In the dashboard inspect DNS, Workers routes, Custom Domains, existing `appsolves-contact` name, and rate-limiter namespace IDs. Record the existing personal automation/waste-calendar mappings. **Stop if any target already belongs to another service.** Do not overwrite, delete, or widen a route.

Worker Routes require a proxied DNS record. If `api` has no existing record and no real origin, create **AAAA / name `api` / content `100::` / Proxied / TTL Auto**. This reserved placeholder cannot provide an origin; unmatched paths are not a functioning API. If a record already exists, preserve it and investigate its purpose. Do not assign the entire API hostname as a Custom Domain. See [Cloudflare's originless route guidance](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/) and [route configuration](https://developers.cloudflare.com/workers/configuration/routing/routes/).

Confirm that rate-limiter namespace `1001` is unused, or select an unused account-local namespace ID in `wrangler.jsonc` before deployment. Do not reuse an existing limiter namespace blindly. Ensure the account plan supports the configured rate binding and SQLite Durable Objects, and review platform costs. Future automation/AI/webhooks Workers can have their own path routes; none is implemented here.

## 2. Configure Mailjet

1. Create/select the correct Mailjet account and a dedicated contact-sending API key. Verify the sending domain `appsolves.dev` and authorize `contact@appsolves.dev` as its sender. Keep the existing receiving mailbox working.
2. Inspect existing public MX, TXT/SPF and DKIM records and the DNS dashboard **before** changes. Mailjet sends mail; it does not establish inbox reception. Do not replace MX or existing email records.
3. Use the exact domain-verification TXT and DKIM selector/value shown in Mailjet's **Senders & Domains** settings. Add only required records. For SPF, merge Mailjet's documented include into the existing single `v=spf1` policy, preserving other authorized senders, terminal policy and DNS lookup limits. Never create a second SPF policy. Have the operator review the final DNS changes.
4. Wait for verification and SPF/DKIM validation in Mailjet. Review DMARC alignment with the existing policy. See [domain verification](https://dev.mailjet.com/docs/email-api/getting-started/verify-your-domain) and [SPF/DKIM](https://dev.mailjet.com/docs/email-api/senders-domains/spf-dkim-validation).
5. Obtain API key and secret privately. Review sending/account quotas, billing alerts and a conservative provider-side sending restriction if available. Never substitute a provider quota for the implemented coordinated cap without verifying its guarantee.

## 3. Configure Turnstile and provider contracts

Create a **Managed** Turnstile widget with allowed hostnames **`appsolves.dev` and `www.appsolves.dev`**. Leave pre-clearance disabled; no CDN bypass cookie is needed. Copy the public site key to frontend configuration and the private secret to the Worker only. The code sets action `contact` and requires Siteverify's hostname to match the requesting site. Do not add arbitrary preview hostnames. Production activation must use real keys, not [official test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

Review the actual account agreements, processor roles, data protection addenda, subprocessors, retention and international-transfer arrangements for Cloudflare and Mailjet before activation. Confirm that the privacy addendum accurately describes those configured accounts. The published provider documents do not prove an executed operator contract. See [Cloudflare DPA](https://www.cloudflare.com/cloudflare-customer-dpa/), [Turnstile privacy](https://www.cloudflare.com/turnstile-privacy-policy/) and [Mailjet security/privacy](https://www.mailjet.com/legal/security-privacy/).

## 4. Validate and deploy the isolated Worker, only after authorization

From the repository root:

```sh
npm ci
npm run typecheck
npm run lint
npm run worker:test
# Dry-run only, no resources deployed:
npm run worker:build
```

Once the resource checks and permission to deploy are complete:

```sh
# First deployment creates this new Worker and its isolated SQLite namespace.
npx wrangler deploy --config workers/contact/wrangler.jsonc
# Each command prompts privately; never paste secret values as CLI arguments:
npx wrangler secret put MAILJET_API_KEY --config workers/contact/wrangler.jsonc
npx wrangler secret put MAILJET_SECRET_KEY --config workers/contact/wrangler.jsonc
npx wrangler secret put TURNSTILE_SECRET_KEY --config workers/contact/wrangler.jsonc
npx wrangler secret put RATE_LIMIT_SECRET --config workers/contact/wrangler.jsonc
```

Use a separately generated cryptographically random value of at least 32 bytes for `RATE_LIMIT_SECRET`. The first deployment fails closed until every secret exists. Verify that only `api.appsolves.dev/contact/*` was added and all original mappings are unchanged. `workers.dev` and preview URLs remain disabled. Set route failure mode to **fail closed** in Cloudflare. Do not enable request-body logging; use non-sensitive request/status/error-rate metrics and provider account alerts. Default Worker logging is disabled.

Test OPTIONS at the exact endpoint with Origin `https://appsolves.dev` and requested method POST; expect 204 and the exact origin. GET must return 405, sibling contact paths 404, unwanted origins 403. Confirm TLS and API DNS. A command-line request cannot replace genuine browser Turnstile verification.

Regenerate config-derived types after future binding changes:

```sh
npx wrangler types --config workers/contact/wrangler.jsonc --env-interface ContactWorkerBindings workers/contact/worker-configuration.d.ts
```

Local private values, if needed, belong in ignored `workers/contact/.dev.vars`. No deployed infrastructure is necessary for the automated runtime tests; provider traffic is mocked.

## 5. Configure/build the frontend

Set these public build variables in a private local `.env.local` or the authorized deployment workflow configuration:

```text
VITE_CONTACT_API_URL=https://api.appsolves.dev/contact/submit
VITE_TURNSTILE_SITE_KEY=<real public production site key>
```

Set both together. Leave both unset until the endpoint is verified; the page then offers email and disables submission. The build rejects known test keys outside the dedicated `contact-test` mode. The API origin is added to CSP from this validated public configuration. Script/frame permissions add only `https://challenges.cloudflare.com`, following [Cloudflare CSP guidance](https://developers.cloudflare.com/turnstile/reference/content-security-policy/). No wildcard API permission or private frontend header is used.

```sh
npm run check
npm run worker:test
npx playwright test
npm run preview -- --host 127.0.0.1
```

The separate `.cache/contact-test-site` preview on port 4174 uses test keys and intercepted providers only. It is never the production preview artifact. Static route files support `/contact/`, `/impressum/`, both existing legal routes and `/404/` on GitHub Pages. Do not publish this test build.

After explicit website-release authorization, use the existing GitHub Pages deployment workflow/`npm run deploy` with the **configured production build**. This guide is not deployment permission. Verify direct-route refresh, canonical metadata, both themes and console CSP violations on the real domain.

## 6. Required real end-to-end acceptance

From the actual allowed site hostname, submit a genuine production Turnstile challenge and a uniquely identified message. Check the Worker response is `ACCEPTED`, Mailjet's message event/status, and **receipt in `contact@appsolves.dev`**, including the spam folder. Inspect authentication headers for SPF/DKIM/DMARC and verify Reply-To by replying. Verify failed/expired challenges and non-sensitive quota monitoring. Record date and outcome without copying personal message contents or secrets into Git.

Mailjet acceptance does not guarantee inbox delivery. Until a real receipt is observed, deployment, anti-bot production verification and email delivery remain unconfirmed.

## Legal release checks

The Impressum uses the confirmed natural-person operator, business designation, address and contact details. No VAT/register/phone/company form is invented. The owner confirmed no employees on 31 December 2025 and no consumer-arbitration obligation/commitment: no unconfirmed arbitration declaration is added ([§ 36 VSBG](https://www.gesetze-im-internet.de/vsbg/__36.html)). This portfolio does not appear to contain a journalistically edited periodical offering; no separate § 18(2) responsible editor is invented ([MStV § 18](https://www.gesetze-bayern.de/Content/Document/MStV-18)). Review applicability again if the offering changes. The live contact form and timely responses must support direct electronic communication under [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/DDG.pdf).

This is not legal certification. The existing Terms' Baden-Württemberg **court-jurisdiction clause** was deliberately preserved because it is a substantive clause, not the operator address; have it reviewed separately. Existing unrelated privacy/Terms clauses were not audited or rewritten. Confirm provider contracts/transfer safeguards and contact-message retention practice before release.
