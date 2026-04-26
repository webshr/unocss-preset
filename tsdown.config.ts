import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  dts: true,
  // `exports: true` auto-rewrites package.json#exports on each build, which
  // clobbers manually-maintained subpath entries (`./reset.css`) and the
  // `types` conditional. Keep package.json#exports under hand control.
  exports: false,
  failOnWarn: true,
  publint: 'ci-only',
  // tsdown auto-treats `peerDependencies` as never-bundled — `@unocss/core`
  // and `@unocss/preset-mini` are declared peers in package.json, so they
  // stay external in the emitted bundle without an explicit list.
});
