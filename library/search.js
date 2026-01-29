function normalizeText(text) {
  if (!text) return '';
  
  // Convert to lowercase first
  text = text.toLowerCase();
  
  // Normalize full-width alphanumeric and symbols to half-width
  text = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  
  // Normalize hiragana to katakana for kana-insensitive search
  text = text.replace(/[\u3041-\u3096]/g, s => {
    return String.fromCharCode(s.charCodeAt(0) + 0x60);
  });
  
  // Normalize half-width katakana to full-width katakana
  const halfToFull = {
    'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
    'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
    'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
    'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
    'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
    'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
    'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
    'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
    'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
    'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
    'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
    'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
    'ｰ': 'ー', '｡': '。', '｢': '「', '｣': '」', '､': '、', '･': '・'
  };
  
  // Handle voiced marks (dakuten/handakuten)
  text = text.replace(/ｶﾞ/g, 'ガ').replace(/ｷﾞ/g, 'ギ').replace(/ｸﾞ/g, 'グ').replace(/ｹﾞ/g, 'ゲ').replace(/ｺﾞ/g, 'ゴ');
  text = text.replace(/ｻﾞ/g, 'ザ').replace(/ｼﾞ/g, 'ジ').replace(/ｽﾞ/g, 'ズ').replace(/ｾﾞ/g, 'ゼ').replace(/ｿﾞ/g, 'ゾ');
  text = text.replace(/ﾀﾞ/g, 'ダ').replace(/ﾁﾞ/g, 'ヂ').replace(/ﾂﾞ/g, 'ヅ').replace(/ﾃﾞ/g, 'デ').replace(/ﾄﾞ/g, 'ド');
  text = text.replace(/ﾊﾞ/g, 'バ').replace(/ﾋﾞ/g, 'ビ').replace(/ﾌﾞ/g, 'ブ').replace(/ﾍﾞ/g, 'ベ').replace(/ﾎﾞ/g, 'ボ');
  text = text.replace(/ﾊﾟ/g, 'パ').replace(/ﾋﾟ/g, 'ピ').replace(/ﾌﾟ/g, 'プ').replace(/ﾍﾟ/g, 'ペ').replace(/ﾎﾟ/g, 'ポ');
  text = text.replace(/ｳﾞ/g, 'ヴ');
  
  // Replace remaining half-width katakana
  text = text.replace(/[ｱ-ﾝｧ-ｮｰ｡｢｣､･]/g, s => halfToFull[s] || s);
  
  return text;
}

fetch("/library/search_index.json")
  .then(res => res.json())
  .then(data => {
    const box = document.getElementById("searchBox");
    const results = document.getElementById("searchResults");

    box.addEventListener("input", () => {
      const q = normalizeText(box.value);
      results.innerHTML = "";

      if (q === "") return;

      data.forEach(page => {
        // Use normalized fields if available, fallback to toLowerCase
        const titleNorm = page.title_normalized || page.title.toLowerCase();
        const contentNorm = page.content_normalized || page.content.toLowerCase();
        
        if (titleNorm.includes(q) || contentNorm.includes(q)) {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = page.url;
          a.textContent = page.title;
          li.appendChild(a);
          results.appendChild(li);
        }
      });
    });
  });