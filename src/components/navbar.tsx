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
      className={`sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60`}
    >
      <div
        className={`mx-auto flex h-16 max-w-6xl items-center justify-between px-4`}
      >
        <div className={`flex items-center gap-2`}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRafeLgRXntEcrOogx7zl2R5xvKilhHK1z20w&s"
            alt="Tanstack Start Logo"
            className={`size-8`}
          />
          <h1 className={`text-lg font-semibold`}>Tanstack Start</h1>
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
                className={`cursor-pointer`}
              >
                Log out
              </Button>
              <Link to="/dashboard" className={buttonVariants()}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'secondary' })}
              >
                Login
              </Link>
              <Link to="/signup" className={buttonVariants()}>
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
