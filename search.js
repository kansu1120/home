// Half-width to full-width katakana mapping (defined once for performance)
const HALF_TO_FULL_KANA = {
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
  
  // Handle voiced marks (dakuten/handakuten) - optimized with combined patterns
  text = text.replace(/ｶﾞ|ｷﾞ|ｸﾞ|ｹﾞ|ｺﾞ/g, s => ({'ｶﾞ':'ガ','ｷﾞ':'ギ','ｸﾞ':'グ','ｹﾞ':'ゲ','ｺﾞ':'ゴ'})[s]);
  text = text.replace(/ｻﾞ|ｼﾞ|ｽﾞ|ｾﾞ|ｿﾞ/g, s => ({'ｻﾞ':'ザ','ｼﾞ':'ジ','ｽﾞ':'ズ','ｾﾞ':'ゼ','ｿﾞ':'ゾ'})[s]);
  text = text.replace(/ﾀﾞ|ﾁﾞ|ﾂﾞ|ﾃﾞ|ﾄﾞ/g, s => ({'ﾀﾞ':'ダ','ﾁﾞ':'ヂ','ﾂﾞ':'ヅ','ﾃﾞ':'デ','ﾄﾞ':'ド'})[s]);
  text = text.replace(/ﾊﾞ|ﾋﾞ|ﾌﾞ|ﾍﾞ|ﾎﾞ/g, s => ({'ﾊﾞ':'バ','ﾋﾞ':'ビ','ﾌﾞ':'ブ','ﾍﾞ':'ベ','ﾎﾞ':'ボ'})[s]);
  text = text.replace(/ﾊﾟ|ﾋﾟ|ﾌﾟ|ﾍﾟ|ﾎﾟ/g, s => ({'ﾊﾟ':'パ','ﾋﾟ':'ピ','ﾌﾟ':'プ','ﾍﾟ':'ペ','ﾎﾟ':'ポ'})[s]);
  text = text.replace(/ｳﾞ/g, 'ヴ');
  
  // Replace remaining half-width katakana
  text = text.replace(/[ｱ-ﾝｧ-ｮｰ｡｢｣､･]/g, s => HALF_TO_FULL_KANA[s] || s);
  
  return text;
}

let pages = [];

fetch("search_index.json")
  .then(res => res.json())
  .then(data => {
    pages = data.map(p => ({
      title: p.title,
      url: p.url,
      title_norm: p.title_normalized || normalizeText(p.title),
      content_norm: p.content_normalized || normalizeText(p.content)
    }));
  });

// ★要素ではなく document にイベント
document.addEventListener("input", function(e){
  if(e.target.id !== "searchBox") return;
  
  const q = normalizeText(e.target.value.trim());
  const results = document.getElementById("searchResults");
  results.innerHTML = "";
  
  if(!q) return;
  
  let count = 0;
  for(const page of pages){
    if(page.title_norm.includes(q) || page.content_norm.includes(q)){
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = page.url;
      a.textContent = page.title;
      li.appendChild(a);
      results.appendChild(li);
      if(++count >= 20) break;
    }
  }
});
