import { createClientOnlyFn } from '@tanstack/react-start'
import { toast } from 'sonner'

export const copyToClipboard = createClientOnlyFn(async function (url: string) {
  await navigator.clipboard.writeText(url)
  toast.success(`URL copied (${url.slice(0, 17)}...)`)

  return
})
