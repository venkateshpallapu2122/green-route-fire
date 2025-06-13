'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NAV_ITEMS, SETTINGS_NAV_ITEM } from '@/lib/constants';
import { Logo } from '@/components/icons/Logo';
import { Header } from './Header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Logo className="text-sidebar-primary h-8 w-8" />
            <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              EcoRoute AI
            </span>
          </Link>
        </SidebarHeader>
        <ScrollArea className="flex-grow">
          <SidebarContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.match ? item.match(pathname) : pathname === item.href}
                    tooltip={{ children: item.label, className: "ml-2"}}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
        <Separator className="my-2 bg-sidebar-border group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-3/4" />
        <SidebarFooter className="p-2">
           <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    asChild 
                    isActive={SETTINGS_NAV_ITEM.match ? SETTINGS_NAV_ITEM.match(pathname) : pathname === SETTINGS_NAV_ITEM.href}
                    tooltip={{ children: SETTINGS_NAV_ITEM.label, className: "ml-2"}}
                >
                <Link href={SETTINGS_NAV_ITEM.href}>
                    <SETTINGS_NAV_ITEM.icon />
                    <span>{SETTINGS_NAV_ITEM.label}</span>
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
