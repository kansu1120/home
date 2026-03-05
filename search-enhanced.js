document.addEventListener('DOMContentLoaded', () => {
  // デスクトップとモバイルの要素
  const desktopSearchBox = document.getElementById('searchBox');
  const desktopSearchResults = document.getElementById('searchResults');
  const mobileSearchToggle = document.getElementById('mobileSearchToggle');
  const mobileSearch = document.getElementById('mobileSearch');
  const mobileSearchBox = document.getElementById('mobileSearchBox');
  const mobileSearchClose = document.getElementById('mobileSearchClose');
  const mobileSearchResults = document.getElementById('mobileSearchResults');
  
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
  
  // 現在の検索ボックスと結果エリアを取得（デスクトップ or モバイル）
  function getCurrentElements() {
    const isMobile = window.innerWidth < 800;
    return {
      searchBox: isMobile ? mobileSearchBox : desktopSearchBox,
      searchResults: isMobile ? mobileSearchResults : desktopSearchResults,
      isMobile
    };
  }
  
  // モバイル検索の開閉
  if (mobileSearchToggle) {
    mobileSearchToggle.addEventListener('click', () => {
      mobileSearch.classList.add('open');
      mobileSearchBox.focus();
    });
  }
  
  if (mobileSearchClose) {
    mobileSearchClose.addEventListener('click', () => {
      mobileSearch.classList.remove('open');
      mobileSearchBox.value = '';
      mobileSearchResults.innerHTML = '';
    });
  }
  
  // ハイライト処理
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }
  
  // 正規表現のエスケープ
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // 検索実行
  function performSearch(query) {
    const { searchResults } = getCurrentElements();
    
    if (!query.trim()) {
      searchResults.innerHTML = '';
      return;
    }
    
    const results = allPages.filter(page => 
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      (page.content && page.content.toLowerCase().includes(query.toLowerCase()))
    );
    
    // 並び順改善
    results.sort((a, b) => {
      const queryLower = query.toLowerCase();
      const aTitleLower = a.title.toLowerCase();
      const bTitleLower = b.title.toLowerCase();
      
      const aExact = aTitleLower === queryLower;
      const bExact = bTitleLower === queryLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      const aStarts = aTitleLower.startsWith(queryLower);
      const bStarts = bTitleLower.startsWith(queryLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      const aIndex = aTitleLower.indexOf(queryLower);
      const bIndex = bTitleLower.indexOf(queryLower);
      if (aIndex !== bIndex) return aIndex - bIndex;
      
      return a.title.localeCompare(b.title);
    });
    
    displayResults(results, query, searchResults);
  }
  
  // 検索結果を表示
  function displayResults(results, query, resultsElement) {
    resultsElement.innerHTML = '';
    
    if (results.length === 0) {
      const noResult = document.createElement('li');
      noResult.className = 'no-result';
      noResult.innerHTML = `「<strong>${query}</strong>」の検索結果が見つかりませんでした`;
      resultsElement.appendChild(noResult);
      return;
    }
    
    const resultCount = document.createElement('li');
    resultCount.className = 'search-result-count';
    resultCount.textContent = `${results.length}件の結果`;
    resultsElement.appendChild(resultCount);
    
    results.forEach(result => {
      const li = document.createElement('li');
      li.className = 'search-result-item';
      
      const title = document.createElement('div');
      title.className = 'result-title';
      title.innerHTML = highlightText(result.title, query);
      
      li.appendChild(title);
      
      li.addEventListener('click', () => {
        window.location.href = result.url;
      });
      
      resultsElement.appendChild(li);
    });
  }
  
  // デスクトップ検索ボックスのイベント
  if (desktopSearchBox) {
    desktopSearchBox.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }
  
  // モバイル検索ボックスのイベント
  if (mobileSearchBox) {
    mobileSearchBox.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }
  
  // キーボードショートカット
  document.addEventListener('keydown', (e) => {
    const { searchBox, isMobile } = getCurrentElements();
    
    // Ctrl+K または Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (isMobile) {
        mobileSearch.classList.add('open');
      }
      searchBox.focus();
    }
    
    // / キー
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
      if (isMobile) {
        mobileSearch.classList.add('open');
      }
      searchBox.focus();
    }
    
    // ESC キー
    if (e.key === 'Escape') {
      if (isMobile) {
        mobileSearch.classList.remove('open');
        mobileSearchBox.value = '';
        mobileSearchResults.innerHTML = '';
      } else {
        desktopSearchBox.blur();
        desktopSearchBox.value = '';
        desktopSearchResults.innerHTML = '';
      }
    }
  });
  
  // プレースホルダーをOS判定で変更
  // Use userAgent as a fallback since navigator.platform is deprecated
  const isMac = (navigator.userAgentData?.platform || navigator.platform).toUpperCase().indexOf('MAC') >= 0;
  const shortcutKey = isMac ? '⌘+K' : 'Ctrl+K';
  if (desktopSearchBox) {
    desktopSearchBox.setAttribute('placeholder', `検索... (${shortcutKey} または /)`);
  }
  if (mobileSearchBox) {
    mobileSearchBox.setAttribute('placeholder', `検索... (${shortcutKey} または /)`);
  }
});
