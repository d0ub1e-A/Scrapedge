import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar'
import type { NavPrimaryProps } from '#/lib/types'
import { Link } from '@tanstack/react-router'

export function NavPrimary({ items }: NavPrimaryProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size={`sm`}>
                  <Link
                    activeProps={{ 'data-active': true }}
                    to={item.to}
                    // search={
                    //   item.to === '/dashboard/items'
                    //     ? {
                    //         q: 'Neon',
                    //         status: 'COMPLETED',
                    //       }
                    //     : {
                    //         q: '',
                    //         status: 'all',
                    //       }
                    // }
                    activeOptions={item.activeOptions}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
