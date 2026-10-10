import assert from 'node:assert';

// Standard ratios table matching src/lib/utils/aspectRatio.ts
const STANDARD_RATIOS = [
  { label: '16:9', ratio: 16 / 9, tolerance: 0.035 },
  { label: '16:10', ratio: 16 / 10, tolerance: 0.035 },
  { label: '2:1', ratio: 2 / 1, tolerance: 0.045 },
  { label: '4:3', ratio: 4 / 3, tolerance: 0.035 },
  { label: '3:2', ratio: 3 / 2, tolerance: 0.035 },
  { label: '1:1', ratio: 1 / 1, tolerance: 0.035 },
  { label: '21:9', ratio: 21 / 9, tolerance: 0.045 },
  { label: '5:4', ratio: 5 / 4, tolerance: 0.035 },
  { label: '9:16', ratio: 9 / 16, tolerance: 0.035 },
  { label: '10:16', ratio: 10 / 16, tolerance: 0.035 },
  { label: '3:4', ratio: 3 / 4, tolerance: 0.035 },
];

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function calculateAspectRatio(width, height) {
  const safeWidth = Math.max(1, Math.round(width));
  const safeHeight = Math.max(1, Math.round(height));
  const numericRatio = safeWidth / safeHeight;

  for (const std of STANDARD_RATIOS) {
    if (Math.abs(numericRatio - std.ratio) <= std.tolerance) {
      return {
        width: safeWidth,
        height: safeHeight,
        ratio: numericRatio,
        label: std.label,
        cssRatio: `${safeWidth} / ${safeHeight}`,
      };
    }
  }

  const divisor = gcd(safeWidth, safeHeight);
  const simpleW = safeWidth / divisor;
  const simpleH = safeHeight / divisor;

  if (simpleW <= 32 && simpleH <= 32) {
    return {
      width: safeWidth,
      height: safeHeight,
      ratio: numericRatio,
      label: `${simpleW}:${simpleH}`,
      cssRatio: `${safeWidth} / ${safeHeight}`,
    };
  }

  return {
    width: safeWidth,
    height: safeHeight,
    ratio: numericRatio,
    label: `${numericRatio.toFixed(2)}:1`,
    cssRatio: `${safeWidth} / ${safeHeight}`,
  };
}

function areAspectRatiosMatching(ratio1, ratio2, tolerance = 0.04) {
  if (ratio1 <= 0 || ratio2 <= 0) return true;
  return Math.abs(ratio1 - ratio2) <= tolerance;
}

function getCanonicalDemoAspectRatio(demo, scenes) {
  if (
    demo?.settings?.canonicalWidth &&
    demo?.settings?.canonicalHeight &&
    demo.settings.canonicalWidth > 0 &&
    demo.settings.canonicalHeight > 0
  ) {
    const info = calculateAspectRatio(
      demo.settings.canonicalWidth,
      demo.settings.canonicalHeight
    );
    return {
      ...info,
      label: demo.settings.aspectRatio || info.label,
      isDefault: false,
    };
  }

  if (scenes && scenes.length > 0) {
    const firstScene = scenes.find((s) => s.viewport?.width > 0 && s.viewport?.height > 0) || scenes[0];
    if (firstScene?.viewport?.width && firstScene?.viewport?.height) {
      const info = calculateAspectRatio(firstScene.viewport.width, firstScene.viewport.height);
      return {
        ...info,
        label: firstScene.viewport.aspectRatio || info.label,
        isDefault: false,
      };
    }
  }

  if (demo?.settings?.aspectRatio) {
    const found = STANDARD_RATIOS.find((r) => r.label === demo.settings.aspectRatio);
    if (found) {
      const [w, h] = found.label.split(':').map(Number);
      return {
        width: w * 120,
        height: h * 120,
        ratio: found.ratio,
        label: found.label,
        cssRatio: `${w} / ${h}`,
        isDefault: false,
      };
    }
  }

  return {
    width: 1920,
    height: 1080,
    ratio: 16 / 9,
    label: '16:9',
    cssRatio: '16 / 9',
    isDefault: true,
  };
}

console.log('--- RUNNING ASPECT RATIO VERIFICATION SUITE ---');

// Test Case 1: 1920x1080 calculates to 16:9
const r1080p = calculateAspectRatio(1920, 1080);
assert.strictEqual(r1080p.label, '16:9');
assert.strictEqual(Math.round(r1080p.ratio * 1000) / 1000, 1.778);
console.log('✓ 1920x1080 -> 16:9 matched correctly');

// Test Case 2: 1280x720 calculates to 16:9 and matches 1920x1080
const r720p = calculateAspectRatio(1280, 720);
assert.strictEqual(r720p.label, '16:9');
assert.strictEqual(areAspectRatiosMatching(r1080p.ratio, r720p.ratio), true);
console.log('✓ 1920x1080 vs 1280x720 areAspectRatiosMatching is TRUE (no modal)');

// Test Case 3: 2876x1440 (from user screenshot) calculates to 2:1
const rSupademo = calculateAspectRatio(2876, 1440);
assert.strictEqual(rSupademo.label, '2:1');
console.log('✓ 2876x1440 -> 2:1 matched correctly (Supademo screenshot match)');

// Test Case 4: 1920x1080 vs 2876x1440 triggers mismatch warning
const mismatch = areAspectRatiosMatching(r1080p.ratio, rSupademo.ratio);
assert.strictEqual(mismatch, false);
console.log('✓ 1920x1080 vs 2876x1440 areAspectRatiosMatching is FALSE (triggers warning modal)');

// Test Case 5: 1440x900 resolves to 16:10
const rMac = calculateAspectRatio(1440, 900);
assert.strictEqual(rMac.label, '16:10');
console.log('✓ 1440x900 -> 16:10 matched correctly');

// Test Case 6: Canonical aspect ratio priority
// 6a: Fallback default is 16:9 (1920x1080)
const defaultCanonical = getCanonicalDemoAspectRatio(null, []);
assert.strictEqual(defaultCanonical.isDefault, true);
assert.strictEqual(defaultCanonical.label, '16:9');
console.log('✓ Canonical fallback is 16:9 (1920x1080, default flag true)');

// 6b: Derived from first scene when demo settings not set
const firstSceneCanonical = getCanonicalDemoAspectRatio(null, [
  { viewport: { width: 1440, height: 900 } }
]);
assert.strictEqual(firstSceneCanonical.isDefault, false);
assert.strictEqual(firstSceneCanonical.label, '16:10');
console.log('✓ Canonical derived from first slide (1440x900 -> 16:10)');

// 6c: Demo settings take precedence once explicitly stored
const demoExplicit = getCanonicalDemoAspectRatio(
  { settings: { canonicalWidth: 2876, canonicalHeight: 1440, aspectRatio: '2:1' } },
  [{ viewport: { width: 1920, height: 1080 } }]
);
assert.strictEqual(demoExplicit.label, '2:1');
assert.strictEqual(demoExplicit.width, 2876);
assert.strictEqual(demoExplicit.height, 1440);
console.log('✓ Explicit demo settings take precedence over existing scenes');

console.log('--- ALL 6 VERIFICATION TEST CASES PASSED SUCCESSFULLY ---');
