'use client';
import { useAuth } from '@creo/auth';
import { getTimeBasedGreeting, useTime } from '@creo/common';

export default function HomePage() {
  const { user } = useAuth();
  const { now } = useTime();

  return (
    <div className="p-4">
      <header className="grid grid-cols-3 items-center">
        <div className="flex flex-col">
          <h3 className="text-xl">
            {getTimeBasedGreeting(now)},{' '}
            <span className="font-semibold text-accent-foreground">
              {user?.username}
            </span>
            .
          </h3>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening in CREO:
          </p>
        </div>
      </header>
    </div>
  );
}
