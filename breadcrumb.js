document.addEventListener('DOMContentLoaded', () => {
  const breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;

  const path = window.location.pathname;
  const rawSegments = path.split('/').filter(s => s && s !== 'library');
  const categoryMap = { '構造体': 'データ構造' };
  const items = [];

  let currentPath = '/library';
  rawSegments.forEach((segment) => {
    currentPath += '/' + segment;

    let name = decodeURIComponent(segment);
    name = name.replace(/\.html?$/i, '').replace(/^index$/i, '').trim();

    // 内部ディレクトリや空名は表示しない
    if (!name || name.toLowerCase() === 'all') {
      return;
    }

    items.push({
      name: categoryMap[name] || name,
      href: currentPath.replace(/\/index\.html?$/i, '/')
    });
  });

  if (items.length === 0) {
    breadcrumb.style.display = 'none';
    return;
  }

  // ホームリンク
  const homeLink = document.createElement('a');
  homeLink.className = 'breadcrumb-link breadcrumb-home';
  homeLink.href = '/library/';
  homeLink.textContent = 'Home';
  breadcrumb.appendChild(homeLink);

  items.forEach((item, index) => {
    const separator = document.createElement('span');
    separator.className = 'separator';
    separator.textContent = '›';
    breadcrumb.appendChild(separator);

    const isCurrent = index === items.length - 1;
    if (isCurrent) {
      const current = document.createElement('span');
      current.className = 'current';
      current.textContent = item.name;
      breadcrumb.appendChild(current);
      return;
    }

    const link = document.createElement('a');
    link.className = 'breadcrumb-link';
    link.href = item.href;
    link.textContent = item.name;
    breadcrumb.appendChild(link);
  });
});
