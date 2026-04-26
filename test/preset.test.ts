import { describe, expect, it } from 'vitest';
import { createGenerator } from '@unocss/core';
import { presetWebshore } from '../src/index';

async function gen(classes: string[]) {
  const uno = await createGenerator({ presets: [presetWebshore()] });
  const result = await uno.generate(classes.join(' '), { preflights: true });
  return result.css;
}

describe('@webshore/unocss-preset', () => {
  it('emits bg-primary-500 with var(--color-primary-500)', async () => {
    const css = await gen(['bg-primary-500']);
    expect(css).toMatch(/background-color\s*:\s*var\(--color-primary-500\)/);
  });

  it('honors numeric short form (bg-primary-5 → 500)', async () => {
    const css = await gen(['bg-primary-5']);
    expect(css).toMatch(/background-color\s*:\s*var\(--color-primary-500\)/);
  });

  it('opacity modifier (/50) emits color-mix in oklch', async () => {
    const css = await gen(['bg-primary-500/50']);
    expect(css).toMatch(/color-mix\(in oklch,\s*var\(--color-primary-500\)\s*50%,\s*transparent\)/);
  });

  it('preflight emits color-scheme + color tokens + reset companions', async () => {
    const css = await gen([]);
    // color-scheme declarations
    expect(css).toMatch(/:root\s*\{\s*color-scheme:\s*light;?\s*\}/);
    expect(css).toMatch(/html\[data-theme='dark'\]\s*\{\s*color-scheme:\s*dark;?\s*\}/);
    // base color step
    expect(css).toMatch(/--color-primary-500:\s*oklch\(/);
    // alpha variant (color-mix)
    expect(css).toMatch(/--color-primary-soft:\s*color-mix\(/);
    // reset.css companion tokens
    expect(css).toContain('--bg-canvas:');
    expect(css).toContain('--text-color:');
    expect(css).toContain('--border-default:');
    expect(css).toContain('--card-background:');
    expect(css).toContain('--icon-size-md:');
    expect(css).toContain('--stack-spacing:');
    expect(css).toContain('--gutter:');
  });

  it('dark: variant rewrites selector to html[data-theme="dark"]', async () => {
    const css = await gen(['dark:bg-primary-500']);
    expect(css).toMatch(/html\[data-theme=['"]dark['"]\]\s*\.dark\\:bg-primary-500/);
  });

  it('.box emits flex-column wrapper with content-gap', async () => {
    const css = await gen(['box']);
    expect(css).toMatch(/\.box\s*\{[^}]*display\s*:\s*flex/);
    expect(css).toMatch(/\.box\s*\{[^}]*flex-direction\s*:\s*column/);
    expect(css).toMatch(/\.box\s*\{[^}]*gap\s*:\s*var\(--content-gap\)/);
  });

  it('.block does NOT emit a layout primitive (frees native display: block)', async () => {
    // The preset's flex-column layout primitive lives at `.box` (formerly
    // `.block`, then briefly `.stack` — see CHANGELOG). In isolation, our
    // preset emits NO rule for `.block`; consumers combining `presetMini`
    // get its `display: block` rule. Either way `.block` is no longer
    // hijacked into a flex container.
    const css = await gen(['block']);
    expect(css).not.toMatch(/\.block\s*\{[^}]*flex-direction/);
    expect(css).not.toMatch(/\.block\s*\{[^}]*gap\s*:\s*var\(--content-gap\)/);
  });

  it('.stack class is NOT bound by the preset (reserved for reset.css rhythm primitive)', async () => {
    // `.stack` is Every Layout's adjacent-sibling rhythm class, defined in
    // `src/reset.css` (opt-in). The preset itself emits no rule for it, so
    // including/excluding reset.css fully owns the `.stack` semantics.
    const css = await gen(['stack']);
    expect(css).not.toMatch(/\.stack\s*\{[^}]*display\s*:\s*flex/);
    expect(css).not.toMatch(/\.stack\s*\{[^}]*flex-direction/);
  });

  it('ring rule paints a box-shadow (preset-mini rings is wired)', async () => {
    const css = await gen(['ring-2', 'ring-primary-500']);
    // Width sets --un-ring-width and box-shadow composition
    expect(css).toMatch(/--un-ring-width:\s*2px/);
    expect(css).toMatch(/box-shadow:\s*var\(--un-ring-offset-shadow\),\s*var\(--un-ring-shadow\)/);
    // Color sets --un-ring-color via colorMixResolver
    expect(css).toMatch(/--un-ring-color:\s*var\(--color-primary-500\)/);
  });
});
