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
      return;
    }
    
    // カテゴリ名のマッピング
    const categoryMap = {
      '累積和': '累積和',
      '数学': '数学',
      'グラフ': 'グラフ',
      '構造体': 'データ構造',
      '二分探索': '二分探索',
      'その他典型': 'その他典型'
    };
    
    if (categoryMap[name]) {
      name = categoryMap[name];
    }
    
    if (!name) {
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
      const link = document.createElement('a');
      link.href = currentPath;
      link.textContent = name;
      breadcrumb.appendChild(link);
    }
  });
  
  // ホームページまたはセグメントが少ない場合は非表示
  if (breadcrumb.children.length <= 1) {
    breadcrumb.classList.add('hidden');
  }
});
