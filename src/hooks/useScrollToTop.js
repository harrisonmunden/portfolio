import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Smooth scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' to prevent animation that might cause issues
    });
    
    // Also reset any potential scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, [pathname]);
  
  // Additional effect to handle page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Store current scroll position before page refresh
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };
    
    const handleLoad = () => {
      // Restore scroll position after page load if it exists
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        if (position > 0) {
          window.scrollTo(0, 0); // Always start at top
        }
        sessionStorage.removeItem('scrollPosition');
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);
}; 