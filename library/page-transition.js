document.addEventListener('DOMContentLoaded', () => {
  // すべてのリンクにリップルエフェクトを適用
  document.querySelectorAll('a').forEach(link => {
    // 外部リンク、新規タブ、アンカーリンクは除外
    if (link.target === '_blank' || 
        link.hostname !== window.location.hostname ||
        link.hash ||
        link.getAttribute('href') === '#') {
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
  document.querySelectorAll('a').forEach(link => {
    if (link.target === '_blank' || 
        link.hostname !== window.location.hostname ||
        link.hash) {
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
  overlay.className = 'page-transition-overlay'; // クラス名を追加
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
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
  setTimeout(() => {
    window.location.href = url;
  }, 600);
}

// ページ読み込み時・ブラウザの戻る/進む時の処理
function cleanupTransition() {
  // すべてのトランジションオーバーレイを削除
  document.querySelectorAll('.page-transition-overlay').forEach(el => el.remove());
  
  // ボディの表示を復元
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.3s ease-in';
}

// ページ表示時に必ずクリーンアップ
window.addEventListener('pageshow', (event) => {
  cleanupTransition();
});

// ブラウザの戻る/進むボタン対応
window.addEventListener('popstate', () => {
  cleanupTransition();
});

// 初期化
document.body.style.opacity = '1';
cleanupTransition();
