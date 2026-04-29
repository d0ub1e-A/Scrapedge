import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { mapUrlFn, scrapeBulkUrlFn, scrapeUrlFn } from '#/data/items'
import { bulkImportSchema, singleImportSchema } from '#/schemas/import'
import type { SearchResultWeb } from '@mendable/firecrawl-js'
// import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Globe, LinkIcon, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()
  const [isBulkPending, startBulkTransition] = useTransition()
  const navigate = useNavigate()

  const [discoveredLinks, setDiscoveredLinks] = useState<
    Array<SearchResultWeb>
  >([])
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())

  function handleSelectAll() {
    if (selectedUrls.size === discoveredLinks.length) {
      setSelectedUrls(new Set())
    } else {
      setSelectedUrls(new Set(discoveredLinks.map((link) => link.url)))
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

  const singleImportForm = useForm({
    defaultValues: {
      url: '',
    },
    validators: {
      onSubmit: singleImportSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async function () {
        await scrapeUrlFn({ data: value })
        singleImportForm.reset()
        toast.success('Scraped successfully!')
        navigate({ to: '/dashboard/items' })
      })
    },
  })

  const bulkImportForm = useForm({
    defaultValues: {
      url: '',
      search: '',
    },
    validators: {
      onSubmit: bulkImportSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async function () {
        const data = await mapUrlFn({ data: value })

        if (data) {
          setDiscoveredLinks(data)
          bulkImportForm.reset()
        } else {
          toast.error('Could not import urls.')
        }
      })
    },
  })

  return (
    <div className={`flex flex-1 items-center justify-center py-8`}>
      <div className={`w-full max-w-2xl space-y-6 px-4`}>
        {/* Header */}
        <div className={`text-center`}>
          <h1 className={`text-3xl font-bold`}>Import Content</h1>
          <p className={`text-muted-foreground pt-2`}>
            Save web pages in your library for later
          </p>
        </div>

        <Tabs defaultValue="single">
          <TabsList className={`w-full grid grid-cols-2`}>
            <TabsTrigger value="single" className={`gap-2`}>
              <LinkIcon className={`size-4`} />
              Single URL
            </TabsTrigger>
            <TabsTrigger value="bulk" className={`gap-2`}>
              <Globe className={`size-4`} />
              Bulk Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>Scrape Single Url</CardTitle>
                <CardDescription>
                  Scrape and save content from any web app
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    singleImportForm.handleSubmit()
                  }}
                >
                  <FieldGroup>
                    <singleImportForm.Field
                      name="url"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="https://wikipedia.com/fish"
                              autoComplete="off"
                              type="text"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    ></singleImportForm.Field>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className={`size-4 animate-spin`} />
                          Processing...
                        </>
                      ) : (
                        'Scrape'
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>Import Bulk Url</CardTitle>
                <CardDescription>
                  Discover and import multiple URL from a website at once
                </CardDescription>
              </CardHeader>

              <CardContent className={`space-y-6`}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    bulkImportForm.handleSubmit()
                  }}
                >
                  <FieldGroup>
                    <bulkImportForm.Field
                      name="url"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="https://wikipedia.com/fish"
                              autoComplete="off"
                              type="text"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    ></bulkImportForm.Field>
                    <bulkImportForm.Field
                      name="search"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Filter (optional)
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="e.g. Blog, Docs, Article"
                              autoComplete="off"
                              type="text"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    ></bulkImportForm.Field>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className={`size-4 animate-spin`} />
                          Processing...
                        </>
                      ) : (
                        'Import URLs'
                      )}
                    </Button>
                  </FieldGroup>
                </form>

                {/* Discovered URLs list */}
                {discoveredLinks.length > 0 && (
                  <div className={`space-y-4 py-3 md:py-5`}>
                    <div className={`flex items-center justify-between`}>
                      <p className={`text-sm font-medium`}>
                        Found {discoveredLinks.length} links
                      </p>
                      <Button
                        onClick={handleSelectAll}
                        variant={'outline'}
                        size={'sm'}
                      >
                        {selectedUrls.size === discoveredLinks.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </Button>
                    </div>

                    <div
                      className={`max-h-80 space-y-2 overflow-y-auto rounded-md border p-4`}
                    >
                      {discoveredLinks.map((link) => (
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
                            <p
                              className={`text-muted-foreground truncate text-xs`}
                            >
                              {link.description ??
                                'No description for this link'}
                            </p>
                            <p
                              className={`text-muted-foreground truncate text-xs`}
                            >
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
                          <Loader2 className={`size-4 animate-spin`} />{' '}
                          Scraping...
                        </>
                      ) : (
                        `Scrape ${selectedUrls.size} URL(s)`
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
