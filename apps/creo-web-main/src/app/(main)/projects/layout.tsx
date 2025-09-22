import React from 'react';
import { Metadata } from 'next';
import ProjectsHeader from '@/domains/projects/home/components/layout/projects-header';

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Projects | CREO',
  description:
    'Projects help you organize goals, track tasks, and share resources with your team. Build boards and timelines, collaborate in real time, and bring ideas to life in a space designed for growth and creativity.',
  keywords: ['projects, goals, collaborate, create, tasks, milestones']
};

export default function ProjectsLayout({ children }: Props) {
  return (
    <div className="flex flex-col flex-1">
      <ProjectsHeader />
      <div className="flex flex-1">{children}</div>
    </div>
  );
}
