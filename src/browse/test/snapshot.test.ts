/**
 * Snapshot command tests
 *
 * Tests: accessibility tree snapshots, ref-based element selection,
 * ref invalidation on navigation, ref resolution in commands,
 * and cursor-interactive element detection (-C flag).
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startTestServer } from './test-server';
import { BrowserManager } from '../src/browser-manager';
import { handleReadCommand } from '../src/read-commands';
import { handleWriteCommand } from '../src/write-commands';
import { handleMetaCommand } from '../src/meta-commands';
import { parseSnapshotArgs } from '../src/snapshot';

let testServer: ReturnType<typeof startTestServer>;
let bm: BrowserManager;
let baseUrl: string;
const shutdown = async () => {};

beforeAll(async () => {
  testServer = startTestServer(0);
  baseUrl = testServer.url;

  bm = new BrowserManager();
  await bm.launch();
});

afterAll(async () => {
  try { testServer.server.stop(); } catch {}
  // bm.close() can hang indefinitely waiting for Chromium — race with a timeout
  await Promise.race([
    bm.close().catch(() => {}),
    new Promise(resolve => setTimeout(resolve, 3000)),
  ]);
});

// ─── Snapshot Output ────────────────────────────────────────────

describe('Snapshot', () => {
  test('snapshot returns accessibility tree with refs', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', [], bm, shutdown);
    expect(result).toContain('@e');
    expect(result).toContain('[heading]');
    expect(result).toContain('"Snapshot Test"');
    expect(result).toContain('[button]');
    expect(result).toContain('[link]');
  });

  test('snapshot -i returns only interactive elements', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-i'], bm, shutdown);
    expect(result).toContain('[button]');
    expect(result).toContain('[link]');
    expect(result).toContain('[textbox]');
    // Should NOT contain non-interactive roles like heading or paragraph
    expect(result).not.toContain('[heading]');
  });

  test('snapshot -c returns compact output', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const full = await handleMetaCommand('snapshot', [], bm, shutdown);
    const compact = await handleMetaCommand('snapshot', ['-c'], bm, shutdown);
    // Compact should have fewer lines (empty structural elements removed)
    const fullLines = full.split('\n').length;
    const compactLines = compact.split('\n').length;
    expect(compactLines).toBeLessThanOrEqual(fullLines);
  });

  test('snapshot -d 2 limits depth', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const shallow = await handleMetaCommand('snapshot', ['-d', '2'], bm, shutdown);
    const deep = await handleMetaCommand('snapshot', [], bm, shutdown);
    // Shallow should have fewer or equal lines
    expect(shallow.split('\n').length).toBeLessThanOrEqual(deep.split('\n').length);
  });

  test('snapshot -s "#main" scopes to selector', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const scoped = await handleMetaCommand('snapshot', ['-s', '#main'], bm, shutdown);
    // Should contain elements inside #main
    expect(scoped).toContain('[button]');
    expect(scoped).toContain('"Submit"');
    // Should NOT contain elements outside #main (like nav links)
    expect(scoped).not.toContain('"Internal Link"');
  });

  test('interactive snapshot finds links on basic page', async () => {
    await handleWriteCommand('goto', [baseUrl + '/basic.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-i'], bm, shutdown);
    // basic.html has links, so interactive snapshot should find those
    expect(result).toContain('[link]');
  });

  test('second snapshot generates fresh refs', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const snap1 = await handleMetaCommand('snapshot', [], bm, shutdown);
    const snap2 = await handleMetaCommand('snapshot', [], bm, shutdown);
    // Both should have @e1 (refs restart from 1)
    expect(snap1).toContain('@e1');
    expect(snap2).toContain('@e1');
  });
});

// ─── Cursor-Interactive Detection (-C flag) ─────────────────────

describe('Cursor-interactive (-C flag)', () => {
  test('parseSnapshotArgs parses -C flag', () => {
    const opts = parseSnapshotArgs(['-C']);
    expect(opts.cursor).toBe(true);
  });

  test('parseSnapshotArgs parses --cursor flag', () => {
    const opts = parseSnapshotArgs(['--cursor']);
    expect(opts.cursor).toBe(true);
  });

  test('parseSnapshotArgs combines -C with other flags', () => {
    const opts = parseSnapshotArgs(['-i', '-C', '-d', '3']);
    expect(opts.interactive).toBe(true);
    expect(opts.cursor).toBe(true);
    expect(opts.depth).toBe(3);
  });

  test('snapshot -C detects cursor:pointer elements', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    // Should contain the [cursor-interactive] section
    expect(result).toContain('[cursor-interactive]');
    // Should detect the .card div with cursor:pointer
    expect(result).toContain('Add to cart');
    expect(result).toContain('cursor:pointer');
  });

  test('snapshot -C detects onclick elements', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    // Should detect the span with onclick attribute
    expect(result).toContain('Close dialog');
    expect(result).toContain('onclick');
  });

  test('snapshot -C detects tabindex elements', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    // Should detect the div with tabindex="0"
    expect(result).toContain('Custom Tab');
    expect(result).toContain('tabindex');
  });

  test('snapshot -C detects data-action elements', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    // Should detect the div with data-action attribute
    expect(result).toContain('Open Menu');
    expect(result).toContain('data-action');
  });

  test('snapshot -C detects data-bs-toggle elements', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    // Should detect the div with data-bs-toggle attribute
    expect(result).toContain('Dropdown');
    expect(result).toContain('data-bs-toggle');
  });

  test('snapshot -C does NOT detect hidden elements', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    // The hidden-interactive div has display:none, should not appear
    expect(result).not.toContain('Should not appear');
  });

  test('snapshot -C still includes ARIA tree elements', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    // Regular ARIA elements should still be present
    expect(result).toContain('[heading]');
    expect(result).toContain('[button]');
    expect(result).toContain('[link]');
    expect(result).toContain('[textbox]');
  });

  test('snapshot -C refs continue from ARIA refs', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    // Find the cursor-interactive section
    const cursorSection = result.split('[cursor-interactive]')[1];
    expect(cursorSection).toBeDefined();
    // Cursor refs should have higher numbers than ARIA refs
    const ariaSection = result.split('[cursor-interactive]')[0];
    const ariaRefs = ariaSection.match(/@e(\d+)/g) || [];
    const cursorRefs = cursorSection!.match(/@e(\d+)/g) || [];
    expect(cursorRefs.length).toBeGreaterThan(0);
    // All cursor ref numbers should be higher than all ARIA ref numbers
    const maxAriaRef = Math.max(...ariaRefs.map(r => parseInt(r.replace('@e', ''), 10)));
    const minCursorRef = Math.min(...cursorRefs.map(r => parseInt(r.replace('@e', ''), 10)));
    expect(minCursorRef).toBeGreaterThan(maxAriaRef);
  });

  test('click @ref works for cursor-interactive elements', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    // Find the "Add to cart" ref in the CURSOR-INTERACTIVE section specifically
    // (the ARIA section may also contain this text with a role-based locator)
    const cursorSection = result.split('[cursor-interactive]')[1];
    expect(cursorSection).toBeDefined();
    const cardLine = cursorSection!.split('\n').find(l => l.includes('Add to cart'));
    expect(cardLine).toBeDefined();
    const refMatch = cardLine!.match(/@(e\d+)/);
    expect(refMatch).toBeDefined();
    const ref = `@${refMatch![1]}`;
    // Click should work — locator points to the actual DOM element via CSS selector
    const clickResult = await handleWriteCommand('click', [ref], bm);
    expect(clickResult).toContain('Clicked');
  });

  test('hover @ref works for cursor-interactive elements', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    // Find the "Close dialog" ref in the CURSOR-INTERACTIVE section specifically
    const cursorSection = result.split('[cursor-interactive]')[1];
    expect(cursorSection).toBeDefined();
    const closeLine = cursorSection!.split('\n').find(l => l.includes('Close dialog'));
    expect(closeLine).toBeDefined();
    const refMatch = closeLine!.match(/@(e\d+)/);
    expect(refMatch).toBeDefined();
    const ref = `@${refMatch![1]}`;
    const hoverResult = await handleWriteCommand('hover', [ref], bm);
    expect(hoverResult).toContain('Hovered');
  });

  test('snapshot -i -C combines interactive filter with cursor detection', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-i', '-C'], bm, shutdown);
    // ARIA section should only have interactive elements
    const ariaSection = result.split('[cursor-interactive]')[0];
    expect(ariaSection).not.toContain('[heading]');
    expect(ariaSection).toContain('[button]');
    // Cursor section should still be present
    expect(result).toContain('[cursor-interactive]');
    expect(result).toContain('Add to cart');
  });

  test('snapshot -C -s scopes cursor detection to selector', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C', '-s', '#cursor-section'], bm, shutdown);
    // Should find cursor-interactive elements within #cursor-section
    expect(result).toContain('[cursor-interactive]');
    expect(result).toContain('Add to cart');
    // Should NOT contain elements outside the scope
    expect(result).not.toContain('"Submit"');
  });

  test('snapshot without -C does NOT show cursor-interactive section', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', [], bm, shutdown);
    expect(result).not.toContain('[cursor-interactive]');
    expect(result).not.toContain('cursor:pointer');
  });

  test('snapshot -C output format matches expected pattern', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const result = await handleMetaCommand('snapshot', ['-C'], bm, shutdown);
    const cursorSection = result.split('[cursor-interactive]')[1];
    expect(cursorSection).toBeDefined();
    const cursorLines = cursorSection!.split('\n').filter(l => l.includes('@e'));
    // Each cursor line should match: @eN [tag.class] "text" (reason)
    for (const line of cursorLines) {
      expect(line).toMatch(/@e\d+ \[[\w.:-]+\]/);
      // Should have a reason in parentheses
      expect(line).toMatch(/\([\w:.-]+\)$/);
    }
  });
});

// ─── Ref-Based Interaction ──────────────────────────────────────

describe('Ref resolution', () => {
  test('click @ref works after snapshot', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const snap = await handleMetaCommand('snapshot', ['-i'], bm, shutdown);
    // Find a button ref
    const buttonLine = snap.split('\n').find(l => l.includes('[button]') && l.includes('"Submit"'));
    expect(buttonLine).toBeDefined();
    const refMatch = buttonLine!.match(/@(e\d+)/);
    expect(refMatch).toBeDefined();
    const ref = `@${refMatch![1]}`;
    const result = await handleWriteCommand('click', [ref], bm);
    expect(result).toContain('Clicked');
  });

  test('fill @ref works after snapshot', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const snap = await handleMetaCommand('snapshot', ['-i'], bm, shutdown);
    // Find a textbox ref (Username)
    const textboxLine = snap.split('\n').find(l => l.includes('[textbox]') && l.includes('"Username"'));
    expect(textboxLine).toBeDefined();
    const refMatch = textboxLine!.match(/@(e\d+)/);
    expect(refMatch).toBeDefined();
    const ref = `@${refMatch![1]}`;
    const result = await handleWriteCommand('fill', [ref, 'testuser'], bm);
    expect(result).toContain('Filled');
  });

  test('hover @ref works after snapshot', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const snap = await handleMetaCommand('snapshot', ['-i'], bm, shutdown);
    const linkLine = snap.split('\n').find(l => l.includes('[link]'));
    expect(linkLine).toBeDefined();
    const refMatch = linkLine!.match(/@(e\d+)/);
    const ref = `@${refMatch![1]}`;
    const result = await handleWriteCommand('hover', [ref], bm);
    expect(result).toContain('Hovered');
  });

  test('html @ref returns innerHTML', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const snap = await handleMetaCommand('snapshot', [], bm, shutdown);
    // Find a heading ref
    const headingLine = snap.split('\n').find(l => l.includes('[heading]') && l.includes('"Snapshot Test"'));
    expect(headingLine).toBeDefined();
    const refMatch = headingLine!.match(/@(e\d+)/);
    const ref = `@${refMatch![1]}`;
    const result = await handleReadCommand('html', [ref], bm);
    expect(result).toContain('Snapshot Test');
  });

  test('css @ref returns computed CSS', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const snap = await handleMetaCommand('snapshot', [], bm, shutdown);
    const headingLine = snap.split('\n').find(l => l.includes('[heading]') && l.includes('"Snapshot Test"'));
    const refMatch = headingLine!.match(/@(e\d+)/);
    const ref = `@${refMatch![1]}`;
    const result = await handleReadCommand('css', [ref, 'font-family'], bm);
    expect(result).toBeTruthy();
  });

  test('attrs @ref returns element attributes', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    const snap = await handleMetaCommand('snapshot', ['-i'], bm, shutdown);
    const textboxLine = snap.split('\n').find(l => l.includes('[textbox]') && l.includes('"Username"'));
    const refMatch = textboxLine!.match(/@(e\d+)/);
    const ref = `@${refMatch![1]}`;
    const result = await handleReadCommand('attrs', [ref], bm);
    expect(result).toContain('id');
  });
});

// ─── Ref Invalidation ───────────────────────────────────────────

describe('Ref invalidation', () => {
  test('stale ref after goto returns clear error', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    await handleMetaCommand('snapshot', ['-i'], bm, shutdown);
    // Navigate away — should invalidate refs
    await handleWriteCommand('goto', [baseUrl + '/basic.html'], bm);
    // Try to use old ref
    try {
      await handleWriteCommand('click', ['@e1'], bm);
      expect(true).toBe(false); // Should not reach here
    } catch (err: any) {
      expect(err.message).toContain('not found');
      expect(err.message).toContain('snapshot');
    }
  });

  test('refs cleared on page navigation', async () => {
    await handleWriteCommand('goto', [baseUrl + '/snapshot.html'], bm);
    await handleMetaCommand('snapshot', ['-i'], bm, shutdown);
    expect(bm.getRefCount()).toBeGreaterThan(0);
    // Navigate
    await handleWriteCommand('goto', [baseUrl + '/basic.html'], bm);
    expect(bm.getRefCount()).toBe(0);
  });
});
