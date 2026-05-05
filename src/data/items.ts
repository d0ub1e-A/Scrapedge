import { prisma } from '#/db'
import { firecrawl } from '#/lib/firecrawl'
import {
  bulkImportSchema,
  extractSchema,
  singleImportSchema,
} from '#/schemas/import'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { authFnMiddleware } from '#/middlewares/auth'

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(singleImportSchema)
  .handler(async function ({ data, context }) {
    const item = await prisma.savedItem.create({
      data: {
        url: data.url,
        userid: context.session.user.id,
        status: 'PROCESSING',
      },
    })

    try {
      const result = await firecrawl.scrape(data.url, {
        formats: [
          'markdown',
          {
            type: 'json',
            schema: extractSchema,
          },
        ],
        onlyMainContent: true,
      })

      const jsonData = result.json as z.infer<typeof extractSchema>
      let publishedAt = null

      if (jsonData.publishedAt) {
        const parsed = new Date(jsonData.publishedAt)

        if (!isNaN(parsed.getTime())) {
          publishedAt = parsed
        }
      }

      const updatedItem = await prisma.savedItem.update({
        where: {
          id: item.id,
        },
        data: {
          title: result.metadata?.title || null,
          content: result.markdown || null,
          ogImage: result.metadata?.ogImage || null,
          author: jsonData.author || null,
          publishedAt: publishedAt,
          status: 'COMPLETED',
        },
      })

      return updatedItem
    } catch {
      const failedItem = await prisma.savedItem.update({
        where: { id: item.id },
        data: {
          status: 'FAILED',
        },
      })

      return failedItem
    }
  })

export const mapUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(bulkImportSchema)
  .handler(async function ({ data }) {
    const result = await firecrawl.map(data.url, {
      limit: 20,
      search: data.search,
      location: {
        languages: ['en', 'bn'],
      },
    })

    return result.links
  })

export const scrapeBulkUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ urls: z.array(z.string().url()) }))
  .handler(async function ({ data, context }) {
    for (let i = 0; i < data.urls.length; i++) {
      const url = data.urls[i]

      const item = await prisma.savedItem.create({
        data: {
          url: url,
          userid: context.session.user.id,
          status: 'PENDING',
        },
      })

      try {
        const result = await firecrawl.scrape(url, {
          formats: [
            'markdown',
            {
              type: 'json',
              schema: extractSchema,
            },
          ],
          onlyMainContent: true,
        })

        const jsonData = result.json as z.infer<typeof extractSchema>
        let publishedAt = null

        if (jsonData.publishedAt) {
          const parsed = new Date(jsonData.publishedAt)

          if (!isNaN(parsed.getTime())) {
            publishedAt = parsed
          }
        }

        await prisma.savedItem.update({
          where: {
            id: item.id,
          },
          data: {
            title: result.metadata?.title || null,
            content: result.markdown || null,
            ogImage: result.metadata?.ogImage || null,
            author: jsonData.author || null,
            publishedAt: publishedAt,
            status: 'COMPLETED',
          },
        })
      } catch {
        await prisma.savedItem.update({
          where: { id: item.id },
          data: {
            status: 'FAILED',
          },
        })
      }
    }
  })

export const getItemsFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async function ({ context }) {
    // await new Promise((resolve) => setTimeout(resolve, 1500)) // for test delay
    const items = await prisma.savedItem.findMany({
      where: {
        userid: context.session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return items
  })

export const getItemById = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async function ({ context, data }) {
    try {
      const item = await prisma.savedItem.findUnique({
        where: {
          userid: context.session.user.id,
          id: data.id,
        },
      })

      return item
    } catch {
      console.error("Couldn't fetch item")
    }
    // if (!item) {
    //   throw notFound()
    // }
  })
