import { copyFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemin vers le dossier dist (racine du projet/dist)
const distPath = join(__dirname, '../dist');
const indexHtmlPath = join(distPath, 'index.html');
const notFoundHtmlPath = join(distPath, '404.html');
const noJekyllPath = join(distPath, '.nojekyll');

console.log(`Checking for dist folder at: ${distPath}`);

if (existsSync(indexHtmlPath)) {
  try {
    copyFileSync(indexHtmlPath, notFoundHtmlPath);
    console.log('✅ index.html successfully copied to 404.html');
  } catch (error) {
    console.error('❌ Error copying index.html to 404.html:', error);
    process.exit(1);
  }
} else {
  console.error('❌ dist/index.html not found. Make sure the build completed successfully.');
  // Ne pas échouer le script ici, car peut-être que le build a échoué avant ?
  // Mais si on est là, c'est que npm run build a réussi (tsc && vite build).
  process.exit(1);
}

// Créer .nojekyll pour GitHub Pages
try {
  writeFileSync(noJekyllPath, '');
  console.log('✅ .nojekyll created successfully');
} catch (error) {
  console.error('❌ Error creating .nojekyll:', error);
  process.exit(1);
}
