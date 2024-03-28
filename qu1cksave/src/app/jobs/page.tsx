'use client'

// TODO: Remove 'use client' above and only make components that require
// interactivity be the client components.

import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

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