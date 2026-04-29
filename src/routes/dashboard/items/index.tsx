// dashboard/items

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { getItemsFn } from '#/data/items'
import { ItemStatus } from '#/generated/prisma/enums'
import { copyToClipboard } from '#/lib/clipboard'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Copy } from 'lucide-react'
import z from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'

const itemSearchSchema = z.object({
  q: z.string().default(''),
  status: z.union([z.literal('all'), z.nativeEnum(ItemStatus)]).default('all'),
})

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  loader: () => getItemsFn(),
  validateSearch: zodValidator(itemSearchSchema),
})

function RouteComponent() {
  const data = Route.useLoaderData()
  // const { q, status } = Route.useSearch();

  const selectMenuItems = [
    { value: 'all', content: 'All Statuses' },
    ...Object.values(ItemStatus).map((status) => ({
      value: status,
      content: status.charAt(0) + status.slice(1).toLowerCase(),
    })),
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Items</h1>
        <p className="text-muted-foreground">
          Your saved articles and content!
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex gap-4">
        <Input placeholder="Search by title or tags" />
        <Select>
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

      <div className={`grid gap-6 md:grid-cols-2`}>
        {data.map((item) => (
          <Card
            key={item.id}
            className={`group overflow-hidden transition-all hover:shadow-lg pt-0`}
          >
            <Link to="/dashboard" className={`block`}>
              {item.ogImage && (
                <div className={`aspect-video overflow-hidden w-full bg-muted`}>
                  <img
                    src={item.ogImage}
                    alt={item.title ?? 'Article Thumbnail'}
                    className={`h-full w-full object-cover group-hover:scale-105 transition-all`}
                  ></img>
                </div>
              )}

              <CardHeader className="space-y-3 pt-4">
                <div className="justify-between items-center flex gap-2">
                  <Badge
                    variant={
                      item.status === 'COMPLETED' ? 'default' : 'secondary'
                    }
                    className="p-2.5"
                  >
                    {item.status.toLowerCase()}
                  </Badge>
                  <Button
                    onClick={async function (e) {
                      e.preventDefault()
                      await copyToClipboard(item.url)
                    }}
                    variant={'outline'}
                    size={'icon'}
                    className="size-8"
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>

                <CardTitle className="line-clamp-1 group-hover:text-primary leading-snug transition-colors text-xl">
                  {item.title}
                </CardTitle>

                {item.author && (
                  <p className="text-xs text-muted-foreground">{item.author}</p>
                )}
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
