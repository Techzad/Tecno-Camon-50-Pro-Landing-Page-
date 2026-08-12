import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'serve-root-assets',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            if (url.startsWith('/assets/')) {
              const cleanUrl = url.split('?')[0];
              const relativePath = cleanUrl.replace(/^\/assets\//, '');
              const match = findMatch(relativePath);
              if (match) {
                res.setHeader('Content-Type', match.mimeType);
                res.end(fs.readFileSync(match.filePath));
                return;
              }
            }
            next();
          });
        },
        closeBundle() {
          const srcDir = path.resolve(__dirname, 'assets');
          const destDir = path.resolve(__dirname, 'dist', 'assets');
          if (fs.existsSync(srcDir)) {
            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true });
            }
            
            // For production, copy files to both their original name and their mapped .png names
            const files = fs.readdirSync(srcDir);
            for (const file of files) {
              const srcFile = path.join(srcDir, file);
              if (fs.statSync(srcFile).isFile()) {
                // Copy original
                fs.copyFileSync(srcFile, path.join(destDir, file));

                // If it's a double extension or alternative format, copy as the standard expected .png too
                // e.g. input_file_0.png.jpg -> input_file_0.png
                if (file.includes('.png.')) {
                  const resolvedName = file.split('.png.')[0] + '.png';
                  fs.copyFileSync(srcFile, path.join(destDir, resolvedName));
                } else if (file.match(/input_file_\d+\.(jpg|jpeg|webp)$/i)) {
                  const resolvedName = file.replace(/\.(jpg|jpeg|webp)$/i, '.png');
                  fs.copyFileSync(srcFile, path.join(destDir, resolvedName));
                }
              }
            }
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

function findMatch(relativePath: string): { filePath: string; mimeType: string } | null {
  const assetsDir = path.resolve(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)) return null;

  // 1. Direct file existence check
  const directPath = path.join(assetsDir, relativePath);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    return { filePath: directPath, mimeType: getMimeType(directPath) };
  }

  const files = fs.readdirSync(assetsDir);

  // 2. Suffix / Dual extension check (e.g., input_file_0.png.jpg)
  for (const file of files) {
    if (file.toLowerCase().startsWith(relativePath.toLowerCase() + '.') || file.toLowerCase() === relativePath.toLowerCase()) {
      const matchedPath = path.join(assetsDir, file);
      if (fs.statSync(matchedPath).isFile()) {
        return { filePath: matchedPath, mimeType: getMimeType(matchedPath) };
      }
    }
  }

  // 3. Base matching (e.g., request input_file_0.png -> match input_file_0.jpg)
  const ext = path.extname(relativePath);
  const baseName = path.basename(relativePath, ext); // input_file_0
  
  for (const file of files) {
    const fileExt = path.extname(file);
    const fileBase = path.basename(file, fileExt);
    
    // Check if base matches, or if it matches when ignoring double-extension suffixes
    const cleanFileBase = fileBase.split('.png')[0];
    if (fileBase.toLowerCase() === baseName.toLowerCase() || 
        cleanFileBase.toLowerCase() === baseName.toLowerCase() ||
        file.toLowerCase().startsWith(baseName.toLowerCase())) {
      const matchedPath = path.join(assetsDir, file);
      if (fs.statSync(matchedPath).isFile()) {
        return { filePath: matchedPath, mimeType: getMimeType(matchedPath) };
      }
    }
  }

  return null;
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  
  // Secondary check for double extension
  if (filePath.endsWith('.png.jpg') || filePath.endsWith('.png.jpeg')) return 'image/jpeg';
  if (filePath.endsWith('.png.webp')) return 'image/webp';
  if (filePath.endsWith('.png.png')) return 'image/png';

  return 'application/octet-stream';
}
