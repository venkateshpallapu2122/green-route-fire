import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  return null; // Or a loading spinner, but redirect should handle it
}
