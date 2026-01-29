const fs = require("fs");
const path = require("path");

/**
 * ディレクトリ内の全てのマークダウンファイルを再帰的に検索
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
 * マークダウンコンテンツからタイトルを抽出
 * フロントマターのタイトル、最初の見出し、ファイル名の順で取得を試行
 */
function extractTitle(content, filename) {
  // フロントマターのタイトルをチェック
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/title:\s*(.+)/);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
  }
  
  // 最初の見出しを検索
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }
  
  // ファイル名（拡張子なし）にフォールバック
  return path.basename(filename, ".md");
}

/**
 * ファイルパスから相対URLを生成
 */
function generateUrl(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath);
  return relativePath.replace(/\.md$/, ".html").replace(/\\/g, "/");
}

/**
 * 検索インデックス用にコンテンツをクリーンアップして処理
 */
function cleanContent(content) {
  // フロントマターを削除
  content = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
  
  // コードブロックを削除
  content = content.replace(/```[\s\S]*?```/g, " ");
  
  // インラインコードを削除
  content = content.replace(/`[^`]+`/g, " ");
  
  // マークダウンリンクのテキストのみ保持
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  
  // 画像を削除
  content = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");
  
  // HTMLタグを削除
  content = content.replace(/<[^>]+>/g, " ");
  
  // 見出しマーカーを削除
  content = content.replace(/^#{1,6}\s+/gm, "");
  
  // 複数の空白を単一のスペースに置換
  content = content.replace(/\s+/g, " ");
  
  return content.trim();
}

// メイン処理
const ALL_DIR = path.join(__dirname, "all");
const OUTPUT_PATH = path.join(__dirname, "library", "search_index.json");

console.log("検索インデックスの生成を開始します...");
console.log(`スキャン対象ディレクトリ: ${ALL_DIR}`);

// 'all'ディレクトリ内の全マークダウンファイルを検索
const markdownFiles = findMarkdownFiles(ALL_DIR);
console.log(`${markdownFiles.length}個のマークダウンファイルを発見しました`);

// 各ファイルを処理
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

// タイトルでソート（一貫性のため）
indexData.sort((a, b) => a.title.localeCompare(b.title));

// 出力ディレクトリが存在することを確認
const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// インデックスファイルを書き込み
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(indexData, null, 2));

console.log(`${OUTPUT_PATH}を正常に生成しました`);
console.log(`${indexData.length}個のファイルをインデックス化しました`);
