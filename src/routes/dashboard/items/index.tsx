import { Badge } from '#/components/ui/badge'
import { Button, buttonVariants } from '#/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/components/ui/alert-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { getItemsFn, deleteItemFn } from '#/data/items'
import { ItemStatus } from '#/generated/prisma/enums'
import { copyToClipboard } from '#/lib/clipboard'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Copy, Inbox, Trash } from 'lucide-react'
import z from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'
import { /* Suspense, */ useEffect, useState } from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { Skeleton } from '#/components/ui/skeleton'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const itemSearchSchema = z.object({
  q: z.string().default(''),
  status: z.union([z.literal('all'), z.nativeEnum(ItemStatus)]).default('all'),
})

type ItemsSearch = z.infer<typeof itemSearchSchema>

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  // loader: () => ({ itemsPromise: getItemsFn() }),
  validateSearch: zodValidator(itemSearchSchema),
  head: () => ({
    meta: [
      { title: 'Saved Items | Scrapedge' },
      { property: 'og:title', content: 'Saved Items | Scrapedge' },
      { name: 'twitter:title', content: 'Saved Items | Scrapedge' },
    ],
  }),
})

function ItemsGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden pt-0">
          <Skeleton className="aspect-video w-full" />
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="size-8 rounded-md" />
            </div>
            {/* Title */}
            <Skeleton className="h-6 w-full" />

            {/* Author */}
            <Skeleton className="h-4 w-40" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

function ItemsList({
  q,
  status,
  // data,
}: {
  q: ItemsSearch['q']
  status: ItemsSearch['status']
  // data: Awaited<ReturnType<typeof getItemsFn>>
}) {
  const queryClient = useQueryClient()

  const { data: itemsData, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItemsFn(),
    staleTime: 60 * 60 * 1000,
  })

  const filteredItems = itemsData?.filter((item) => {
    const matchesQuery =
      q === '' ||
      item.title?.toLowerCase().includes(q.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q.toLowerCase()))
    const matchesStatus = status === 'all' || status === item.status

    return matchesQuery && matchesStatus
  })

  if (filteredItems?.length === 0) {
    return (
      <Empty className="border rounded-lg h-full">
        <EmptyHeader>
          <EmptyMedia variant={'icon'}>
            <Inbox className="size-12" />
          </EmptyMedia>
          <EmptyTitle>
            {itemsData?.length === 0 ? 'No items saved yet' : 'No items found'}
          </EmptyTitle>
          <EmptyDescription>
            {itemsData?.length === 0
              ? 'Start by importing URL to save your contents'
              : 'No items matches your search'}
          </EmptyDescription>
        </EmptyHeader>
        {itemsData?.length === 0 && (
          <EmptyContent>
            <Link className={buttonVariants()} to="/dashboard/import">
              Import URL
            </Link>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  return isLoading ? (
    <ItemsGridSkeleton />
  ) : (
    <div className={`grid gap-6 md:grid-cols-2`}>
      {filteredItems?.map((item) => (
        <Card
          key={item.id}
          className={`group overflow-hidden transition-all hover:shadow-lg pt-0`}
        >
          <Link
            to="/dashboard/items/$itemId"
            params={{ itemId: item.id }}
            className="block relative z-0"
          >
            {item.ogImage && (
              <div className={`aspect-video overflow-hidden w-full bg-muted`}>
                <img
                  src={
                    item.ogImage ??
                    'https://images.unsplash.com/photo-1635776062043-223faf322554?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  }
                  alt={item.title ?? 'Article Thumbnail'}
                  className="h-full w-full object-cover group-hover:scale-105 transition-all delay-300 backlight"
                ></img>
              </div>
            )}

            <CardHeader className="space-y-3 py-4">
              <div className="justify-between items-center flex gap-2">
                <Badge
                  variant={
                    item.status === 'COMPLETED' ? 'default' : 'secondary'
                  }
                  className="p-2.5"
                >
                  {item.status.toLowerCase()}
                </Badge>
                <div
                  onClick={function (e) {
                    e.preventDefault()
                  }}
                  className="flex gap-2"
                >
                  <Button
                    onClick={async function () {
                      await copyToClipboard(item.url)
                    }}
                    variant={'outline'}
                    size={'icon'}
                    className="size-8"
                  >
                    <Copy className="size-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant={'outline'}
                        size={'icon'}
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive relative z-10"
                      >
                        <Trash className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={async function () {
                            await deleteItemFn({ data: { id: item.id } })
                            queryClient.invalidateQueries({
                              queryKey: ['items'],
                            })
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="line-clamp-1 group-hover:text-primary leading-snug transition-colors text-xl">
                {item.title}
              </CardTitle>

              {item.author && (
                <p className="text-xs text-muted-foreground">{item.author}</p>
              )}

              {item.summary && (
                <CardDescription className="line-clamp-3 text-sm">
                  {item.summary}
                </CardDescription>
              )}

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.tags.slice(0, 4).map((tag, i) => (
                    <Badge variant={'secondary'} key={i}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  )
}

function RouteComponent() {
  const { q, status } = Route.useSearch()
  const [searchInput, setSearchInput] = useState(q)
  // from property tells the navigate hook from which route the new path should be navigated
  const navigate = useNavigate({ from: Route.fullPath })

  const selectMenuItems = [
    { value: 'all', content: 'All Statuses' },
    ...Object.values(ItemStatus).map((status) => ({
      value: status,
      content: status.charAt(0) + status.slice(1).toLowerCase(),
    })),
  ]

  useEffect(() => {
    if (searchInput === q) return

    const timeoutId = setTimeout(() => {
      // updates the URL
      navigate({ search: (prev) => ({ ...prev, q: searchInput }) })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchInput, navigate, q])

  return (
    <div className="flex flex-1 flex-col gap-6 px-5 md:px-10 lg:px-15">
      <div>
        <h1 className="text-2xl font-bold">Saved Items</h1>
        <p className="text-muted-foreground">
          Your saved articles and content!
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex gap-4">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title or tags"
        />
        <Select
          value={status}
          onValueChange={(value) =>
            navigate({
              search: (prev) => ({ ...prev, status: value as typeof status }),
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status"></SelectValue>
          </SelectTrigger>
          <SelectContent className="translate-y-9">
            {selectMenuItems.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span>{option.content}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ItemsList q={q} status={status} />
    </div>
  )
}
