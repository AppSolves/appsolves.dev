import react from "@vitejs/plugin-react";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path, { resolve } from "path";
import { defineConfig, loadEnv, type ResolvedConfig } from "vite";
import sitemapPlugin from "vite-plugin-sitemap";
import { viteStaticCopy } from "vite-plugin-static-copy";

const VENDOR_PACKAGES = ["react", "react-dom"];

const isNodeModulePackage = (id: string, packageName: string) =>
  id.includes(`/node_modules/${packageName}/`) ||
  id.includes(`\\node_modules\\${packageName}\\`);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_CONTACT_API_URL || "";
  const apiOrigin = apiUrl ? new URL(apiUrl).origin : "";
  const siteKey = env.VITE_TURNSTILE_SITE_KEY || "";
  if (Boolean(apiUrl) !== Boolean(siteKey))
    throw new Error(
      "Configure both the contact endpoint and Turnstile site key, or leave both unset.",
    );
  if (mode !== "contact-test" && /^[123]x0{20}(?:AA|AB|BB|FF)$/.test(siteKey)) {
    throw new Error(
      "Turnstile test keys must not be used in the production preview.",
    );
  }
  if (
    apiUrl &&
    (new URL(apiUrl).pathname !== "/contact/submit" ||
      new URL(apiUrl).username ||
      new URL(apiUrl).password ||
      new URL(apiUrl).search ||
      new URL(apiUrl).hash ||
      (mode !== "contact-test" && apiOrigin !== "https://api.appsolves.dev"))
  ) {
    throw new Error(
      "Use the verified HTTPS contact endpoint; credentials and query parameters are not allowed.",
    );
  }
  let outputDirectory = resolve(__dirname, "dist");

  return {
    base: env.VITE_BASE_URL || "/",
    server: {
      host: "::",
      port: 8080,
      allowedHosts: ["appsolves.dev", "localhost"],
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: "CNAME",
            dest: "",
          },
        ],
      }),
      sitemapPlugin({
        hostname: "https://appsolves.dev/",
        outDir: mode === "contact-test" ? ".cache/contact-test-site" : "dist",
        generateRobotsTxt: false,
        exclude: ["/404"],
      }),
      {
        name: "static-route-entries",
        configResolved(config: ResolvedConfig) {
          outputDirectory = resolve(config.root, config.build.outDir);
        },
        transformIndexHtml(html: string) {
          return html
            .replace(
              "script-src 'self'",
              "script-src 'self' https://challenges.cloudflare.com",
            )
            .replace(
              "frame-src 'none'",
              "frame-src https://challenges.cloudflare.com",
            )
            .replace(
              "connect-src 'self' blob:",
              `connect-src 'self' blob:${apiOrigin ? ` ${apiOrigin}` : ""}`,
            );
        },
        writeBundle() {
          const indexPath = resolve(outputDirectory, "index.html");
          const notFoundPath = resolve(outputDirectory, "404.html");

          if (!existsSync(indexPath)) {
            return;
          }

          const html = readFileSync(indexPath, "utf-8");
          const notFound = html
            .replace(
              /<title>.*?<\/title>/,
              "<title>Page not found | AppSolves</title>",
            )
            .replace(
              /<meta\s+name="robots"[\s\S]*?\/>/,
              '<meta name="robots" content="noindex, follow" />',
            )
            .replace(/<link\s+rel="canonical"[^>]*>/, "")
            .replace(
              /<meta\s+(?:property="og:url"|name="(?:googlebot|bingbot)")[^>]*>/g,
              "",
            )
            .replace(
              /<meta\s+(?:property="og:title"|name="twitter:title")[^>]*>/g,
              "",
            )
            .replace(
              /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
              "",
            );
          writeFileSync(notFoundPath, notFound);
          const notFoundDirectory = resolve(outputDirectory, "404");
          mkdirSync(notFoundDirectory, { recursive: true });
          writeFileSync(resolve(notFoundDirectory, "index.html"), notFound);
          for (const [route, title, description] of [
            [
              "privacy_policy",
              "Privacy policy",
              "Privacy information for AppSolves websites, products and the contact form.",
            ],
            [
              "terms_and_conditions",
              "Terms and conditions",
              "Terms and conditions for AppSolves services.",
            ],
            [
              "impressum",
              "Impressum",
              "Anbieterkennzeichnung und Kontaktangaben von Kaan Gönüldinc, AppSolves.",
            ],
            [
              "contact",
              "Contact",
              "Send Kaan Gönüldinc a message about a project, an idea, or a question.",
            ],
          ]) {
            const directory = resolve(outputDirectory, route);
            mkdirSync(directory, { recursive: true });
            const page = html
              .replace(
                /<title>.*?<\/title>/,
                `<title>${title} | AppSolves</title>`,
              )
              .replace(
                'href="https://appsolves.dev/"',
                `href="https://appsolves.dev/${route}"`,
              )
              .replace(
                'property="og:url" content="https://appsolves.dev/"',
                `property="og:url" content="https://appsolves.dev/${route}"`,
              )
              .replace(
                /(<meta\s+(?:property="og:title"|name="twitter:title")\s+content=")[^"]*/g,
                `$1${title} | AppSolves`,
              )
              .replace(
                /(<meta\s+(?:property="og:description"|name="(?:description|twitter:description)")\s+content=")[^"]*/g,
                `$1${description}`,
              );
            writeFileSync(resolve(directory, "index.html"), page);
          }
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@legal": path.resolve(__dirname, "./public/legal"),
      },
    },
    build: {
      // Minify production assets; legal content and WebGL remain separate imports.
      minify: "terser",
      chunkSizeWarningLimit: 750,
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
          pure_funcs: ["console.log", "console.info", "console.debug"],
        },
        mangle: {
          toplevel: true,
          keep_fnames: false,
        },
        format: {
          comments: false, // Remove comments
        },
      },
      // Keep React reusable across the homepage and direct legal entries.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return undefined;
            }

            if (
              VENDOR_PACKAGES.some((packageName) =>
                isNodeModulePackage(id, packageName),
              )
            ) {
              return "vendor";
            }

            return undefined;
          },
        },
      },
    },
  };
});
