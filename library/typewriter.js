document.addEventListener('DOMContentLoaded', () => {
  // h1タイトルにタイプライター効果を適用
  const title = document.querySelector('.main h1');
  
  if (!title || !title.textContent.trim()) return;
  
  const text = title.textContent;
  title.textContent = '';
  title.style.opacity = '1';
  
  // カーソル要素を追加
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.textContent = '|';
  title.appendChild(cursor);
  
  // 1文字ずつ表示
  let charIndex = 0;
  const typeSpeed = 80; // ミリ秒（調整可能）
  
  function typeChar() {
    if (charIndex < text.length) {
      // カーソルの前に文字を挿入
      const textNode = document.createTextNode(text[charIndex]);
      title.insertBefore(textNode, cursor);
      charIndex++;
      setTimeout(typeChar, typeSpeed);
    } else {
      // タイピング完了後、カーソルを点滅させる
      cursor.classList.add('blinking');
      
      // 1秒後にカーソルを削除
      setTimeout(() => {
        cursor.remove();
      }, 1000);
    }
  }
  
  // 少し遅延してから開始（リップルエフェクト後）
  setTimeout(typeChar, 300);
});
