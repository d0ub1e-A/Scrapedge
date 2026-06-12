import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { FaviconUpdater } from '#/components/favicon-updater'

import appCss from '../styles.css?url'
import { ThemeProvider } from '#/lib/theme-provider'
import { Toaster } from '#/components/ui/sonner'
import { ReactLenis } from 'lenis/react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Scrapedge',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <p>Not Found</p>,
  errorComponent: ({ error }) => {
    return (
      <div className="p-4 bg-red-100 text-red-700">Oops! {error.message}</div>
    )
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <FaviconUpdater />
          <ReactLenis
            root
            options={{
              lerp: 0.085,
              orientation: 'vertical',
              gestureOrientation: 'vertical',
              smoothWheel: true,
              wheelMultiplier: 1,
               touchMultiplier: 1,
               syncTouch: false,
              anchors: true,
            }}
          >
            {children}
          </ReactLenis>
          <Toaster closeButton position="top-center" />
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
