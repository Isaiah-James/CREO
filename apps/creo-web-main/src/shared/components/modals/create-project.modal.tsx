import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  MenuStep,
  MultistepMenuControls,
  MultistepModal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from '@creo/ui';
import { zodResolver } from '@hookform/resolvers/zod';
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
  },
];

const STEPS: MenuStep[] = [
  {
    id: 'project-details',
    content: (controls) => <ProjectDetails controls={controls} />,
  },
];

export default function CreateProjectModal() {
  return (
    <MultistepModal
      type="create-project"
      name="Create Project"
      description="Create a new CREO Project."
      Icon={LuPlus}
      steps={STEPS}
    />
  );
}

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  slogan: z.string(),
  visibility: z.enum(['private', 'public']),
  thinktank: z.enum(THINKTANKS.map((s) => s.id.toString())),
  dueDate: z.date().optional(),
  startDate: z.date().optional(),
});

type FormType = z.infer<typeof formSchema>;

const ProjectDetails: React.FC<{ controls: MultistepMenuControls }> = ({
  controls,
}) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      slogan: '',
      visibility: 'private',
      thinktank: '0',
      dueDate: undefined,
      startDate: undefined,
    },
  });

  const onSubmit = (values: FormType) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  {...field}
                  placeholder="Enter a name for the project."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  className="resize-none"
                  placeholder="Give a brief overview of what this project is about."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="slogan"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slogan</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  {...field}
                  placeholder="Give this project a catch-phrase for people to remember it by."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-4">
          <FormField
            name="thinktank"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>ThinkTank</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ThinkThank" />
                    </SelectTrigger>
                    <SelectContent>
                      {THINKTANKS.map((s) => (
                        <SelectItem
                          key={`thinktank-selection-${s.id}`}
                          value={s.id.toString()}
                        >
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="visibility"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Visibility</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};