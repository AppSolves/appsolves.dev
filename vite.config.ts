import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { resolve } from "path";
import { writeFileSync, readFileSync } from "fs";
import { componentTagger } from "lovable-tagger";
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: env.VITE_BASE_URL || '/',
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: 'CNAME',
            dest: ''
          }
        ]
      }),
      {
        name: "copy-404",
        closeBundle() {
          const indexPath = resolve(__dirname, "dist/index.html");
          const notFoundPath = resolve(__dirname, "dist/404.html");
          const html = readFileSync(indexPath, "utf-8");
          writeFileSync(notFoundPath, html);
          console.log("✅ 404.html generated automatically!");
        },
      },
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Enable code minification and obfuscation
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        },
        mangle: {
          // Mangle variable names for obfuscation
          toplevel: true,
          eval: true,
          keep_fnames: false
        },
        format: {
          comments: false // Remove comments
        }
      },
      // Split chunks to make reverse engineering harder
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-slot']
          }
        }
      }
    }
  }
});
