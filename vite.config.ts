import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React関連のライブラリを分離
          'react-vendor': ['react', 'react-dom'],
          // UI系ライブラリを分離
          'ui-vendor': ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-tooltip'],
          // Zustand関連を分離
          'store-vendor': ['zustand'],
          // 大きなユーティリティファイルを分離
          'sample-data': ['./src/stores/slide-store/sampleSlides.detailed'],
          'thumbnail-utils': ['./src/utils/slideviewer/thumbnailGenerator'],
          // PPTX処理関連を分離
          'pptx-vendor': ['./src/utils/pptxParser', './src/utils/pptxPreviewConverter', './src/utils/pptxToHtml']
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Warning threshold increased to 1MB
    target: 'esnext',
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'zustand',
      'lucide-react'
    ]
  }
}));
