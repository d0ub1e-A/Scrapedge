import { MessageResponse } from '#/components/ai-elements/message.tsx'
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
  Loader2,
  Sparkle,
  StopCircleIcon,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemById({ data: { id: params.itemId } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? 'Item Details | Scrapedge' },
      {
        name: 'twitter:title',
        content: loaderData?.title ?? 'Item Details | Scrapedge',
      },
    ],
  }),
})

function RouteComponent() {
  const data = Route.useLoaderData()
  const [isContentOpen, setIsContentOpen] = useState(false)

  const { isLoading, complete, completion, stop } = useCompletion({
    api: '/api/ai/summary',
    streamProtocol: 'text',
    body: {
      itemId: data?.id,
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function handleGenerateSummary() {
    if (!data?.content) {
      toast.error('No content available to summarize')
      return
    }

    complete(data.content)
  }

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
        <Card className="border-primary/20 bg-primary/5">
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Summary
                </h2>
                {completion || data.summary ? (
                  <MessageResponse>{completion}</MessageResponse>
                ) : (
                  <p className="text-muted-foreground italic">
                    {data.content
                      ? 'No summary yet. Generate one with AI.'
                      : 'No content to summarize'}
                  </p>
                )}
              </div>

              {data.content && !data.summary && (
                <Button
                  onClick={handleGenerateSummary}
                  disabled={isLoading}
                  size={'sm'}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin size-4" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkle className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              )}

              {isLoading && (
                <Button onClick={stop} size={'sm'} title="Stop the response">
                  <StopCircleIcon className="size-4 animate-pulse" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

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
                <CardContent>
                  <MessageResponse>{data.content}</MessageResponse>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  )
}
