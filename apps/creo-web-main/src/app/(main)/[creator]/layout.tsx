import React from 'react'

interface Props {
    children: React.ReactNode;
    params: Promise<{ creator: string }>
}

export default async function CreatorLayout({ params, children }: Props) {
  const { creator } = await params;

  return (
    <div>
      <p>Creator Slug: {creator}</p>
      {children}
    </div>
  )
}
