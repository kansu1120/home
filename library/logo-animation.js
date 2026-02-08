document.addEventListener('DOMContentLoaded', () => {
  // ホームページかどうかを判定
  const isHomePage = window.location.pathname === '/' || 
                     window.location.pathname === '/library/' ||
                     window.location.pathname === '/library/index.html';
  
  if (!isHomePage) return; // ホームページ以外は何もしない
  
  const logoMain = document.querySelector('.logo-main');
  const logoSub = document.querySelector('.logo-sub');
  const headerLogo = document.querySelector('.header-logo');
  
  if (logoMain && logoSub && headerLogo) {
    // 中央に区切り線を追加
    const divider = document.createElement('span');
    divider.className = 'logo-divider';
    divider.textContent = '|';
    headerLogo.insertBefore(divider, logoSub);
    
    // リップルエフェクト終了後に開始（0.7秒遅延）
    setTimeout(() => {
      logoMain.classList.add('logo-animate');
      logoSub.classList.add('logo-animate');
      divider.classList.add('logo-animate');
    }, 700);
  }
});
