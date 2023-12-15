import { writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { build } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entryPoints = [resolve(__dirname, 'src/app.ts')];

build({
  bundle: true,
  platform: 'node',
  target: `node${process.versions.node}`,
  minify: true,
  sourcemap: true,
  mainFields: ['module', 'main'],
  format: 'esm',
  entryPoints,
  entryNames: '[dir]/index',
  // cspell:disable-next-line - Esbuild property, can't change the name
  outdir: resolve(__dirname, 'dist'),
  jsx: 'automatic',
  logLevel: 'info',
  metafile: !!process.env.ANALYZE,
}).then((result) => {
  if (!process.env.ANALYZE) return;

  writeFileSync('esbuild-meta.json', JSON.stringify(result.metafile));
  // eslint-disable-next-line no-console
  console.info(
    '\nMetafile written to esbuild-meta.json\nOpen https://esbuild.github.io/analyze/ to analyze the bundle',
  );
});
