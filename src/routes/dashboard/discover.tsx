import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { Checkbox } from '#/components/ui/checkbox.tsx'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { scrapeBulkUrlFn, searchWebFn } from '#/data/items.ts'
import { searchSchema } from '#/schemas/import.ts'
import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2, Search, Sparkles } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/discover')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()
  const [searchResults, setSearchResults] = useState<Array<SearchResultWeb>>([])
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
  const [isBulkPending, startBulkTransition] = useTransition()
  const navigate = useNavigate()

  function handleSelectAll() {
    if (selectedUrls.size === searchResults.length) {
      setSelectedUrls(new Set())
    } else {
      setSelectedUrls(new Set(searchResults.map((link) => link.url)))
    }
  }

  function handleToggleUrl(url: string) {
    const newSelected = new Set(selectedUrls)

    if (newSelected.has(url)) {
      newSelected.delete(url)
    } else {
      newSelected.add(url)
    }

    setSelectedUrls(newSelected)
  }

  function handleBulkImport() {
    startBulkTransition(async function () {
      if (selectedUrls.size === 0) {
        toast.error('No url selected. Select At least one.')
        return
      }

      await scrapeBulkUrlFn({
        data: { urls: Array.from(selectedUrls) },
      })

      toast.success(`${selectedUrls.size} URL(s) scraped successfully.`)
      navigate({ to: '/dashboard/items' })
    })
  }

  const form = useForm({
    defaultValues: {
      query: '',
    },
    validators: {
      onSubmit: searchSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async function () {
        const result = await searchWebFn({ data: { query: value.query } })

        setSearchResults(result)
      })
    },
  })

  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Discover</h1>
          <p className="text-muted-foreground pt-2">
            Search the web for articles on any topic
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Sparkles className="size-5 text-primary" />
              Topic Search
            </CardTitle>
            <CardDescription>
              Search the web for your topic of interest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              <FieldGroup>
                <form.Field
                  name="query"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Search Query
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="e.g., Tanstack Start tutorial"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />

                <Button disabled={isPending} type="submit">
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Search className="size-4" />
                      Search
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>

            {/* Discovered URLs list */}
            {searchResults.length > 0 && (
              <div className={`space-y-4 py-3 md:py-5`}>
                <div className={`flex items-center justify-between`}>
                  <p className={`text-sm font-medium`}>
                    Found {searchResults.length} links
                  </p>
                  <Button
                    onClick={handleSelectAll}
                    variant={'outline'}
                    size={'sm'}
                  >
                    {selectedUrls.size === searchResults.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                </div>

                <div
                  className={`max-h-80 space-y-2 overflow-y-auto rounded-md border p-4`}
                >
                  {searchResults.map((link) => (
                    <label
                      key={link.url}
                      className={`hover:bg-muted/50 cursor-pointer flex items-start gap-3 rounded-md p-2`}
                    >
                      <Checkbox
                        checked={selectedUrls.has(link.url)}
                        onCheckedChange={() => handleToggleUrl(link.url)}
                        className={`mt-0.5`}
                      />
                      <div className={`min-w-0 flex-1`}>
                        <p className={`truncate text-sm font-medium`}>
                          {link.title ?? 'No title for this link'}
                        </p>
                        <p className={`text-muted-foreground truncate text-xs`}>
                          {link.description ?? 'No description for this link'}
                        </p>
                        <p className={`text-muted-foreground truncate text-xs`}>
                          {link.url}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  disabled={isBulkPending}
                  onClick={handleBulkImport}
                  type="button"
                  className={`w-full`}
                >
                  {isBulkPending ? (
                    <>
                      <Loader2 className={`size-4 animate-spin`} /> Scraping...
                    </>
                  ) : (
                    `Scrape ${selectedUrls.size} URL(s)`
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
