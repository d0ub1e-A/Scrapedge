import { Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { handleSignOut } from '#/lib/utils'
import ThemeToggle from './theme-toggle'
import { Button, buttonVariants } from './ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

function Navbar() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => navigate({ to: '/' })}
        >
          <div className="relative size-9 flex items-center justify-center rounded-xl overflow-hidden text-primary-foreground shadow-lg transition-transform group-hover:scale-110 duration-300">
            <img
              src="/favicon.ico"
              alt="Scrapedge Logo"
              className="size-full object-cover dark:hidden"
            />
            <img
              src="/favicon_white.ico"
              alt="Scrapedge Logo"
              className="size-full object-cover hidden dark:block"
            />
            <div className="absolute inset-0 bg-primary/20 blur-md" />
          </div>
          <h1
            className="text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-primary"
            style={{ fontFamily: 'SundayShine, sans-serif' }}
          >
            Scrapedge
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isPending ? null : session ? (
              <>
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    handleSignOut(navigate)
                  }}
                  className="cursor-pointer px-4 rounded-full"
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

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                showCloseButton={false}
                className="flex flex-col py-10 px-5 gap-6"
              >
                <h1
                  className="text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-primary"
                  style={{ fontFamily: 'SundayShine, sans-serif' }}
                >
                  Scrapedge
                </h1>
                {isPending ? null : session ? (
                  <div className="flex flex-col gap-4 my-8 w-full justify-between h-full">
                    <Link
                      to="/dashboard"
                      className={`${buttonVariants()} w-full rounded-full py-6 text-lg`}
                    >
                      Dashboard
                    </Link>
                    <Button
                      variant={'secondary'}
                      onClick={() => {
                        handleSignOut(navigate)
                      }}
                      className="w-full rounded-full py-6 text-lg justify-self-end"
                    >
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 w-full">
                    <Link
                      to="/login"
                      className={`${buttonVariants({ variant: 'secondary' })} w-full rounded-full py-6 text-lg`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className={`${buttonVariants()} w-full rounded-full py-6 text-lg shadow-lg shadow-primary/20`}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar
