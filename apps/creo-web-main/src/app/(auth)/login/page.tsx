import LoginForm from '@/shared/features/auth/components/LoginForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login | CREO',
  description: 'Login to your CREO account',
};

export default function LoginPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
