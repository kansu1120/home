// アニメーション継続時間（ミリ秒）
const TRANSITION_DURATION = 600;

document.addEventListener('DOMContentLoaded', () => {
  // リップルエフェクトの対象外リンクかどうかを判定
  function shouldExcludeLink(link) {
    // 外部リンク、新規タブは除外
    if (link.target === '_blank' || link.hostname !== window.location.hostname) {
      return true;
    }
    
    // 純粋なアンカーリンク（#で始まるまたは#のみ）は除外
    const href = link.getAttribute('href');
    if (!href || href === '#' || (href.startsWith('#') && !href.includes('/'))) {
      return true;
    }
    
    return false;
  }
  
  // すべてのリンクにリップルエフェクトを適用
  document.querySelectorAll('a').forEach(link => {
    if (shouldExcludeLink(link)) {
      return;
    }
    
    // ページ遷移のリンクにリップルエフェクトを追加
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.href;
      
      // クリック位置を取得
      const x = e.clientX;
      const y = e.clientY;
      
      // リップルエフェクトを作成
      createRippleTransition(x, y, url);
    });
  });
  
  // ホバー時にプリフェッチ（先読み）
  // プリフェッチ要素はページ遷移時に自動的にクリーンアップされる
  document.querySelectorAll('a').forEach(link => {
    if (shouldExcludeLink(link)) {
      return;
    }
    
    link.addEventListener('mouseenter', () => {
      const prefetch = document.createElement('link');
      prefetch.rel = 'prefetch';
      prefetch.href = link.href;
      prefetch.as = 'document';
      document.head.appendChild(prefetch);
    }, { once: true });
  });
});

function createRippleTransition(x, y, url) {
  // オーバーレイコンテナを作成
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `;
  
  // リップル（波紋）を作成
  const ripple = document.createElement('div');
  
  // 画面全体を覆うために必要な円の半径を計算
  const maxDistance = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, 
      rgba(201, 162, 77, 0.95) 0%, 
      rgba(201, 162, 77, 0.98) 50%,
      rgba(122, 15, 24, 0.95) 100%);
    transform: translate(-50%, -50%);
    transition: all ${TRANSITION_DURATION / 1000}s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 
      0 0 60px rgba(201, 162, 77, 0.4),
      inset 0 0 80px rgba(255, 255, 255, 0.1);
  `;
  
  overlay.appendChild(ripple);
  document.body.appendChild(overlay);
  
  // アニメーション開始（次のフレームで実行）
  requestAnimationFrame(() => {
    ripple.style.width = `${maxDistance * 2.5}px`;
    ripple.style.height = `${maxDistance * 2.5}px`;
  });
  
  // アニメーション完了後にページ遷移
  // オーバーレイはページ遷移時に自動的にクリーンアップされる
  setTimeout(() => {
    window.location.href = url;
  }, TRANSITION_DURATION);
}

// ページ読み込み時のフェードイン
window.addEventListener('pageshow', () => {
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.3s ease-in';
});

// ページ離脱時の準備
document.body.style.opacity = '1';
