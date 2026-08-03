import { prisma } from '#/db.ts'
import { createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '#/middlewares/auth'
import { streamText } from 'ai'
import { openrouter } from '#/lib/open-router.ts'

export const Route = createFileRoute('/api/ai/summary')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        const { itemId, prompt } = await request.json()

        if (!itemId || !prompt) {
          return new Response('Prompt or itemId missing', { status: 400 })
        }

        const item = await prisma.savedItem.findUnique({
          where: {
            id: itemId,
            userid: context?.session.user.id,
          },
        })

        if (!item) {
          return new Response('Item not found', { status: 404 })
        }

        // Stream summary
        const res = streamText({
          model: openrouter.chat('inclusionai/ling-3.0-flash:free'),
          system: `You are a helpful assistant that creates concise, informative summaries of web content.
Your summaries should:
- Be 2-3 paragraphs long
- Capture the main points and key takeaways
- Be written in a clear, professional tone`,
          prompt: `Please summarize the following content:\n\n${prompt}`,
          maxOutputTokens: 1000,
        })

        // Return the response for useCompletion hook expects
        return res.toTextStreamResponse()
      },
    },
  },
})
