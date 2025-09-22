import React from 'react';
import Image from 'next/image';

export default function Emblem() {
  return (
    <div className="absolute flex w-full h-full items-center justify-center">
      <Image src={'/creo.svg'} alt="CREO" width={444} height={444} />
    </div>
  );
}
