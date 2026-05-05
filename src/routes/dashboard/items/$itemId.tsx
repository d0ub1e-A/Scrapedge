import { Badge } from '#/components/ui/badge.tsx'
import { Button, buttonVariants } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card.tsx'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible.tsx'
import { getItemById } from '#/data/items'
import { cn } from '#/lib/utils.ts'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Clock,
  ExternalLink,
  User,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemById({ data: { id: params.itemId } }),
})

function RouteComponent() {
  const data = Route.useLoaderData()
  const [isContentOpen, setIsContentOpen] = useState(false)

  function convertDate(dateStr: Date): string {
    const dateObj = new Date(dateStr)
    const date = dateObj.getDate()
    const month = dateObj.toLocaleString('default', { month: 'long' })
    const year = dateObj.getFullYear()

    return `${date} ${month} ${year}`
  }

  if (!data) {
    return notFound()
  }

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

      {data.ogImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <img
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
            src={data.ogImage}
            alt={data.title ?? 'Item image'}
          />
        </div>
      )}

      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {data.title ?? 'Untitled'}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {data.author && (
            <span className="inline-flex items-center gap-1">
              <User className="size-3.5" /> {data.author}
            </span>
          )}
          {data.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" /> {convertDate(data.publishedAt)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> Saved {convertDate(data.createdAt)}
          </span>
        </div>
        <a
          className="text-primary/80 dark:brightness-200 hover:underline inline-flex items-center gap-1 text-sm font-semibold"
          href={data.url}
          target="_blank"
        >
          View Original {<ExternalLink />}
        </a>

        {/* Tags */}
        {data.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, i) => (
              <Badge key={i}>{tag}</Badge>
            ))}
          </div>
        ) : null}

        {/* Summary Section */}
        <p>Summary Section</p>

        {/* Content Section */}
        {data.content && (
          <Collapsible open={isContentOpen} onOpenChange={setIsContentOpen}>
            <CollapsibleTrigger asChild>
              <Button variant={'outline'} className="w-full justify-between">
                <span className="font-medium">Full Content</span>
                <ChevronDown
                  className={cn(
                    isContentOpen ? 'rotate-180' : '',
                    'size-4 transition-transform duration-200',
                  )}
                />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent>{data.content}</CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  )
}
