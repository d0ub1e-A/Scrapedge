# Scrapedge

Scrape blog articles and summarize with AI

- A near complete `<Link></Link>` component:
  ```jsx
  <Link
    activeProps={{ 'data-active': true }}
    to={item.to}
    search={
      item.to === '/dashboard/items'
        ? {
            q: 'Neon',
            status: 'COMPLETED',
          }
        : {
            q: '',
            status: 'all',
          }
    }
    activeOptions={item.activeOptions}
  ></Link>
  ```

- The most common properties within `activeOptions` are:

  - `exact`: When `true`, the link is only active if the current pathname matches the to prop exactly. If `false` (default), the link is active if the current pathname starts with the to prop (allowing for active parent links in nested routing).

  - `includeSearch`: Determines if the search parameters (query strings) must match for the link to be active.

  - `includeHash`: Determines if the URL hash must match.

  - `explicitUndefined`: If set, undefined search params are treated differently than missing ones.
