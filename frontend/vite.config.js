import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({
        jsxRuntime: "automatic",
      }),
      tailwindcss(),
    ],
    server: {
      port: 3000,
    },
    // REMOVE this line - external is for library builds, not apps
    // external: ["react", "react-dom"],
    
    optimizeDeps: {
      include: ["react/jsx-runtime", "framer-motion"], // Include framer-motion
      // REMOVE exclude for framer-motion - you can't include and exclude same package
    },
    
    esbuild: {
      pure:
        mode === "production"
          ? ["console.log", "console.debug", "console.info", "console.warn"]
          : [],
      drop: mode === "production" ? ["console", "debugger"] : [],
    },
    
    build: {
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
      // MOVE commonjsOptions to the right place
      commonjsOptions: {
        include: [/framer-motion/, /node_modules/],
      },
    },
  };
});
