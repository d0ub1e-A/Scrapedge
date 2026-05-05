import Navbar from '#/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div>
      <Navbar />
      <h1 className='' >Scrapedge</h1>
    </div>
  )
}
