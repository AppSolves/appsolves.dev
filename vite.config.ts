import react from "@vitejs/plugin-react";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path, { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import sitemapPlugin from "vite-plugin-sitemap";
import { viteStaticCopy } from "vite-plugin-static-copy";

const VENDOR_PACKAGES = ["react", "react-dom"];

const isNodeModulePackage = (id: string, packageName: string) =>
  id.includes(`/node_modules/${packageName}/`) ||
  id.includes(`\\node_modules\\${packageName}\\`);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

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
        generateRobotsTxt: false,
        exclude: ["/404"],
      }),
      {
        name: "static-route-entries",
        writeBundle() {
          const indexPath = resolve(__dirname, "dist/index.html");
          const notFoundPath = resolve(__dirname, "dist/404.html");

          if (!existsSync(indexPath)) {
            return;
          }

          const html = readFileSync(indexPath, "utf-8");
          writeFileSync(notFoundPath, html);
          for (const [route, title] of [
            ["privacy_policy", "Privacy policy"],
            ["terms_and_conditions", "Terms and conditions"],
          ]) {
            const directory = resolve(__dirname, "dist", route);
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
