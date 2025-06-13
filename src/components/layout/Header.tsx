'use client';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, SETTINGS_NAV_ITEM } from '@/lib/constants';
import { Button } from '../ui/button';
import { PanelLeft } from 'lucide-react';

export function Header() {
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const currentNavItem = 
    [...NAV_ITEMS, SETTINGS_NAV_ITEM].find(item => item.match ? item.match(pathname) : pathname === item.href);
  const pageTitle = currentNavItem ? currentNavItem.label : 'EcoRoute AI';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      {isMobile && (
         <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      )}
      {!isMobile && <div className="w-[52px]"></div>} {/* Placeholder for desktop sidebar trigger if it were here */}
      <h1 className="text-xl font-semibold md:text-2xl">{pageTitle}</h1>
    </header>
  );
}
