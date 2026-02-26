#!/usr/bin/env node

/**
 * Migration Script: Jekyll → Docusaurus for Prebid.js dev-docs
 *
 * Usage:
 *   node scripts/migrate-devdocs.mjs --source dev-docs/analytics --dest docs/dev-docs/prebidjs/analytics [--dry-run] [--verbose] [--skip-git-mv]
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { parseArgs } from 'util';

// ── CLI argument parsing ────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    source: { type: 'string' },
    dest: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    verbose: { type: 'boolean', default: false },
    'skip-git-mv': { type: 'boolean', default: false },
  },
  strict: true,
});

if (!args.source || !args.dest) {
  console.error('Usage: node scripts/migrate-devdocs.mjs --source <src> --dest <dst> [--dry-run] [--verbose] [--skip-git-mv]');
  process.exit(1);
}

const SOURCE_DIR = path.resolve(args.source);
const DEST_DIR = path.resolve(args.dest);
const DRY_RUN = args['dry-run'];
const VERBOSE = args.verbose;
const SKIP_GIT_MV = args['skip-git-mv'];

// ── Report tracking ─────────────────────────────────────────────────────────

const report = {
  totalFiles: 0,
  transformed: 0,
  flaggedManual: [],
  skippedManual: [],
  skippedConflict: [],
  renamedToMdx: [],
  transformations: {
    frontmatterLinesRemoved: 0,
    tocMarkersRemoved: 0,
    cssClassesRemoved: 0,
    inlineAlertsConverted: 0,
    alertIncludesConverted: 0,
    captureAlertConverted: 0,
    linksRewritten: 0,
    imagesRewritten: 0,
    includesInlined: 0,
    componentIncludes: 0,
    fallbackIncludes: 0,
  },
};

// ── Alert type mapping ──────────────────────────────────────────────────────

const ALERT_TYPE_MAP = {
  'alert_warning': 'warning',
  'alert_note': 'note',
  'alert_tip': 'tip',
  'alert_important': 'caution',
  'alert_info': 'info',
  'alert_danger': 'danger',
  'alert_success': 'tip',
};

const INLINE_ALERT_MAP = {
  'alert-warning': 'warning',
  'alert-info': 'info',
  'alert-success': 'tip',
  'alert-danger': 'danger',
  'alert-note': 'note',
  'alert-important': 'caution',
};

// ── Transformation functions ────────────────────────────────────────────────

function splitFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: '', body: content, hasFrontmatter: false };
  return { frontmatter: match[1], body: match[2], hasFrontmatter: true };
}

function joinFrontmatter(frontmatter, body) {
  if (!frontmatter) return body;
  return `---\n${frontmatter}\n---\n${body}`;
}

/** Stage 1: Remove Jekyll-specific frontmatter lines */
function cleanFrontmatter(frontmatter, stats) {
  const removeKeys = ['layout', 'sidebarType', 'left_nav_override', 'top_nav_section', 'nav_section'];
  const lines = frontmatter.split('\n');
  const cleaned = [];
  let inMultilineValue = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if this line starts a key we want to remove
    const keyMatch = line.match(/^(\w[\w_-]*):/);
    if (keyMatch && removeKeys.includes(keyMatch[1])) {
      stats.frontmatterLinesRemoved++;
      // Check if the value continues on next lines (multiline YAML)
      // Simple heuristic: next line starts with spaces but not a new key
      inMultilineValue = true;
      continue;
    }
    if (inMultilineValue) {
      // If this line is indented or empty, it's part of the multiline value
      if (line.match(/^\s+\S/) && !line.match(/^\w[\w_-]*:/)) {
        stats.frontmatterLinesRemoved++;
        continue;
      }
      inMultilineValue = false;
    }
    cleaned.push(line);
  }

  return cleaned.join('\n');
}

/** Stage 2: Remove TOC markers */
function removeTocMarkers(body, stats) {
  const patterns = [
    /^\{:\s*\.no_toc\s*\}\s*$/gm,
    /^\{:\s*no_toc\s*\}\s*$/gm,
    /^\*\s*TOC\s*$/gm,
    /^-\s*TOC\s*$/gm,
    /^\{:\s*toc\s*\}\s*$/gm,
    /^\{:toc\}\s*$/gm,
  ];
  let result = body;
  for (const pattern of patterns) {
    const matches = result.match(pattern);
    if (matches) {
      stats.tocMarkersRemoved += matches.length;
      result = result.replace(pattern, '');
    }
  }
  return result;
}

/** Stage 3: Remove CSS class markers */
function removeCssClasses(body, stats) {
  // Match {: .class .class .class } patterns on their own line
  const pattern = /^\{:\s*(?:\.\S+\s*)+\}\s*$/gm;
  const matches = body.match(pattern);
  if (matches) {
    stats.cssClassesRemoved += matches.length;
  }
  return body.replace(pattern, '');
}

/** Stage 4: Convert inline alerts like {: .alert.alert-warning :} */
function convertInlineAlerts(body, stats) {
  // Pattern: {: .alert.alert-TYPE :} followed by content until next blank line
  const pattern = /\{:\s*\.alert\.alert-(\w+)\s*:?\s*\}\s*\n([\s\S]*?)(?=\n\s*\n|\n#|\n---|\Z)/g;
  let result = body;

  result = result.replace(pattern, (match, alertType, content) => {
    const docusaurusType = INLINE_ALERT_MAP[`alert-${alertType}`] || 'note';
    stats.inlineAlertsConverted++;
    return `:::${docusaurusType}\n${content.trim()}\n:::`;
  });

  return result;
}

/** Stage 5: Convert alert includes with string content */
function convertAlertIncludes(body, stats) {
  // Pattern: {% include alerts/alert_TYPE.html content="TEXT" %}
  // Handle both single and double quotes, and multi-line content
  const pattern = /\{%\s*include\s+alerts\/alert_(\w+)\.html\s+content="((?:[^"\\]|\\.)*)"\s*%\}/g;
  let result = body;

  result = result.replace(pattern, (match, alertType, content) => {
    const docusaurusType = ALERT_TYPE_MAP[`alert_${alertType}`] || 'note';
    stats.alertIncludesConverted++;
    // Unescape any escaped quotes
    const cleanContent = content.replace(/\\"/g, '"');
    return `:::${docusaurusType}\n${cleanContent}\n:::`;
  });

  return result;
}

/** Stage 6: Convert capture + alert patterns */
function convertCaptureAlerts(body, stats) {
  // Process capture+include pairs iteratively from top to bottom.
  // This handles repeated variable names (e.g. two captures both named warning_note).
  let result = body;
  let changed = true;

  // Keep looping until no more capture+include pairs are found
  while (changed) {
    changed = false;
    // Find the FIRST capture block (variable names can contain hyphens)
    const capturePattern = /\{%[-\s]*capture\s+([\w-]+)\s*[-]?%\}([\s\S]*?)\{%[-\s]*endcapture\s*[-]?%\}/;
    const captureMatch = capturePattern.exec(result);
    if (!captureMatch) break;

    const varName = captureMatch[1];
    const captureContent = captureMatch[2].trim();
    const captureFullMatch = captureMatch[0];

    // Find the corresponding alert include after the capture block
    // Handle both alerts/alert_TYPE.html and /alerts/alert_TYPE.html (with leading slash)
    const escapedVarName = varName.replace(/[-]/g, '\\-');
    const includePattern = new RegExp(
      `\\{%\\s*include\\s+/?alerts/alert_(\\w+)\\.html\\s+content\\s*=\\s*${escapedVarName}\\s*%\\}`
    );
    // Search only in the text AFTER the capture block
    const afterCapture = result.substring(captureMatch.index + captureFullMatch.length);
    const includeMatch = includePattern.exec(afterCapture);

    if (includeMatch) {
      const alertType = ALERT_TYPE_MAP[`alert_${includeMatch[1]}`] || 'note';
      stats.captureAlertConverted++;

      // Remove the capture block
      result = result.replace(captureFullMatch, '');
      // Replace the include with admonition (only the first occurrence after removal)
      result = result.replace(includeMatch[0], `:::${alertType}\n${captureContent}\n:::`);
      changed = true;
    } else {
      // Capture exists but no matching include — leave the capture as-is and break
      // to avoid infinite loop. The fallback handler will flag it.
      break;
    }
  }

  return result;
}

/** Stage 7: Rewrite links */
function rewriteLinks(body, stats) {
  let result = body;

  // Replace {{ site.baseurl }}/path with /path
  const baseUrlPattern = /\{\{\s*site\.baseurl\s*\}\}/g;
  const baseUrlMatches = result.match(baseUrlPattern);
  if (baseUrlMatches) {
    stats.linksRewritten += baseUrlMatches.length;
    result = result.replace(baseUrlPattern, '');
  }

  // Replace {{ site.github.url }}/path with the GitHub URL
  const githubUrlPattern = /\{\{\s*site\.github\.url\s*\}\}/g;
  const githubMatches = result.match(githubUrlPattern);
  if (githubMatches) {
    stats.linksRewritten += githubMatches.length;
    result = result.replace(githubUrlPattern, '');
  }

  // Remove .html from internal markdown links: [text](/path.html) → [text](/path)
  // But preserve .html in external URLs (http/https) and anchor-only refs
  // Match markdown links: [text](path.html) where path starts with / or is relative (no http)
  const htmlExtPattern = /(\[(?:[^\]]*)\]\()((?!https?:\/\/)(?:[^)]*?))\.html(\s*(?:[^)]*))(\))/g;
  const htmlMatches = result.match(htmlExtPattern);
  if (htmlMatches) {
    stats.linksRewritten += htmlMatches.length;
  }
  result = result.replace(htmlExtPattern, '$1$2$3$4');

  // Also handle href="path.html" in HTML links (but not external)
  const hrefPattern = /(href=")((?!https?:\/\/)(?:[^"]*?))\.html(")/g;
  const hrefMatches = result.match(hrefPattern);
  if (hrefMatches) {
    stats.linksRewritten += hrefMatches.length;
  }
  result = result.replace(hrefPattern, '$1$2$3');

  return result;
}

/** Stage 7b: Escape autolinks for MDX compatibility */
function escapeAutolinks(body, stats) {
  let result = body;

  // MDX v3 parses <email@domain> as JSX tags. Convert to markdown links.
  const emailPattern = /<([\w.+-]+@[\w.-]+\.\w+)>/g;
  const emailMatches = result.match(emailPattern);
  if (emailMatches) {
    stats.linksRewritten += emailMatches.length;
    result = result.replace(emailPattern, '[$1](mailto:$1)');
  }

  // MDX v3 also can't parse <https://url> autolinks. Convert to markdown links.
  const urlPattern = /<(https?:\/\/[^>]+)>/g;
  const urlMatches = result.match(urlPattern);
  if (urlMatches) {
    stats.linksRewritten += urlMatches.length;
    result = result.replace(urlPattern, '[$1]($1)');
  }

  return result;
}

/** Stage 7c: Convert indented code blocks to fenced code blocks for MDX */
function convertIndentedCodeBlocks(body, stats) {
  // MDX v3 may evaluate indented code blocks as expressions.
  // Convert 4-space indented blocks to fenced code blocks.
  const lines = body.split('\n');
  const result = [];
  let inCodeBlock = false;
  let codeLines = [];
  let inFencedBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track fenced code blocks to avoid double-converting
    if (line.match(/^```/)) {
      inFencedBlock = !inFencedBlock;
      if (inCodeBlock) {
        // Flush accumulated indented code before the fence
        result.push('```');
        result.push(...codeLines.map(l => l.replace(/^ {4}/, '')));
        result.push('```');
        codeLines = [];
        inCodeBlock = false;
      }
      result.push(line);
      continue;
    }

    if (inFencedBlock) {
      result.push(line);
      continue;
    }

    const isIndented = line.match(/^ {4}\S/);
    const isBlank = line.trim() === '';

    if (isIndented && !inCodeBlock) {
      // Start of indented code block
      inCodeBlock = true;
      codeLines = [line];
    } else if (inCodeBlock && (isIndented || (isBlank && i + 1 < lines.length && lines[i + 1].match(/^ {4}\S/)))) {
      // Continue indented code block (including blank lines within)
      codeLines.push(line);
    } else if (inCodeBlock) {
      // End of indented code block
      result.push('```');
      result.push(...codeLines.map(l => l.replace(/^ {4}/, '')));
      result.push('```');
      stats.linksRewritten += 0; // Not tracked separately, but block was converted
      codeLines = [];
      inCodeBlock = false;
      result.push(line);
    } else {
      result.push(line);
    }
  }

  // Flush any remaining code block
  if (inCodeBlock) {
    result.push('```');
    result.push(...codeLines.map(l => l.replace(/^ {4}/, '')));
    result.push('```');
  }

  return result.join('\n');
}

/** Stage 8: Rewrite image paths */
function rewriteImages(body, stats) {
  let result = body;

  // {{ site.baseurl }}/assets/images/ → /images/
  const pattern1 = /\{\{\s*site\.baseurl\s*\}\}\/assets\/images\//g;
  const matches1 = result.match(pattern1);
  if (matches1) {
    stats.imagesRewritten += matches1.length;
    result = result.replace(pattern1, '/images/');
  }

  // Any remaining /assets/images/ → /images/ (after baseurl already removed)
  const pattern2 = /(?<!\{)\/assets\/images\//g;
  const matches2 = result.match(pattern2);
  if (matches2) {
    stats.imagesRewritten += matches2.length;
    result = result.replace(pattern2, '/images/');
  }

  return result;
}

/** Stage 9: Inline simple includes */
function inlineSimpleIncludes(body, stats) {
  let result = body;

  // loads-external-javascript.md
  const loadsExtPattern = /\{%\s*include\s+dev-docs\/loads-external-javascript\.md\s*%\}/g;
  const loadsExtMatches = result.match(loadsExtPattern);
  if (loadsExtMatches) {
    stats.includesInlined += loadsExtMatches.length;
    result = result.replace(loadsExtPattern,
      ':::warning Disclosure\nThis module loads external code that is not open source and has not been reviewed by Prebid.org.\n:::');
  }

  // vendor-exception.md with gvlId parameter
  const vendorWithGvlPattern = /\{%\s*include\s+dev-docs\/vendor-exception\.md\s+gvlId="(\d+)"\s*%\}/g;
  result = result.replace(vendorWithGvlPattern, (match, gvlId) => {
    stats.includesInlined++;
    return `:::warning\nPrebid.org recommends working with a privacy lawyer before making enforcement exceptions for any vendor. We recommend publishers let Prebid.js make use of their registered GVL ID ${gvlId} instead of a vendor exception.\n:::`;
  });

  // vendor-exception.md without gvlId
  const vendorPattern = /\{%\s*include\s+dev-docs\/vendor-exception\.md\s*%\}/g;
  const vendorMatches = result.match(vendorPattern);
  if (vendorMatches) {
    stats.includesInlined += vendorMatches.length;
    result = result.replace(vendorPattern,
      ':::warning\nPrebid.org recommends working with a privacy lawyer before making enforcement exceptions for any vendor.\n:::');
  }

  return result;
}

/** Stage 10: Handle component includes (legal-warning → LegalWarning) */
function handleComponentIncludes(body, stats) {
  let result = body;
  let needsMdx = false;

  // legal-warning.html → <LegalWarning />
  const legalPattern = /\{%\s*include\s+legal-warning\.html\s*%\}/g;
  const legalMatches = result.match(legalPattern);
  if (legalMatches) {
    stats.componentIncludes += legalMatches.length;
    result = result.replace(legalPattern, '<LegalWarning />');
    needsMdx = true;
  }

  return { body: result, needsMdx, imports: needsMdx ? ["import { LegalWarning } from '@site/src/components/DevDocs';"] : [] };
}

/** Stage 11: Fallback for remaining includes */
function handleFallbackIncludes(body, stats) {
  let result = body;
  let needsMdx = false;
  const imports = [];

  // Match any remaining {% include ... %} patterns
  const includePattern = /\{%\s*include\s+([^%]+?)\s*%\}/g;
  let match;
  const remaining = [];

  while ((match = includePattern.exec(result)) !== null) {
    remaining.push(match[0]);
  }

  if (remaining.length > 0) {
    stats.fallbackIncludes += remaining.length;
    needsMdx = true;
    imports.push("import IncludeTodo from '@site/src/components/IncludeTodo';");

    for (const include of remaining) {
      // Escape the include string for JSX prop
      const escaped = include.replace(/'/g, "\\'");
      result = result.replace(include, `<IncludeTodo include={'${escaped}'} />`);
    }
  }

  return { body: result, needsMdx, imports };
}

/** Check if a file should be skipped (manual conversion required) */
function shouldSkip(content) {
  // Files with site.pages queries
  if (/site\.pages/.test(content)) return 'Uses site.pages queries (manual conversion required)';
  // Files with {% for ... in ... %} page iteration
  if (/\{%\s*for\s+\w+\s+in\s+\w+_pages/.test(content)) return 'Uses page iteration loops (manual conversion required)';
  return false;
}

/** Check for remaining Jekyll patterns after transformation */
function checkRemainingPatterns(content) {
  const patterns = [];
  const liquidTags = content.match(/\{%[^%]*%\}/g);
  if (liquidTags) {
    patterns.push(`${liquidTags.length} remaining Liquid tag(s)`);
  }
  const liquidVars = content.match(/\{\{[^}]*\}\}/g);
  if (liquidVars) {
    // Filter out things inside code blocks
    const outsideCode = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
    const realVars = outsideCode.match(/\{\{[^}]*\}\}/g);
    if (realVars) {
      patterns.push(`${realVars.length} remaining Liquid variable(s)`);
    }
  }
  return patterns;
}

// ── Main processing ─────────────────────────────────────────────────────────

function processFile(srcPath, destPath) {
  const relativeSrc = path.relative(process.cwd(), srcPath);
  const relativeDest = path.relative(process.cwd(), destPath);

  if (VERBOSE) console.log(`\nProcessing: ${relativeSrc}`);

  const content = fs.readFileSync(srcPath, 'utf-8');

  // Check if file should be skipped
  const skipReason = shouldSkip(content);
  if (skipReason) {
    report.skippedManual.push({ file: relativeSrc, reason: skipReason });
    if (VERBOSE) console.log(`  SKIP: ${skipReason}`);
    return;
  }

  // Check for destination conflict
  if (fs.existsSync(destPath)) {
    report.skippedConflict.push({ file: relativeSrc, dest: relativeDest });
    if (VERBOSE) console.log(`  SKIP: Destination already exists: ${relativeDest}`);
    return;
  }

  // Split frontmatter and body
  let { frontmatter, body, hasFrontmatter } = splitFrontmatter(content);

  // Stage 1: Clean frontmatter
  if (hasFrontmatter) {
    frontmatter = cleanFrontmatter(frontmatter, report.transformations);
  }

  // Stage 2: Remove TOC markers
  body = removeTocMarkers(body, report.transformations);

  // Stage 3: Remove CSS classes
  body = removeCssClasses(body, report.transformations);

  // Stage 4: Convert inline alerts
  body = convertInlineAlerts(body, report.transformations);

  // Stage 5: Convert alert includes with string content
  body = convertAlertIncludes(body, report.transformations);

  // Stage 6: Convert capture + alert patterns
  body = convertCaptureAlerts(body, report.transformations);

  // Stage 7: Rewrite links
  body = rewriteLinks(body, report.transformations);

  // Stage 7b: Escape autolinks for MDX
  body = escapeAutolinks(body, report.transformations);

  // Stage 7c: Convert indented code blocks to fenced code blocks
  // DISABLED: With markdown.format: 'detect' in docusaurus.config.ts,
  // .md files use CommonMark which handles indented code blocks fine.
  // .mdx files shouldn't have this transformation as it corrupts
  // indented fenced blocks inside list items.
  // body = convertIndentedCodeBlocks(body, report.transformations);

  // Stage 8: Rewrite image paths
  body = rewriteImages(body, report.transformations);

  // Stage 9: Inline simple includes
  body = inlineSimpleIncludes(body, report.transformations);

  // Stage 10: Handle component includes
  const componentResult = handleComponentIncludes(body, report.transformations);
  body = componentResult.body;
  let needsMdx = componentResult.needsMdx;
  const allImports = [...componentResult.imports];

  // Stage 11: Fallback includes
  const fallbackResult = handleFallbackIncludes(body, report.transformations);
  body = fallbackResult.body;
  if (fallbackResult.needsMdx) needsMdx = true;
  allImports.push(...fallbackResult.imports);

  // Add imports at the top of body (after frontmatter)
  if (allImports.length > 0) {
    const uniqueImports = [...new Set(allImports)];
    body = '\n' + uniqueImports.join('\n') + '\n' + body;
  }

  // Reconstruct file
  let finalContent = hasFrontmatter ? joinFrontmatter(frontmatter, body) : body;

  // Clean up excessive blank lines (3+ consecutive blank lines → 2)
  finalContent = finalContent.replace(/\n{4,}/g, '\n\n\n');

  // Determine final file extension
  let finalDest = destPath;
  if (needsMdx && finalDest.endsWith('.md')) {
    finalDest = finalDest.replace(/\.md$/, '.mdx');
    report.renamedToMdx.push(relativeDest.replace(/\.md$/, '.mdx'));
  }

  // Check for remaining patterns
  const remaining = checkRemainingPatterns(finalContent);
  if (remaining.length > 0) {
    report.flaggedManual.push({ file: path.relative(process.cwd(), finalDest), issues: remaining });
  }

  // Execute
  if (DRY_RUN) {
    if (VERBOSE) {
      console.log(`  Would move: ${relativeSrc} → ${path.relative(process.cwd(), finalDest)}`);
      if (needsMdx) console.log(`  Would rename to .mdx`);
      if (remaining.length > 0) console.log(`  FLAGS: ${remaining.join(', ')}`);
    }
  } else {
    // Ensure destination directory exists
    fs.mkdirSync(path.dirname(finalDest), { recursive: true });

    if (!SKIP_GIT_MV) {
      // git mv source to dest
      execSync(`git mv "${srcPath}" "${destPath}"`, { stdio: 'pipe' });
      // If needs mdx rename
      if (needsMdx && destPath !== finalDest) {
        execSync(`git mv "${destPath}" "${finalDest}"`, { stdio: 'pipe' });
      }
    }

    // Write transformed content
    fs.writeFileSync(finalDest, finalContent, 'utf-8');
  }

  report.transformed++;
}

// ── Entry point ─────────────────────────────────────────────────────────────

function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  Prebid.js Migration Script`);
  console.log(`  Source: ${path.relative(process.cwd(), SOURCE_DIR)}`);
  console.log(`  Dest:   ${path.relative(process.cwd(), DEST_DIR)}`);
  console.log(`  Mode:   ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`${'='.repeat(60)}\n`);

  // Find all .md files in source directory (not recursing into subdirectories
  // unless the source IS a leaf directory)
  let files;
  const sourceArg = args.source;

  // Check if source points to a directory with subdirectories we should NOT recurse into
  // (e.g., dev-docs/modules/ has userid-submodules/ which is a separate batch)
  const entries = fs.readdirSync(SOURCE_DIR, { withFileTypes: true });
  files = entries
    .filter(e => e.isFile() && e.name.endsWith('.md'))
    .map(e => e.name);

  // Also handle subdirectory migration if the source contains only dirs+files
  // For explicit subdirectory sources like dev-docs/modules/userid-submodules,
  // this naturally works since we only look at .md files in the directory

  report.totalFiles = files.length;
  console.log(`Found ${files.length} .md files to process.\n`);

  for (const file of files.sort()) {
    const srcPath = path.join(SOURCE_DIR, file);
    const destPath = path.join(DEST_DIR, file);
    processFile(srcPath, destPath);
  }

  // Print report
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  Migration Report ${DRY_RUN ? '(DRY RUN)' : ''}`);
  console.log(`${'='.repeat(60)}\n`);

  console.log(`Total files:        ${report.totalFiles}`);
  console.log(`Transformed:        ${report.transformed}`);
  console.log(`Skipped (manual):   ${report.skippedManual.length}`);
  console.log(`Skipped (conflict): ${report.skippedConflict.length}`);
  console.log(`Flagged for review: ${report.flaggedManual.length}`);
  console.log(`Renamed to .mdx:    ${report.renamedToMdx.length}`);

  if (report.skippedManual.length > 0) {
    console.log(`\n--- Skipped (manual conversion required) ---`);
    for (const s of report.skippedManual) {
      console.log(`  ${s.file}: ${s.reason}`);
    }
  }

  if (report.skippedConflict.length > 0) {
    console.log(`\n--- Skipped (destination conflict) ---`);
    for (const s of report.skippedConflict) {
      console.log(`  ${s.file} → ${s.dest} (already exists)`);
    }
  }

  if (report.flaggedManual.length > 0) {
    console.log(`\n--- Flagged for manual review ---`);
    for (const f of report.flaggedManual) {
      console.log(`  ${f.file}: ${f.issues.join(', ')}`);
    }
  }

  if (report.renamedToMdx.length > 0) {
    console.log(`\n--- Renamed to .mdx ---`);
    for (const r of report.renamedToMdx) {
      console.log(`  ${r}`);
    }
  }

  console.log(`\n--- Transformations Applied ---`);
  const t = report.transformations;
  console.log(`  Frontmatter lines removed: ${t.frontmatterLinesRemoved}`);
  console.log(`  TOC markers removed:       ${t.tocMarkersRemoved}`);
  console.log(`  CSS classes removed:        ${t.cssClassesRemoved}`);
  console.log(`  Inline alerts converted:    ${t.inlineAlertsConverted}`);
  console.log(`  Alert includes converted:   ${t.alertIncludesConverted}`);
  console.log(`  Capture+alert converted:    ${t.captureAlertConverted}`);
  console.log(`  Links rewritten:            ${t.linksRewritten}`);
  console.log(`  Images rewritten:           ${t.imagesRewritten}`);
  console.log(`  Includes inlined:           ${t.includesInlined}`);
  console.log(`  Component includes:         ${t.componentIncludes}`);
  console.log(`  Fallback includes:          ${t.fallbackIncludes}`);

  // Write JSON report
  const reportPath = path.resolve('scripts/migration-report.json');
  if (!DRY_RUN) {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\nJSON report written to: ${path.relative(process.cwd(), reportPath)}`);
  }

  console.log('');
}

main();
