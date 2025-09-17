'use server';
import { cookies } from 'next/headers';
import { Option } from '../classes/option';

type APIRequestOptions = Omit<RequestInit, 'body'> & {
  body: object;
}

export default async function APIRequest<T>(
  path: string,
  options?: APIRequestOptions
): Promise<Option<T>> {
  const cookieStore = await cookies();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
      method: options?.method || 'GET',
      body: options?.body && JSON.stringify(options.body),
      headers: {
        Cookie: cookieStore.toString(),
        ...options?.headers
      },
      cache: options?.cache,
    });
    return res.ok ? Option.some(await res.json()) : Option.none();
  } catch (error) {
    console.error(`Failed to make an API Request to ${path}`, error);
    return Option.none();
  }
}
