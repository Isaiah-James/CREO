'use client';
import { Button, useModal } from '@creo/ui';
import { Plus, Pyramid, Settings2 } from 'lucide-react';

export default function ProjectsHeader() {
  const modal = useModal();

  return (
    <header className="border-b p-3 grid grid-cols-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Pyramid className="text-accent-foreground" />
          <span className="text-2xl font-light">Projects</span>
        </div>
      </div>

      <div className=""></div>

      <div className="flex gap-2 justify-end">
        <Button variant={'outline'} size={'sm'}>
          <Settings2 />
          <span>Manage Projects</span>
        </Button>
        <Button onClick={() => modal.open('create-project')} size={'sm'}>
          <Plus />
          <span>New Project</span>
        </Button>
      </div>
    </header>
  );
}
