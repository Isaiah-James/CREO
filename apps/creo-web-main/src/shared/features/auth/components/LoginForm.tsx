'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { useAuth } from '@creo/auth';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Separator,
} from '@creo/ui';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = z.object({
    email: z.email(),
    password: z.string().min(8),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login, user } = useAuth();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    await login(data.email, data.password);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (user) {
      const redirectTo = params.get('redirect') || '/';
      router.replace(redirectTo);
    }
  }, [user, params, router]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-5 w-3/4 max-w-3xl p-4"
      >
        <div className="flex flex-col items-center gap-6">
          <Image src={'/creo.svg'} alt="CREO" width={224} height={224} />
        </div>
        <Separator className="mt-2" />

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Email" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center gap-1">
              <Loader2 className="animate-spin i" />
              <p className="text-white">Logging in...</p>
            </div>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </Form>
  );
}
