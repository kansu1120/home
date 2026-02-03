// Loading Overlay Feature
// Shows a full-screen loading overlay when navigation links are clicked

// Duration to show loading overlay (in milliseconds)
const LOADING_DISPLAY_DURATION = 1500;

// Hide loading overlay when page is shown (including back/forward navigation from cache)
// This is registered immediately to ensure it works even when page is loaded from bfcache
window.addEventListener('pageshow', (event) => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    // Remove active class to hide the overlay
    loadingOverlay.classList.remove('active');
    // Add hidden class for additional control
    loadingOverlay.classList.add('hidden');
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  // Exit early if overlay element doesn't exist
  if (!loadingOverlay) return;
  
  // Ensure overlay is hidden on initial load
  loadingOverlay.classList.remove('active');
  loadingOverlay.classList.add('hidden');
  
  // Get all navigation links that should trigger the loading overlay
  const navigationLinks = document.querySelectorAll('a:not([target="_blank"])');
  
  navigationLinks.forEach(link => {
    // Skip anchor links (links that start with #)
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    
    // Skip external links (links with different hostname)
    try {
      const linkUrl = new URL(href, window.location.href);
      if (linkUrl.hostname !== window.location.hostname) return;
    } catch (e) {
      // Invalid URL, skip
      return;
    }
    
    // Add click event listener to show loading overlay
    link.addEventListener('click', (event) => {
      // Show the loading overlay - remove hidden class and add active class
      loadingOverlay.classList.remove('hidden');
      loadingOverlay.classList.add('active');
      
      // Note: The overlay will naturally disappear when the new page loads
      // But we also set a fallback timeout in case navigation is prevented
      setTimeout(() => {
        loadingOverlay.classList.remove('active');
        loadingOverlay.classList.add('hidden');
      }, LOADING_DISPLAY_DURATION);
    });
  });
});
