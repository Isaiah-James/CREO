'use client';

import { Button, Separator, useModal } from '@creo/ui';
import { ChevronsUpDown, Plus } from 'lucide-react';
import Image from 'next/image';

export default function ProjectsHomepage() {
  const modal = useModal();

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <aside className="flex flex-col h-full w-1/4 max-w-lg gap-4">
        <div className="group flex items-center gap-3 p-2 rounded-2xl hover:bg-muted cursor-pointer transition duration-300">
          <Image
            src="/creo.png"
            alt="Profile"
            width={50}
            height={50}
            className="rounded-full"
          />
          <Separator orientation="vertical" />
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Isaiah James</h2>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <p>Creator Profile</p>
            </div>
          </div>

          <ChevronsUpDown className="text-slate-700 w-7 h-7 group-hover:text-muted-foreground transition duration-300" />
        </div>

        <Separator />
        <Button onClick={() => modal.open('create-project')}>
          <Plus />
          New Project
        </Button>
      </aside>

      <main className="flex flex-1 flex-col items-center h-full">
        <header className="grid grid-cols-3 w-full p-4"></header>

        <section className="flex flex-1 w-full items-center justify-center">
          <p className="text-center text-slate-500">
            No projects yet. Create a new project to get started!
          </p>
        </section>
      </main>
    </div>
  );
}
