import { Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { handleSignOut } from '#/lib/utils'
import ThemeToggle from './theme-toggle'
import { Button, buttonVariants } from './ui/button'

function Navbar() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  return (
    <nav
      className={`sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60 transition-all duration-300`}
    >
      <div
        className={`mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8`}
      >
        <div
          className={`flex items-center gap-2 group cursor-pointer`}
          onClick={() => navigate({ to: '/' })}
        >
          <div className="relative size-9 flex items-center justify-center rounded-xl overflow-hidden text-primary-foreground shadow-lg transition-transform group-hover:scale-110 duration-300">
            <img
              src="/favicon.ico"
              alt="Scrapedge Logo"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 blur-md" />
          </div>
          <h1
            className={`text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-primary`}
            style={{ fontFamily: 'SundayShine, sans-serif' }}
          >
            Scrapedge
          </h1>
        </div>

        <div className={`flex items-center gap-3`}>
          <ThemeToggle />
          {isPending ? null : session ? (
            <>
              <Button
                variant={'secondary'}
                onClick={() => {
                  handleSignOut(navigate)
                }}
                className={`cursor-pointer px-4 rounded-full`}
              >
                Log out
              </Button>
              <Link
                to="/dashboard"
                className={`${buttonVariants()} px-4 rounded-full`}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${buttonVariants({ variant: 'secondary' })} px-4 rounded-full`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`${buttonVariants()} px-4 rounded-full shadow-lg shadow-primary/20`}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
export default Navbar
