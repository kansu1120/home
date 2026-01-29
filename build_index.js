const fs = require("fs");
const path = require("path");

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith(".md")) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Extract title from markdown content
 * Looks for frontmatter title first, then first heading
 */
function extractTitle(content, filename) {
  // Check for frontmatter title
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/title:\s*(.+)/);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
  }
  
  // Look for first heading
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }
  
  // Fall back to filename without extension
  return path.basename(filename, ".md");
}

/**
 * Generate relative URL from file path
 */
function generateUrl(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath);
  return relativePath.replace(/\.md$/, ".html").replace(/\\/g, "/");
}

/**
 * Clean and process content for search indexing
 */
function cleanContent(content) {
  // Remove frontmatter
  content = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
  
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, " ");
  
  // Remove inline code
  content = content.replace(/`[^`]+`/g, " ");
  
  // Remove markdown links but keep text
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  
  // Remove images
  content = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");
  
  // Remove HTML tags
  content = content.replace(/<[^>]+>/g, " ");
  
  // Remove headings markers
  content = content.replace(/^#{1,6}\s+/gm, "");
  
  // Replace multiple whitespace with single space
  content = content.replace(/\s+/g, " ");
  
  return content.trim();
}

// Main execution
const ALL_DIR = path.join(__dirname, "all");
const OUTPUT_PATH = path.join(__dirname, "library", "search_index.json");

console.log("Starting search index generation...");
console.log(`Scanning directory: ${ALL_DIR}`);

// Find all markdown files in the 'all' directory
const markdownFiles = findMarkdownFiles(ALL_DIR);
console.log(`Found ${markdownFiles.length} markdown files`);

// Process each file
const indexData = markdownFiles.map(filePath => {
  const content = fs.readFileSync(filePath, "utf8");
  const title = extractTitle(content, filePath);
  const url = generateUrl(filePath, __dirname);
  const cleanedContent = cleanContent(content);
  
  return {
    title: title,
    url: url,
    content: cleanedContent
  };
});

// Sort by title for consistency
indexData.sort((a, b) => a.title.localeCompare(b.title));

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the index file
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(indexData, null, 2));

console.log(`Successfully generated ${OUTPUT_PATH}`);
console.log(`Indexed ${indexData.length} files`);
