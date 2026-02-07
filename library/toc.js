document.addEventListener('DOMContentLoaded', () => {
  // ページ内の見出しを取得
  const headings = document.querySelectorAll('.main h2, .main h3');
  
  // 見出しが3つ未満の場合は目次を表示しない
  if (headings.length < 3) return;
  
  // 目次コンテナを作成
  const toc = document.createElement('aside');
  toc.className = 'toc';
  
  const tocTitle = document.createElement('h3');
  tocTitle.textContent = '目次';
  toc.appendChild(tocTitle);
  
  const tocList = document.createElement('ul');
  
  // 各見出しにIDを付与し、目次リンクを作成
  headings.forEach((heading, index) => {
    // 見出しにIDがない場合は自動生成
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
    
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    
    // h3の場合はインデント
    if (heading.tagName === 'H3') {
      li.classList.add('toc-h3');
    }
    
    li.appendChild(link);
    tocList.appendChild(li);
  });
  
  toc.appendChild(tocList);
  
  // 最初のh1またはh2の直後に挿入
  const firstHeading = document.querySelector('.main h1, .main h2');
  if (firstHeading && firstHeading.nextSibling) {
    firstHeading.parentNode.insertBefore(toc, firstHeading.nextSibling);
  } else {
    // h1/h2がない場合は.mainの最初に挿入
    const main = document.querySelector('.main');
    if (main && main.firstChild) {
      main.insertBefore(toc, main.firstChild);
    }
  }
});
