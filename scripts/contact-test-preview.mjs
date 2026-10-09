// Separate production-format test build. Test keys never enter the review preview.
import { build, preview } from "vite";
process.env.VITE_CONTACT_API_URL = "http://127.0.0.1:8787/contact/submit";
process.env.VITE_TURNSTILE_SITE_KEY = "1x00000000000000000000AA";
await build({
  mode: "contact-test",
  build: { outDir: ".cache/contact-test-site" },
});
await preview({
  mode: "contact-test",
  build: { outDir: ".cache/contact-test-site" },
  preview: { host: "127.0.0.1", port: 4174, strictPort: true },
});
