document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('pre code').forEach(code => {
    const pre = code.parentElement;
    
    // highlight.jsのクラスから言語を検出
    const langClass = Array.from(code.classList).find(cls => cls.startsWith('language-'));
    
    if (langClass) {
      const lang = langClass.replace('language-', '').toUpperCase();
      
      // 言語名のマッピング
      const langMap = {
        'CPP': 'C++',
        'JAVASCRIPT': 'JavaScript',
        'JS': 'JavaScript',
        'PYTHON': 'Python',
        'PY': 'Python',
        'HTML': 'HTML',
        'CSS': 'CSS',
        'BASH': 'Bash',
        'SH': 'Shell',
        'MARKDOWN': 'Markdown',
        'MD': 'Markdown',
        'JSON': 'JSON',
        'YAML': 'YAML',
        'YML': 'YAML'
      };
      
      const displayLang = langMap[lang] || lang.charAt(0) + lang.slice(1).toLowerCase();
      
      // ラベル要素を作成
      const label = document.createElement('span');
      label.className = 'code-language-label';
      label.textContent = displayLang;
      pre.appendChild(label);
    }
  });
});
