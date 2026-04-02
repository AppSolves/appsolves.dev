import react from "@vitejs/plugin-react";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import sitemapPlugin from "vite-plugin-sitemap";
import { viteStaticCopy } from "vite-plugin-static-copy";

const VENDOR_PACKAGES = ["react", "react-dom"];
const UI_PACKAGES = [
  "@radix-ui/react-accordion",
  "@radix-ui/react-dialog",
  "@radix-ui/react-slot",
];

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
      }),
      {
        name: "copy-404",
        writeBundle() {
          const indexPath = resolve(__dirname, "dist/index.html");
          const notFoundPath = resolve(__dirname, "dist/404.html");

          if (!existsSync(indexPath)) {
            return;
          }

          const html = readFileSync(indexPath, "utf-8");
          writeFileSync(notFoundPath, html);
          console.log("✅ 404.html generated automatically!");
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
      // Enable code minification and obfuscation
      minify: "terser",
      chunkSizeWarningLimit: 750,
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
          pure_funcs: ["console.log", "console.info", "console.debug"],
        },
        mangle: {
          // Mangle variable names for obfuscation
          toplevel: true,
          eval: true,
          keep_fnames: false,
        },
        format: {
          comments: false, // Remove comments
        },
      },
      // Split chunks to make reverse engineering harder
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

            if (
              UI_PACKAGES.some((packageName) =>
                isNodeModulePackage(id, packageName),
              )
            ) {
              return "ui";
            }

            return undefined;
          },
        },
      },
    },
  };
});
