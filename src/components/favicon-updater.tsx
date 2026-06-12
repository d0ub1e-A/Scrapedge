import { useEffect } from 'react'

export function FaviconUpdater() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateFavicon = (isDark: boolean) => {
      const favicon = isDark ? '/favicon_white.ico' : '/favicon.ico'
      const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (link) {
        link.href = favicon
      }
    }

    // Initial update
    updateFavicon(mediaQuery.matches)

    // Listen for system theme changes
    const handler = (e: MediaQueryListEvent) => updateFavicon(e.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return null
}
