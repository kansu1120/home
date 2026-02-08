document.addEventListener('DOMContentLoaded', () => {
  const breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;

  const path = window.location.pathname;
  const segments = path.split('/').filter(s => s && s !== 'library');
  
  // ホームリンク
  const homeLink = document.createElement('a');
  homeLink.href = '/library/';
  homeLink.textContent = 'Home';
  breadcrumb.appendChild(homeLink);
  
  // パスの各セグメントを処理
  let currentPath = '/library';
  segments.forEach((segment, index) => {
    // セグメント名をデコード＆整形
    let name = decodeURIComponent(segment);
    name = name.replace(/\.html?$/i, '').replace(/^index$/i, '');
    
    // 'all' セグメントはスキップ（内部的なディレクトリなので非表示）
    if (segment === 'all' || name === 'all') {
      currentPath += '/' + segment;
      return; // 表示せずにスキップ
    }
    
    // カテゴリ名のマッピング
    const categoryMap = {
      '構造体': 'データ構造'
    };
    
    if (categoryMap[name]) {
      name = categoryMap[name];
    }
    
    // 空の名前やindexはスキップ
    if (!name || name === 'index') {
      currentPath += '/' + segment;
      return;
    }
    
    currentPath += '/' + segment;
    
    // セパレータ
    const separator = document.createElement('span');
    separator.className = 'separator';
    separator.textContent = '›';
    breadcrumb.appendChild(separator);
    
    // 最後のセグメント（現在のページ）
    if (index === segments.length - 1) {
      const current = document.createElement('span');
      current.className = 'current';
      current.textContent = name;
      breadcrumb.appendChild(current);
    } else {
      // 中間のセグメント - リンクなしのテキストとして表示
      const span = document.createElement('span');
      span.className = 'breadcrumb-segment';
      span.textContent = name;
      span.style.color = 'var(--sub)';
      breadcrumb.appendChild(span);
    }
  });
  
  // ホームページまたはセグメントが少ない場合は非表示
  if (breadcrumb.children.length <= 1) {
    breadcrumb.style.display = 'none';
  }
});
