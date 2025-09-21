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
  FormLabel,
  FormMessage,
  Input,
  Separator,
  Switch,
} from '@creo/ui';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Config from '@/shared/utils/config';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = z.object({
    identifier: z.string().min(2).max(100),
    password: z.string().min(8),
    remember: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: '',
      password: '',
      remember: false,
    },
  });

  const { login, user } = useAuth();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    await login(data.identifier, data.password);
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
        className="flex flex-col items-center justify-center gap-5 w-full sm:w-3/4 sm:max-w-3xl p-4"
      >
        <div className="flex flex-col items-center gap-6">
          <Image src={'/CREO.svg'} alt="CREO" width={424} height={424} className='select-none  '/>
          <p className="text-2xl text-center font-light">
            Please login to your account to continue.
          </p>
        </div>
        <Separator className="mt-4" />

        <FormField
          name="identifier"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Username (or Email)"
                  {...field}
                  disabled={isSubmitting}
                />
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

        <FormField
          name="remember"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full flex items-center justify-between px-3">
              <FormLabel className="text-muted-foreground">
                Remember Me
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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

        <p className="text-sm text-muted-foreground px-4 mt-4">
          By continuing, you agree to our{' '}
          <Link
            href={`${Config.PLATFORM_URL}/policies/terms-of-service`}
            target="_blank"
            className="text-accent-foreground underline"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href={`${Config.PLATFORM_URL}/policies/privacy`}
            target="_blank"
            className="text-accent-foreground underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </Form>
  );
}
