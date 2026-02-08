document.addEventListener('DOMContentLoaded', () => {
  const MAX_HISTORY = 10;
  
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
      if (!mobileSearchBox.value.trim()) {
        showSearchHistory(mobileSearchResults);
      }
    });
  }
  
  if (mobileSearchClose) {
    mobileSearchClose.addEventListener('click', () => {
      mobileSearch.classList.remove('open');
      mobileSearchBox.value = '';
      mobileSearchResults.innerHTML = '';
    });
  }
  
  // 検索履歴の取得
  function getSearchHistory() {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  }
  
  // 検索履歴の保存
  function saveSearchHistory(query) {
    if (!query.trim()) return;
    
    let history = getSearchHistory();
    history = history.filter(item => item !== query);
    history.unshift(query);
    
    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY);
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }
  
  // 検索履歴のクリア
  function clearSearchHistory(resultsElement) {
    localStorage.removeItem('searchHistory');
    resultsElement.innerHTML = '';
    const noHistory = document.createElement('li');
    noHistory.className = 'no-result';
    noHistory.textContent = '履歴がクリアされました';
    resultsElement.appendChild(noHistory);
  }
  
  // 検索履歴の表示
  function showSearchHistory(resultsElement) {
    const history = getSearchHistory();
    resultsElement.innerHTML = '';
    
    if (history.length === 0) {
      const noHistory = document.createElement('li');
      noHistory.className = 'search-history-header';
      noHistory.textContent = '検索履歴なし';
      resultsElement.appendChild(noHistory);
      return;
    }
    
    // 履歴ヘッダー
    const historyHeader = document.createElement('li');
    historyHeader.className = 'search-history-header';
    
    const headerText = document.createElement('span');
    headerText.textContent = '最近の検索';
    
    const clearButton = document.createElement('button');
    clearButton.className = 'clear-history-btn';
    clearButton.textContent = 'クリア';
    clearButton.addEventListener('click', (e) => {
      e.stopPropagation();
      clearSearchHistory(resultsElement);
    });
    
    historyHeader.appendChild(headerText);
    historyHeader.appendChild(clearButton);
    resultsElement.appendChild(historyHeader);
    
    // 履歴アイテム
    history.forEach(item => {
      const li = document.createElement('li');
      li.className = 'search-history-item';
      
      const icon = document.createElement('span');
      icon.className = 'history-icon';
      icon.textContent = '🕐';
      
      const text = document.createElement('span');
      text.textContent = item;
      
      li.appendChild(icon);
      li.appendChild(text);
      
      li.addEventListener('click', () => {
        const { searchBox } = getCurrentElements();
        searchBox.value = item;
        performSearch(item);
      });
      
      resultsElement.appendChild(li);
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
      showSearchHistory(searchResults);
      return;
    }
    
    saveSearchHistory(query);
    
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
    
    desktopSearchBox.addEventListener('focus', () => {
      if (!desktopSearchBox.value.trim()) {
        showSearchHistory(desktopSearchResults);
      }
    });
  }
  
  // モバイル検索ボックスのイベント
  if (mobileSearchBox) {
    mobileSearchBox.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
    
    mobileSearchBox.addEventListener('focus', () => {
      if (!mobileSearchBox.value.trim()) {
        showSearchHistory(mobileSearchResults);
      }
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
      if (!searchBox.value.trim()) {
        showSearchHistory(isMobile ? mobileSearchResults : desktopSearchResults);
      }
    }
    
    // / キー
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
      if (isMobile) {
        mobileSearch.classList.add('open');
      }
      searchBox.focus();
      if (!searchBox.value.trim()) {
        showSearchHistory(isMobile ? mobileSearchResults : desktopSearchResults);
      }
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
