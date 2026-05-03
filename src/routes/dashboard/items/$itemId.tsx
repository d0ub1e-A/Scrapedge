import { buttonVariants } from '#/components/ui/button'
import { getItemById } from '#/data/items'
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemById({ data: { id: params.itemId } }),
})

function RouteComponent() {
  const { itemId } = Route.useParams()

  return (
    <div className="mx-auto max-w-3xl space-y-6 w-full">
      <div className="flex justify-start">
        <Link
          to="/dashboard/items"
          className={buttonVariants({ variant: 'outline' })}
        >
          <ArrowLeft /> Go Back
        </Link>
      </div>
    </div>
  )
}
