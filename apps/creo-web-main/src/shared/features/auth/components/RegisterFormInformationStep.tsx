import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { RegisterFormStepProps } from './RegisterForm';
import { useRouter } from 'next/navigation';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Separator } from '@creo/ui';
import { useAuth } from '@creo/auth';
// --- Password helpers --------------------------------------------------------
const evaluatePassword = (pwd: string) => {
  const hasMinLength = pwd.length >= 9; // "greater than 8"
  const hasNumber = /[0-9]/.test(pwd); // interpreting "alphanumeric" as "has a number"
  const hasUpper = /[A-Z]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  const checks = { hasMinLength, hasNumber, hasUpper, hasSpecial };
  const score = Object.values(checks).filter(Boolean).length;
  const percent = (score / 4) * 100;

  return { checks, score, percent };
};

function PasswordChecklist({ password }: { password: string }) {
  const { checks, percent } = evaluatePassword(password);
  const score =
    (checks.hasMinLength ? 1 : 0) +
    (checks.hasNumber ? 1 : 0) +
    (checks.hasUpper ? 1 : 0) +
    (checks.hasSpecial ? 1 : 0);

  const barColor = (s: number) => {
    if (s <= 0) return 'bg-muted'; // nothing yet
    if (s === 1) return 'bg-destructive'; // weak
    if (s === 2) return 'bg-amber-500'; // okay
    if (s === 3) return 'bg-lime-500'; // good
    return 'bg-green-500'; // great (4/4)
  };

  const Row = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {ok ? (
        <Check className="size-4 text-green-500" aria-hidden />
      ) : (
        <X className="size-4 text-destructive" aria-hidden />
      )}
      <span className={ok ? 'text-green-600' : 'text-destructive'}>
        {label}
      </span>
    </div>
  );

  return (
    <aside
      className="rounded-2xl w-full md:w-80 bg-background"
      aria-live="polite"
    >
      <h3 className="text-base font-semibold mb-3">Password strength</h3>

      {/* Progress */}
      <div className="mb-4">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full transition-[width] duration-300 ${barColor(
              score
            )}`}
            style={{ width: `${percent}%` }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            role="progressbar"
          />
        </div>
        <p className="mt-2 text-xs">
          {percent === 0
            ? 'All checks must be met to continue.'
            : score < 4
            ? 'Almost there—meet all checks for a strong password.'
            : 'Nice! Your password meets all checks.'}
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        <Row ok={checks.hasMinLength} label="Greater than 8 characters" />
        <Row ok={checks.hasNumber} label="Has at least 1 number" />
        <Row ok={checks.hasUpper} label="Has at least 1 uppercase letter" />
        <Row ok={checks.hasSpecial} label="Has at least 1 special character" />
      </div>
    </aside>
  );
}

// --- Form schema (keeps UI + validation aligned) -----------------------------
const formSchema = z
  .object({
    email: z.email(),
    username: z.string().min(3, {
      message: 'Username must be at least three characters long.',
    }),
    password: z
      .string()
      .min(9, { message: 'Password must be at least 9 characters.' }) // > 8
      .refine((s) => /[0-9]/.test(s), {
        message: 'Password must contain at least one number.',
      })
      .refine((s) => /[A-Z]/.test(s), {
        message: 'Password must contain at least one uppercase letter.',
      })
      .refine((s) => /[^A-Za-z0-9]/.test(s), {
        message: 'Password must contain at least one special character.',
      }),
    confirm: z.string(),
  })
  .required()
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords must match.',
    path: ['confirm'],
  });

type ValueType = z.infer<typeof formSchema>;

export default function RegisterFormInformationStep({
  setIsLoading,
  setStep,
}: RegisterFormStepProps) {
  const { login, register } = useAuth();
  const router = useRouter();
  const form = useForm<ValueType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirm: '',
    },
    mode: 'onChange', // helps the checklist feel responsive
  });

  const password = form.watch('password') ?? '';

  const onSubmit = async (values: ValueType) => {
    setIsLoading(true);

    await register(values.username, values.email, values.password);
    await login(values.email, values.password);  


    router.push("/");
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6 w-1/4 max-w-screen-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border w-full max-w-5xl p-6 rounded-2xl  bg-black animate-in fade-in slide-in-from-bottom-16 duration-700 flex flex-col justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-light text-slate-700">
              Create An Account
            </h2>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
            {/* Left: form fields */}
            <div className="flex-1 flex flex-col gap-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input autoComplete="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirm"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button type="submit" variant={'outline'} className="w-full">
                  Sign Up
                </Button>
              </div>
            </div>

            {/* Right: live password checklist */}
            <PasswordChecklist password={password} />
          </div>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <p>OR</p>
            <Separator className="flex-1" />
          </div>
        </form>
      </Form>
    </div>
  );
}
