#!/usr/bin/env node

/**
 * DevFlow Log Merge - Intelligently merge development logs
 *
 * Usage:
 *   devflow-log-merge list              - List all log files
 *   devflow-log-merge merge [date]      - Merge logs to target date
 *   devflow-log-merge today             - View today's log
 *   devflow-log-merge help              - Show help
 *
 * Environment:
 *   OBSIDIAN_VAULT  - Obsidian vault path (required)
 *   LOG_PREFIX      - Log file prefix (default: project name from package.json)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const VAULT_PATH = process.env.OBSIDIAN_VAULT;
const LOG_PREFIX = process.env.LOG_PREFIX || 'DevLog';

if (!VAULT_PATH) {
  console.error('Error: OBSIDIAN_VAULT environment variable not set');
  console.error('Usage: export OBSIDIAN_VAULT=/path/to/your/obsidian/vault');
  process.exit(1);
}

if (!fs.existsSync(VAULT_PATH)) {
  console.error(`Error: Vault directory does not exist: ${VAULT_PATH}`);
  process.exit(1);
}

// Get date string
function getDateString(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// Get all log files
function getLogFiles() {
  const files = fs.readdirSync(VAULT_PATH);
  return files
    .filter(f => f.startsWith(LOG_PREFIX) || f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
    .map(f => ({
      name: f,
      path: path.join(VAULT_PATH, f),
      mtime: fs.statSync(path.join(VAULT_PATH, f)).mtime,
      size: fs.statSync(path.join(VAULT_PATH, f)).size
    }))
    .sort((a, b) => b.mtime - a.mtime);
}

// Merge log content
function mergeLogs(sourceFiles, targetDate) {
  const sections = new Map();

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file.path, 'utf-8');
    const date = file.name.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || 'unknown';

    const lines = content.split('\n');
    let currentSection = '';

    for (const line of lines) {
      if (line.startsWith('## ') || line.startsWith('### ')) {
        currentSection = line;
        if (!sections.has(currentSection)) {
          sections.set(currentSection, []);
        }
      }
      if (currentSection && line.trim()) {
        sections.get(currentSection).push({ date, line });
      }
    }
  }

  let merged = `# ${LOG_PREFIX} Merged Log\n\n`;
  merged += `**Merge Date**: ${targetDate}\n`;
  merged += `**Source Files**: ${sourceFiles.length}\n\n`;
  merged += `---\n\n`;

  for (const [section, lines] of sections) {
    merged += `${section}\n`;
    const uniqueLines = [...new Set(lines.map(l => l.line))];
    for (const line of uniqueLines) {
      if (!line.startsWith('## ') && !line.startsWith('### ')) {
        merged += `${line}\n`;
      }
    }
    merged += '\n';
  }

  return merged;
}

// Main
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'list': {
      const files = getLogFiles();
      console.log(`Log files in ${VAULT_PATH}:\n`);
      files.forEach((f, i) => {
        const sizeKB = (f.size / 1024).toFixed(1);
        console.log(`  ${i + 1}. ${f.name} (${f.mtime.toISOString().split('T')[0]}, ${sizeKB}KB)`);
      });
      console.log(`\nTotal: ${files.length} files`);
      break;
    }

    case 'merge': {
      const targetDate = args[1] || getDateString();
      const targetPath = path.join(VAULT_PATH, `${targetDate}.md`);

      const logFiles = getLogFiles().filter(f => f.name !== `${targetDate}.md`);
      if (logFiles.length === 0) {
        console.log('No log files to merge');
        return;
      }

      const mergedContent = mergeLogs(logFiles, targetDate);
      fs.writeFileSync(targetPath, mergedContent);
      console.log(`Merged ${logFiles.length} log files to ${targetPath}`);
      break;
    }

    case 'today': {
      const todayPath = path.join(VAULT_PATH, `${getDateString()}.md`);
      if (fs.existsSync(todayPath)) {
        const content = fs.readFileSync(todayPath, 'utf-8');
        console.log(`Today's log: ${todayPath}`);
        console.log(`Size: ${(content.length / 1024).toFixed(1)}KB\n`);
        console.log(content.slice(0, 800));
        if (content.length > 800) console.log('\n... (truncated)');
      } else {
        console.log('No log for today. Use "merge" to create one.');
      }
      break;
    }

    case 'help':
    default: {
      console.log(`
DevFlow Log Merge - Development log intelligent merge tool

Usage:
  devflow-log-merge <command> [options]

Commands:
  list              List all log files in vault
  merge [date]      Merge logs to target date (default: today)
  today             View today's log
  help              Show this help

Environment:
  OBSIDIAN_VAULT    Obsidian vault path (required)
  LOG_PREFIX        Log file prefix (default: "DevLog")

Examples:
  export OBSIDIAN_VAULT=~/obsidian/my-vault
  devflow-log-merge list
  devflow-log-merge merge
  devflow-log-merge merge 2026-04-10
  devflow-log-merge today
`);
      break;
    }
  }
}

main();
