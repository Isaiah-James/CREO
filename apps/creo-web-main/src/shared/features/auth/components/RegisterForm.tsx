import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import RegisterFormEmailVerificationStep from './RegisterFormEmailVerificationStep';
import RegisterFormInformationStep from './RegisterFormInformationStep';
import { Separator } from '@creo/ui';

type RegisterFormStepType = 'information' | 'verify-email';

export interface RegisterFormStepProps {
  setStep: Dispatch<SetStateAction<RegisterFormStepType>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function RegisterForm() {
  const [step, setStep] = useState<'information' | 'verify-email'>(
    'information'
  );
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  switch (step) {
    case 'information':
      return (
        <RegisterFormInformationStep
          setIsLoading={setIsLoading}
          setStep={setStep}
        />
      );
    case 'verify-email':
      return <RegisterFormEmailVerificationStep />;
    default:
      return (
        <RegisterFormInformationStep
          setIsLoading={setIsLoading}
          setStep={setStep}
        />
      );
  }
}

const Loader = () => {
  return (
    <div className="flex flex-col items-center gap-4 w-1/4 min-w-fit max-w-md">
      <Image
        src={'/assets/loader2.svg'}
        alt="Loading"
        height={156}
        width={156}
        className="animate-in fade-in slide-in-from-bottom-16 duration-1000"
      />
      <Separator className="animate-in fade-in zoom-in duration-700" />
      <p className="text-4xl font-light text-slate-700 animate-in fade-in slide-in-from-top-16 duration-1000 text-nowrap">
        One Moment Please...
      </p>
    </div>
  );
};
