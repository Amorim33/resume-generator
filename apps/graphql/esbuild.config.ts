import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { build } from 'esbuild';

const entryPoints = [resolve(__dirname, 'src/app.ts')];

build({
  bundle: true,
  platform: 'node',
  target: `node${process.versions.node}`,
  minify: true,
  sourcemap: true,
  mainFields: ['module', 'main'],
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
  console.log(
    '\nMetafile written to esbuild-meta.json\nOpen https://esbuild.github.io/analyze/ to analyze the bundle',
  );
});
