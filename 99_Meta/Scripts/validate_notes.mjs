import fs from "node:fs/promises";
import path from "node:path";
import { validate as validateAlgorithm } from "./validators/algorithm.mjs";
import { validate as validateAudit } from "./validators/audit.mjs";
import { validate as validateChecklist } from "./validators/checklist.mjs";
import { validate as validateConcept } from "./validators/concept.mjs";
import { validate as validateGuide } from "./validators/guide.mjs";
import { validate as validateMeeting } from "./validators/meeting.mjs";
import { validate as validateMentalModel } from "./validators/mental_model.mjs";
import { validate as validateMethod } from "./validators/method.mjs";
import { validate as validatePattern } from "./validators/pattern.mjs";
import { validate as validateProject } from "./validators/project.mjs";
import { validate as validateStrategy } from "./validators/strategy.mjs";
import { validate as validateTechnique } from "./validators/technique.mjs";
import { validate as validateVocab } from "./validators/vocab.mjs";

const rootDir = process.cwd();
const validatorsRegistry = {
  "type/concept": validateConcept,
  "type/pattern": validatePattern,
  "type/mental-model": validateMentalModel,
  "type/vocab": validateVocab,
  "type/project": validateProject,
  "type/meeting": validateMeeting,
  "type/method": validateMethod,
  "type/checklist": validateChecklist,
  "type/guide": validateGuide,
  "type/algorithm": validateAlgorithm,
  "type/audit": validateAudit,
  "type/strategy": validateStrategy,
  "type/technique": validateTechnique,
};
let declaredTagsSet = null;
async function getDeclaredTags() {
  if (declaredTagsSet) return declaredTagsSet;
  try {
    const ssotPath = path.join(rootDir, "99_Meta", "Tag_Taxonomy_SSOT.md");
    const content = await fs.readFile(ssotPath, "utf8");
    const matches = content.match(/`([a-z0-9_\-/]+)`/gi) || [];
    declaredTagsSet = new Set(
      matches.map((m) => m.replace(/`/g, "").toLowerCase()),
    );
  } catch (e) {
    declaredTagsSet = new Set();
  }
  return declaredTagsSet;
}

// Colors for console
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const ignoredDirs = [
  "00_Inbox",
  "10_Projects",
  "40_Archives",
  "50_Flashcards",
  "99_Meta",
  ".git",
  ".obsidian",
  ".agents",
  "node_modules",
];

async function getMarkdownFiles(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      if (!ignoredDirs.includes(file.name)) {
        results = results.concat(await getMarkdownFiles(res));
      }
    } else if (
      file.isFile() &&
      file.name.endsWith(".md") &&
      !file.name.includes("MOC") &&
      !file.name.includes("Template")
    ) {
      const relative = path.relative(rootDir, res);
      // Only include files in subfolders, skip root level notes/meta-files
      if (relative.includes(path.sep)) {
        results.push(res);
      }
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const block = match[1];
  const lines = block.split(/\r?\n/);
  const yaml = {};
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      yaml[key] = val;
    }
  }
  // Robust parsing of tags if multiline or formatted
  const tagsMatch = block.match(/tags:\s*([\s\S]*?)(?=\r?\n\w+:|$)/);
  if (tagsMatch) {
    let tagsStr = tagsMatch[1].trim();
    // Clean up brackets, newlines, and list dash markers
    tagsStr = tagsStr
      .replace(/[[\]]/g, "")
      .replace(/^\s*-\s*/gm, "")
      .split(/[\s,\n\r]+/)
      .filter(Boolean)
      .join(", ");
    yaml.tags = tagsStr;
  }
  return yaml;
}

async function validateFile(filePath) {
  const relativePath = path.relative(rootDir, filePath);
  try {
    const content = await fs.readFile(filePath, "utf8");
    const errors = [];
    const warnings = [];

    // 0. Empty file check
    if (content.trim() === "") {
      warnings.push("File is completely empty");
      return { path: relativePath, errors, warnings, isPlaceholder: true };
    }

    // 1. YAML frontmatter check
    const isDailyLog = relativePath.startsWith("20_Areas/Daily_Logs");
    const isResource = relativePath.startsWith("30_Resources/");
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
      if (isResource) {
        errors.push(
          "Missing or invalid YAML frontmatter (must start and end with '---') for resource note",
        );
        return { path: relativePath, errors, warnings, isPlaceholder: false };
      } else if (isDailyLog) {
        // Daily logs don't require frontmatter
      } else {
        // Outside resources and not a daily log, skip validation as it is not a standard atomic note
        return { path: relativePath, errors, warnings, isPlaceholder: false };
      }
    }

    // Check tags
    if (frontmatter) {
      if (!frontmatter.tags && isResource) {
        errors.push("Missing 'tags' in frontmatter");
      } else if (
        frontmatter.tags === "[]" ||
        (frontmatter.tags && frontmatter.tags.trim() === "")
      ) {
        errors.push("'tags' is empty");
      }

      // Validate tags against Tag_Taxonomy_SSOT.md
      const declared = await getDeclaredTags();
      if (declared.size > 0 && frontmatter.tags) {
        let rawTagsList = [];
        if (Array.isArray(frontmatter.tags)) {
          rawTagsList = frontmatter.tags;
        } else if (typeof frontmatter.tags === "string") {
          rawTagsList = frontmatter.tags
            .replace(/^\[|\]$/g, "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        }
        for (const tagItem of rawTagsList) {
          const cleanTag = tagItem.toLowerCase();
          if (cleanTag && !declared.has(cleanTag)) {
            warnings.push(
              `Undeclared tag '${tagItem}' in frontmatter. Please declare it in 99_Meta/Tag_Taxonomy_SSOT.md`,
            );
          }
        }
      }
    }

    const tags = frontmatter ? frontmatter.tags || "" : "";
    const hasTypeTag = tags.includes("type/");

    if (!isResource && !isDailyLog && !hasTypeTag) {
      // Skip validation for files outside resources and daily logs that do not have a type tag
      return { path: relativePath, errors, warnings, isPlaceholder: false };
    }

    const isPlaceholder =
      tags.includes("status/todo") ||
      /^\s*[-*]\s*TODO\s*:/im.test(content) ||
      content.includes("Ghi chú chờ (Placeholder)");
    // 2. Heading 1 check
    const hasH1 = /^#\s+.+/m.test(content);
    if (!hasH1) {
      errors.push("Missing top-level heading (# Title)");
    }
    // Check for emojis/icons (No-Emoji policy)
    const emojiRegex =
      /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/u;
    if (emojiRegex.test(content)) {
      warnings.push(
        "Note contains emojis or icons, violating the No-Emoji policy.",
      );
    }

    // Check for raw template instruction markers
    if (content.includes("[BẮT BUỘC]") || content.includes("[TÙY CHỌN]")) {
      errors.push(
        "Note still contains raw template instruction markers ('[BẮT BUỘC]' or '[TÙY CHỌN]')",
      );
    }

    if (!isPlaceholder) {
      // Check for Daily Logs path
      if (relativePath.startsWith("20_Areas/Daily_Logs")) {
        const hasWhatNext = /^##\s+What next\??/im.test(content);
        if (!hasWhatNext) {
          errors.push("Daily Log is missing '## What next?' section");
        }
      } else {
        let hasSpecificValidator = false;
        for (const [tag, validateFn] of Object.entries(validatorsRegistry)) {
          if (tags.includes(tag)) {
            hasSpecificValidator = true;
            const res = validateFn(content, { tags, relativePath });
            if (res.errors) errors.push(...res.errors);
            if (res.warnings) warnings.push(...res.warnings);
          }
        }

        if (!hasSpecificValidator) {
          // Fallback to standard generic checks if it has no type tag
          const hasTldr = /^##\s+TL;DR/m.test(content);
          if (!hasTldr) {
            errors.push("Missing '## TL;DR' section");
          }
        }

        // Standard check for secondary headings in general
        const hasH2 = /^##\s+.+/m.test(content);
        if (!hasH2) {
          warnings.push("No secondary headings (##) found");
        }
      }
    } else {
      // For placeholders
      if (
        !content.includes("TODO") &&
        !content.includes("placeholder") &&
        !content.includes("Placeholder")
      ) {
        warnings.push(
          "Note has placeholder status but no TODO tag or explanation in content",
        );
      }
    }

    return { path: relativePath, errors, warnings, isPlaceholder };
  } catch (err) {
    return {
      path: relativePath,
      errors: [`Error reading file: ${err.message}`],
      warnings: [],
      isPlaceholder: false,
    };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const isJsonMode = args.includes("--json");
  const isVerbose = args.includes("--verbose") || args.includes("-v");
  const fileArgs = args.filter(
    (arg) => arg !== "--json" && arg !== "--verbose" && arg !== "-v",
  );

  if (!isJsonMode) {
    console.log(
      `${colors.cyan}=== Obsidian Atomic Note Validator ===${colors.reset}`,
    );
  }

  let allFiles = [];

  if (fileArgs.length > 0) {
    for (const arg of fileArgs) {
      allFiles.push(path.resolve(rootDir, arg));
    }
  } else {
    try {
      allFiles = await getMarkdownFiles(rootDir);
    } catch (e) {
      if (!isJsonMode) {
        console.error(
          `${colors.red}Error scanning directory: ${e.message}${colors.reset}`,
        );
      }
    }
  }

  let failedCount = 0;
  let passedCount = 0;
  let placeholderCount = 0;
  const jsonResults = [];

  for (const file of allFiles) {
    const result = await validateFile(file);
    const passed = result.errors.length === 0;

    if (isJsonMode) {
      jsonResults.push({
        path: result.path,
        passed,
        errors: result.errors,
        warnings: result.warnings,
        isPlaceholder: result.isPlaceholder,
      });
    }

    if (result.errors.length > 0) {
      failedCount++;
      if (!isJsonMode) {
        console.log(`${colors.red}✗ FAILED: ${result.path}${colors.reset}`);
        for (const err of result.errors) {
          console.log(`  - ERROR: ${err}`);
        }
        for (const warn of result.warnings) {
          console.log(`  - WARNING: ${warn}`);
        }
      }
    } else {
      passedCount++;
      if (result.isPlaceholder) {
        placeholderCount++;
        if (!isJsonMode && isVerbose) {
          console.log(
            `${colors.yellow}⚠ PASSED (Placeholder): ${result.path}${colors.reset}`,
          );
        }
      } else {
        if (!isJsonMode && isVerbose) {
          console.log(`${colors.green}✓ PASSED: ${result.path}${colors.reset}`);
        }
      }
      if (!isJsonMode && isVerbose && result.warnings.length > 0) {
        for (const warn of result.warnings) {
          console.log(`    - WARNING: ${warn}`);
        }
      }
    }
  }

  if (isJsonMode) {
    const jsonOutput = {
      summary: {
        total: allFiles.length,
        passed: passedCount,
        failed: failedCount,
        placeholders: placeholderCount,
      },
      results: jsonResults,
    };
    console.log(JSON.stringify(jsonOutput, null, 2));
  } else {
    if (failedCount === 0) {
      console.log(
        `${colors.green}✓ ALL PASSED: ${allFiles.length} notes scanned cleanly (0 errors, ${placeholderCount} placeholders).${colors.reset}`,
      );
    } else {
      console.log("\n=== Summary ===");
      console.log(`Total scanned: ${allFiles.length}`);
      console.log(
        `Passed:        ${colors.green}${passedCount}${colors.reset} (including ${placeholderCount} placeholders)`,
      );
      console.log(`Failed:        ${colors.red}${failedCount}${colors.reset}`);
    }
  }

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Validator crashed:", err);
  process.exit(1);
});
