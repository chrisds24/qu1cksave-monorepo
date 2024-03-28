'use client'

import { useRouter } from 'next/navigation';

export default function Page() {
  // TODO: Remove 'use client' above and only make components that require
  // interactivity be the client components.

  const router = useRouter();

  // TODO: Search "localStorage is not defined nextjs".
  // It still works though even though I'm getting this in the terminal.
  // TODO: Add a sign out button
  // TODO: Redirect to jobs page if going to login or signup pages while logged in.

  const user = localStorage.getItem('user');
  if (user) {
    const { name } = JSON.parse(user as string);

    return (
      <h1>Hello {name}!</h1>
    );
  } else {
    router.push('/login');
  }
}