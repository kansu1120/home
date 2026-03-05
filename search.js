document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.getElementById('searchBox');
  const searchResults = document.getElementById('searchResults');
  const headerSearch = document.getElementById('headerSearch');

  // ページデータを保持
  let allPages = [];

  // 検索インデックスをロード
  fetch("/library/library/search_index.json")
    .then(res => res.json())
    .then(data => {
      allPages = data;
    })
    .catch(err => {
      console.error("Failed to load search index:", err);
    });

  // ハイライト処理
  function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  // 正規表現の特殊文字をエスケープ
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 検索実行
  function performSearch(query) {
    if (!query.trim()) {
      searchResults.innerHTML = '';
      return;
    }

    // 検索結果を取得
    const results = allPages.filter(page => 
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      (page.content && page.content.toLowerCase().includes(query.toLowerCase()))
    );

    // 並び順改善：完全一致 → 前方一致 → 部分一致
    results.sort((a, b) => {
      const queryLower = query.toLowerCase();
      const aTitleLower = a.title.toLowerCase();
      const bTitleLower = b.title.toLowerCase();
      
      // 完全一致
      const aExact = aTitleLower === queryLower;
      const bExact = bTitleLower === queryLower;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // 前方一致
      const aStarts = aTitleLower.startsWith(queryLower);
      const bStarts = bTitleLower.startsWith(queryLower);
      
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // マッチ位置が早い方を上に
      const aIndex = aTitleLower.indexOf(queryLower);
      const bIndex = bTitleLower.indexOf(queryLower);
      
      if (aIndex !== bIndex) return aIndex - bIndex;
      
      // それ以外はアルファベット順
      return a.title.localeCompare(b.title);
    });

    // 結果を表示
    displayResults(results, query);
  }

  // 検索結果を表示
  function displayResults(results, query) {
    searchResults.innerHTML = '';

    if (results.length === 0) {
      const noResult = document.createElement('li');
      noResult.className = 'no-result';
      noResult.innerHTML = `「<strong>${query}</strong>」の検索結果が見つかりませんでした`;
      searchResults.appendChild(noResult);
      return;
    }

    // 結果数を表示
    const resultCount = document.createElement('li');
    resultCount.className = 'search-result-count';
    resultCount.textContent = `${results.length}件の結果`;
    searchResults.appendChild(resultCount);

    results.forEach(result => {
      const li = document.createElement('li');
      li.className = 'search-result-item';
      
      // タイトル（ハイライト付き）
      const title = document.createElement('div');
      title.className = 'result-title';
      title.innerHTML = highlightText(result.title, query);
      
      li.appendChild(title);
      
      li.addEventListener('click', () => {
        window.location.href = result.url;
      });
      
      searchResults.appendChild(li);
    });
  }

  // 検索ボックスの入力イベント
  if (searchBox) {
    searchBox.addEventListener('input', (e) => {
      const query = e.target.value;
      performSearch(query);
    });
  }

  // キーボードショートカット
  document.addEventListener('keydown', (e) => {
    // Ctrl+K（Windows/Linux）または Cmd+K（Mac）
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      headerSearch.classList.add('open');
      searchBox.focus();
    }
    
    // / キー（入力フィールド以外の場合）
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
      headerSearch.classList.add('open');
      searchBox.focus();
    }
    
    // ESC キー（検索を閉じる）
    if (e.key === 'Escape') {
      headerSearch.classList.remove('open');
      searchBox.blur();
      searchBox.value = '';
      searchResults.innerHTML = '';
    }
  });

  // プレースホルダーをOS判定で変更
  if (searchBox) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcutKey = isMac ? '⌘+K' : 'Ctrl+K';
    searchBox.setAttribute('placeholder', `検索... (${shortcutKey} または /)`);
  }
});
