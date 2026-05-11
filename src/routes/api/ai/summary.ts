import { prisma } from "#/db.ts";
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/ai/summary')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { itemId, prompt } = await request.json()

        if (!itemId || !prompt) {
          return new Response('Prompt or itemId missing')
        }

        const item = await prisma.savedItem.findUnique({
          where: {
            id: itemId,
          }
        })
      },
    },
  },
})
