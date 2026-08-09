import { prisma } from '#/db'
import { firecrawl } from '#/lib/firecrawl'
import {
  bulkImportSchema,
  extractSchema,
  searchSchema,
  singleImportSchema,
} from '#/schemas/import'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { authFnMiddleware } from '#/middlewares/auth'
import { notFound } from '@tanstack/react-router'
import { generateText } from 'ai'
import { openrouter } from '#/lib/open-router.ts'
import type { SearchResultWeb } from '@mendable/firecrawl-js'

// server function for single url
export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .validator(singleImportSchema)
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
            // schema: extractSchema,
            prompt: 'please extract the author and also publishedAt timestamp',
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

// server function for finding out children urls
export const mapUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .validator(bulkImportSchema)
  .handler(async function ({ data }) {
    const result = await firecrawl.map(data.url, {
      limit: 15,
      sitemap: 'include',
      search: data.search ?? '',
    })
    return result.links
  })

export type BulkScrapeProgress = {
  completed: number
  total: number
  url: string
  status: 'success' | 'failed'
}
// server function for multiple url
export const scrapeBulkUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .validator(z.object({ urls: z.array(z.string().url()) }))
  .handler(async function* ({ data, context }) {
    const total = data.urls.length

    for (let i = 0; i < data.urls.length; i++) {
      const url = data.urls[i]

      const item = await prisma.savedItem.create({
        data: {
          url: url,
          userid: context.session.user.id,
          status: 'PENDING',
        },
      })

      let status: BulkScrapeProgress['status'] = 'success'

      try {
        const result = await firecrawl.scrape(url, {
          formats: [
            'markdown',
            {
              type: 'json',
              prompt:
                'please extract the author and also publishedAt timestamp',
              // schema: extractSchema,
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
        status = 'failed'

        await prisma.savedItem.update({
          where: { id: item.id },
          data: {
            status: 'FAILED',
          },
        })
      }

      const progress: BulkScrapeProgress = {
        completed: i + 1,
        total: total,
        url: url,
        status: status,
      }

      yield progress
    }
  })

// server function for fetching all saved items
export const getItemsFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async function ({ context }) {
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

// server function for fetching single saved item
export const getItemById = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async function ({ context, data }) {
    const item = await prisma.savedItem.findUnique({
      where: {
        userid: context.session.user.id,
        id: data.id,
      },
    })
    if (!item) {
      throw notFound()
    }
    return item
  })

export const deleteItemFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async function ({ context, data }) {
    await prisma.savedItem.deleteMany({
      where: {
        id: data.id,
        userid: context.session.user.id,
      },
    })
  })

// server function saving the generated summary and  generate tags and saving them too to the db
export const saveSummaryAndGenerateTagsFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .validator(
    z.object({
      id: z.string(),
      summary: z.string(),
    }),
  )
  .handler(async function ({ context, data }) {
    const existing = await prisma.savedItem.findUnique({
      where: {
        id: data.id,
        userid: context.session.user.id,
      },
    })

    if (!existing) {
      throw notFound()
    }

    const { text } = await generateText({
      model: openrouter.chat('nvidia/nemotron-3-ultra-550b-a55b:free'),
      system: `You are a helpful assistant that extracts relevant tags from content summaries.
Extract 3-5 short, relevant tags that categorize the content.
Return ONLY a comma-separated list of tags, nothing else.
Example: technology, programming, web development, javascript`,
      prompt: `Extract tags from this summary: \n\n${data.summary}`,
    })

    const tags = text
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0)
      .slice(0, 5)

    const item = await prisma.savedItem.update({
      where: {
        userid: context.session.user.id,
        id: data.id,
      },
      data: {
        summary: data.summary,
        tags: tags,
      },
    })

    return item
  })

export const searchWebFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .validator(searchSchema)
  .handler(async function ({ data }) {
    const result = await firecrawl.search(data.query, {
      limit: 5,
      tbs: 'qdr:y',
    })

    return result.web?.map((item) => ({
      url: (item as SearchResultWeb).url,
      title: (item as SearchResultWeb).title,
      description: (item as SearchResultWeb).description,
    })) as SearchResultWeb[]
  })
