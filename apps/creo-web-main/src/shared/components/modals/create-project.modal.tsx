import { Button, Form, MenuStep, MultistepMenuControls, MultistepModal } from '@creo/ui';
import React from 'react';
import { useForm } from 'react-hook-form';
import { LuPlus } from 'react-icons/lu';
import { z } from 'zod';

const THINKTANKS = [
  {
    name: 'Software & Technology',
    id: 0,
  },
  {
    name: 'Arts & Entertainment',
    id: 1,
  },
  {
    name: 'Sports & Gaming',
    id: 2,
  },
  {
    name: 'Healthcare & Wellness',
    id: 3,
  },
  {
    name: 'Lifestyle & Culture',
    id: 4,
  },
  {
    name: 'Education & Academia',
    id: 5,
  },
  {
    name: 'Business & Finance',
    id: 6,
  },
  {
    name: 'Government & Society',
    id: 7,
  },
  {
    name: 'Research & Development',
    id: 8,
  },
  {
    name: '',
    id: 9,
  }
]


const STEPS: MenuStep[] = [
  {
    id: 'thinktank-selection',
    content: (controls) => <ThinkTankSelectionStep />,
  },
  {
    id: 'project-details',
    content: (controls) => <ProjectDetails controls={controls}/>
  }
];

export default function CreateProjectModal() {
  return (
    <MultistepModal type="create-project" name="Create Project" description='Create a new CREO Project.' Icon={LuPlus} steps={STEPS} />
  );
}

const ThinkTankSelectionStep: React.FC = () => {
  return (
    <div className='grid grid-cols-2 gap-4'>
      {THINKTANKS.map(t => (
        <Button variant={'outline'} key={`thinktan-selection-button-${t.name}-${t.id}`}>
          {t.name}
        </Button>
      ))}
      
    </div>
  );
};


const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  slogan: z.string(),
})

type FormType = z.infer<typeof formSchema>;

const ProjectDetails: React.FC<{ controls: MultistepMenuControls }> = ({ controls }) => {
  const form = useForm<FormType>(
    
  );
  
  return (
    <Form {...form}>
      <form>

      </form>
    </Form>
  )
}
