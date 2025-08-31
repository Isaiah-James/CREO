/* eslint-disable @nx/enforce-module-boundaries */
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  cn,
  useSidebar,
} from '@creo/ui';
import {
  Bell,
  Home,
  Layers3,
  Puzzle,
  Pyramid,
  Search,
  Settings,
  UserRound,
  Users2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import useOverlay from '../../features/overlay/common/hooks/useOverlay';

// Simple CREO icon placeholder; replace with your actual logo component/SVG
function CreoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex size-8 items-center justify-center rounded-md border text-xs font-bold',
        className
      )}
      aria-label="CREO"
      title="CREO"
    >
      C
    </div>
  );
}

function BackgroundExpandCapture() {
  const { state, toggleSidebar } = useSidebar();

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (state !== 'collapsed') return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Treat these as "interactive" — clicking them should NOT expand
    const isInteractive = !!target.closest(
      [
        'a',
        'button',
        'input',
        'textarea',
        'select',
        '[role="button"]',
        '[data-sidebar=menu-button]',
        '[data-sidebar=menu-action]',
        '[data-sidebar=rail]',       // the edge rail
        '[data-sidebar=trigger]',    // the toggle button
      ].join(',')
    );

    if (!isInteractive) {
      // Click landed on background/padding/etc → expand
      toggleSidebar();
      // Prevent accidental follow-through (e.g., if something is underneath)
      e.stopPropagation();
      e.preventDefault();
    }
  }, [state, toggleSidebar]);

  return (
    <div className={cn("absolute w-full h-full", state == 'collapsed' && 'cursor-w-resize')} onClickCapture={onClickCapture} />
  );
}

// --- Active matching helpers ---
type MatchStrategy = 'exact' | 'startsWith';

function normalize(path: string) {
  // remove trailing slash except for root
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

function isActivePath(pathname: string, href: string, strategy: MatchStrategy) {
  const a = normalize(pathname);
  const b = normalize(href);
  if (strategy === 'exact') return a === b;
  // startsWith: make sure `/proj` doesn't match `/projects` accidentally by adding a slash guard
  if (b === '/') return a === '/';
  return a === b || a.startsWith(b + '/');
}

// Small wrapper to avoid repeating active logic
function NavItem(props: {
  href: string;
  label: string;
  icon: React.ElementType;
  tooltip?: string;
  strategy?: MatchStrategy;
}) {
  const { href, label, icon: Icon, tooltip, strategy = 'startsWith' } = props;
  const pathname = usePathname();
  const active = isActivePath(pathname ?? '/', href, strategy);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={tooltip ?? label} isActive={active} asChild>
        {/* aria-current for a11y; keeps styles data-driven via isActive */}
        <Link href={href} aria-current={active ? 'page' : undefined}>
          <Icon className={cn(active && 'text-accent-foreground')}/>
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function AppSidebar() {
  const overlay = useOverlay();


  return (
    <Sidebar variant="inset" className="border-r relative" collapsible="icon">
      {/* edge rail for easy toggling */}
      <SidebarRail />
      <BackgroundExpandCapture />

      {/* TOP */}
      <SidebarHeader className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CreoMark />
          {/* Title only when expanded */}
          <span className="text-accent-foreground text-2xl group-data-[collapsible=icon]:hidden">
            CREO
          </span>
        </div>
      </SidebarHeader>

      {/* MIDDLE NAV */}
      <SidebarContent>
        <SidebarMenu>
          <NavItem href="/" label="Home" icon={Home} strategy="exact" />
          <NavItem href="/projects" label="Projects" icon={Pyramid} />
          <NavItem href="/thinktanks" label="ThinkTanks" icon={Layers3} />
          <NavItem href="/communities" label="Communities" icon={Users2} />
          <NavItem href="/extensions" label="Extensions" icon={Puzzle} />
        </SidebarMenu>
      </SidebarContent>

      {/* BOTTOM (typically actions/modal openers, not routes) */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Search" variant="outline" size="sm">
              <Search />
              <span>Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Notifications" variant="outline" size="sm">
              <Bell />
              <span>Notifications</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => overlay.isOpen ? overlay.close() : overlay.open()} tooltip="Settings" variant="outline" size="sm">
                <Settings />
                <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Profile" variant="outline" size="sm" asChild>
              {/* If Profile navigates to /me or /account, use Link so it can be active */}
              <Link href="/account">
                <UserRound />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
