'use client';
import { Button, Separator } from '@creo/ui';
import { Pyramid } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HTMLProps } from 'react';

export default function ProjectsHeader() {
  return (
    <header className="flex items-center justify-between gap-4  p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Pyramid className="text-accent-foreground" />
            <span className="text-xl">Projects</span>
          </div>
        </div>

        <Separator orientation="vertical" />

        <div className="flex items-center gap-2">
          <HeaderNavButton href="/projects" label="Home" />
          <HeaderNavButton href="/projects/dashboard" label="Dashboard" />
          <HeaderNavButton href="/projects/creators" label="Creators" />
          <HeaderNavButton href="/projects/explore" label="Explore" />
        </div>
      </div>

      <div className="flex items-center justify-end"></div>
    </header>
  );
}

type NavButtonProps = Omit<HTMLProps<HTMLAnchorElement>, 'href'> & {
  href: string;
  label: string;
};

const HeaderNavButton: React.FC<NavButtonProps> = ({ href, label }) => {
  const pathname = usePathname();

  const isActive =
    href == '/projects' ? pathname === '/projects' : pathname.startsWith(href);

  return (
    <Link href={href}>
      <Button variant={isActive ? 'default' : 'text'} className="rounded-full">
        {label}
      </Button>
    </Link>
  );
};
